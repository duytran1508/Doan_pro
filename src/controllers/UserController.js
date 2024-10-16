
const UserService = require('../services/UserService') 


const createUser = async (req, res) => {
    try{
        const {name, email, password, confirmPassword, phone} = req.body 
        if (!name || !email || !password || !confirmPassword || !phone){
            return res.status(200).json({
                status: 'ERR',
                message: 'the input is required'
            })
        }else if(password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the password is equal confirmPassword '
            })
        }
       const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try{
        const { email, password} = req.body
        if ( !email || !password ){
            return res.status(200).json({
                status: 'ERR',
                message: 'the input is required'
            })
        }
       const response = await UserService.loginUser(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try{
        const userId = req.params.id
        const data = req.body
        
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the userId is required '
            })
        }
        console.log('userId', userId)
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
    }

const deleteUser = async (req, res) => {
        try{
            const userId = req.params.id  
            if(!userId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'the userId is required '
                })
            }
            console.log('userId', userId)
            const response = await UserService.deleteUser(userId)
            return res.status(200).json(response)
        }catch(e){
            return res.status(404).json({
                message: e
            })
        }
        }

const getAllUser = async (req, res) => {
        try{
            const response = await UserService.getAllUser()
            return res.status(200).json(response)
        }catch(e){
            return res.status(404).json({
                message: e
            })
        }
        }

const getDetailsUser = async (req, res) => {
            try{
                const userId = req.params.id  
                if(!userId) {
                    return res.status(200).json({
                        status: 'ERR',
                        message: 'the userId is required '
                    })
                }
                const response = await UserService.getDetailsUser(userId)
                return res.status(200).json(response)
            }catch(e){
                return res.status(404).json({
                    message: e
                })
            }
            }

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser, 
    getAllUser,
    getDetailsUser,

}