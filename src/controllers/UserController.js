const UserService = require("../services/UserService");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(200).json({
        status: "ERR",
        message: "the input is required"
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "the password is equal confirmPassword "
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required',
            });
        }
        const response = await UserService.loginUser(req.body);

        if (response.status === 'ERR') {
            return res.status(400).json({
                status: 'ERR',
                message: response.message, 
            });
        }

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'An error',
        });
    }
};

// const logoutUser = async (req, res) => {
//     try{
//         res.clearCookie('checkUser')
//         return res.status(200).json({
//             status: 'OKE',
//             message: 'Logout success'
//         })
//     }catch(e){
//         return res.status(400).json({
//             message: e
//         })
//     }
// }

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "the userId is required "
      });
    }
    console.log("userId", userId);
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "the userId is required "
      });
    }
    console.log("userId", userId);
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const deleteManyUser = async (req, res) => {
    try {
      const ids = req.body
      if (!ids) {
        return res.status(200).json({
          status: "ERR",
          message: "the ids is required "
        });
      }
      const response = await UserService.deleteManyUser(ids);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e
      });
    }
};
  

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "the userId is required "
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

module.exports = {
    createUser,
    loginUser,
    // logoutUser,
    updateUser,
    deleteUser,
    deleteManyUser,
    getAllUser,
    getDetailsUser
}; 