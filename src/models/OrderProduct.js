const mongoose = require ('mongoose')
const Product = require('./ProductModel')
const { type } = require('express/lib/response')

const oderSchema = new mongoose.Schema ({
    oderItems:[
        {
            name: {type: String, required: true},
            amount: {type: Number, required: true},
            image: {type: String, required: true},
            price: {type: Number, required: true},
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    shippingAddress:{
        fullName: {type: String, required: true},
        address: {type: String, required: true},
        city: {type: String, required: true},
        phone: {type: Number, required: true},
    },
    paymentMethod: {type: String, required: true},
    itesmPrice: {type: Number, required: true},
    shippingPrice: {type: Number, required: true},
    taxPrice: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    isPaid: {type: Boolean, default: false},
    paidAt: {type: Date},
    isDelivered: {type: Boolean, default: false},
    delivereAt: {type: Date},
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', oderSchema);
module.exports = Order 