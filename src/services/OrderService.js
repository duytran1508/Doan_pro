const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const Voucher = require('../models/VoucherModel');

const createOrder = async (
  userId,
  cartId,
  shippingAddress,
  productIds,
  name,
  phone,
  email,
  voucherCode // nhận voucherCode từ controller
) => {
  try {
    const cart = await Cart.findById(cartId).populate("products.productId");
    if (!cart) {
      throw { status: 404, message: "Không tìm thấy giỏ hàng" };
    }

    // Lọc các sản phẩm trong giỏ hàng mà người dùng chọn
    const selectedProducts = cart.products.filter((item) =>
      productIds.includes(String(item.productId._id))
    );

    const validProducts = await Product.find({ _id: { $in: productIds } });
    if (!validProducts || validProducts.length === 0) {
      throw { status: 400, message: "Không có sản phẩm hợp lệ để thanh toán" };
    }

    // Lấy thông tin về sản phẩm và tính tổng giá trị của giỏ hàng
    const products = await Promise.all(
      selectedProducts.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw {
            status: 404,
            message: `Không tìm thấy sản phẩm với ID ${item.productId}`
          };
        }
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.prices
        };
      })
    );

    // Tính tổng giá trị của giỏ hàng
    const totalPrice = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    
    // Tính VAT và phí vận chuyển
    const VAT = totalPrice * 0.1; // Ví dụ, VAT là 10%
    const shippingFee = totalPrice >= 50000000 ? 0 : 800000; // Phí vận chuyển nếu tổng giá trị < 50 triệu

    // Áp dụng voucher giảm giá cho toàn bộ đơn hàng (chỉ giảm giá phần trăm)
    let discount = 0;
    if (voucherCode) {
      const voucher = await Voucher.findOne({ code: voucherCode });
      if (!voucher) {
        throw { status: 404, message: "Mã giảm giá không hợp lệ" };
      }

      // Kiểm tra nếu voucher là giảm giá phần trăm
      if (voucher.discount && voucher.discount >= 1 && voucher.discount <= 100) {
        // Áp dụng giảm giá theo phần trăm trên tổng đơn hàng (bao gồm phí vận chuyển và VAT)
        discount = (totalPrice + shippingFee + VAT) * (voucher.discount / 100);
        console.log("Applied Discount:", discount);
      } else {
        throw { status: 400, message: "Voucher giảm giá không hợp lệ" };
      }
    }

    // Tính tổng giá trị của đơn hàng sau khi áp dụng giảm giá
    const discountedPrice = totalPrice + shippingFee + VAT - discount;
    console.log("Discounted Price:", discountedPrice);

    // Tính tổng đơn hàng (sau khi giảm giá, cộng phí vận chuyển và VAT)
    const orderTotal = Math.max(discountedPrice, 0); // Đảm bảo giá trị không âm
    console.log("Order Total:", orderTotal);

    // Tạo đơn hàng mới
    const newOrder = new Order({
      name,
      phone,
      email,
      userId,
      cartId,
      products,
      shippingAddress,
      totalPrice,
      discount,
      VAT,
      shippingFee,
      orderTotal,
      status: "Pending"
    });

    console.log(newOrder);

    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();

    // Cập nhật lại giỏ hàng sau khi thanh toán
    cart.products = cart.products.filter(
      (item) => !productIds.includes(String(item.productId._id))
    );
    await cart.save();

    return {
      status: "OK",
      data: {
        ...newOrder.toObject(), // Chuyển object mongoose thành plain object
        discount // Thêm thông tin giảm giá vào phản hồi
      }
    };
  } catch (error) {
    console.error("Lỗi trong createOrder service:", error);
    throw error;
  }
};



const getAllOrdersByUser = async (userId) => {
  try {
    const orders = await Order.find({ userId }).populate("products.productId");
    return orders;
  } catch (error) {
    console.error("Lỗi trong getAllOrdersByUser service:", error);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find().populate("products.productId");
    return orders;
  } catch (error) {
    console.error("Lỗi trong getAllOrders service:", error);
    throw error;
  }
};

const getOrderById = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(orderId).populate(
        "products.productId"
      );
      if (!order) {
        return reject({
          status: "ERR",
          message: "Order not found"
        });
      }
      resolve(order);
    } catch (error) {
      reject({
        status: "ERR",
        message: "Error while retrieving order: " + error.message
      });
    }
  });
};
const cancelOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      throw { status: 400, message: "Order already delivered or cancelled" };
    }

    order.status = "Cancelled";

    await order.save();

    return order;
  } catch (error) {
    console.error("Error in cancelOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

const shipOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    if (order.status !== "Pending") {
      throw { status: 400, message: "Order is not in Pending status" };
    }

    order.status = "Shipped";

    await order.save();

    return order;
  } catch (error) {
    console.error("Error in shipOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

const deliverOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    if (order.status !== "Shipped") {
      throw { status: 400, message: "Order is not in Shipped status" };
    }

    order.status = "Delivered";

    await order.save();

    return order;
  } catch (error) {
    console.error("Error in deliverOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getAllOrders,
  getOrderById,
  cancelOrder,
  shipOrder,
  deliverOrder
};
