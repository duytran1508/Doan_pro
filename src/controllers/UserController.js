const User = require('../models/UserModel')
const bcrypt = require("bcrypt")


const createUser = (newUser) =>{
    return new Promise(async (resolve, reject) => {
        const {name, email, password, confirmPassword, phone} = newUser

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser != null){
                resolve({
                    status: 'Oke',
                    message: 'Email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            console.log('hash', hash)
            const createdUser = await User.create({
                name, 
                email, 
                password: hash,  
                phone
            })
            if(createdUser){

                resolve({
                    status: 'Oke',
                    massage: 'Success',
                    // data: createdUser
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;

        try {
            const checkUser = await User.findOne({
                email: email
            });

            if (!checkUser) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined'
                });
                return; 
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'User or password incorrect'
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'Login success',
                // data: checkUser 
            });

        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id : id
            })
                if (checkUser === null){
                    resolve({
                        status: 'Oke',
                        message: 'User is not defined'
                    })
                }
                
                const updatedUser = await User.findByIdAndUpdate(id, data, { new : true})

                resolve({
                    status: 'Oke',
                    massage: 'Success',
                    data: updatedUser
                   
                })
        
        }catch(e){
            reject(e)
        }
    })
}
    
const deleteUser = (id) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id : id
            })
                if (checkUser === null){
resolve({
                        status: 'Oke',
                        message: 'User is not defined'
                    })
                }
                
                await User.findByIdAndDelete(id)
                resolve({
                    status: 'Oke',
                    massage: 'delete success'
                   
                })
        
        }catch(e){
            reject(e)
        }
    })
}

const getAllUser = () =>{
    return new Promise(async (resolve, reject) => {
        try {
               const allUser = await User.find()
                resolve({
                    status: 'Oke',
                    massage: 'success',
                    data: allUser
                   
                })
        
        }catch(e){
            reject(e)
        }
    })
}

const getDetailsUser = (id) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id : id
            })
                if (user === null){
                    resolve({
                        status: 'Oke',
                        message: 'User is not defined'
                    })
                }
                
                resolve({
                    status: 'Oke',
                    massage: 'success',
                    data: user
                   
                })
        
        }catch(e){
            reject(e)
        }
    })
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser, 
    getAllUser,
    getDetailsUser
}