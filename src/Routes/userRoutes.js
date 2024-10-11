import express from 'express'
import {addUser,userLogin, sendOtp, submitOtp,otpVarification,updateUserPassword,getUser,deleteUserById,findDataByUserName,updateById, findUserById, updateStatusByAdmin, uploadUserImage} from '../Controllers/userController.js'
import {authenticate} from '../Middleware/jwtAuthnticate.js'
import multer from 'multer'
const userRouter = express.Router()
const uploadImage = multer({storage:multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'./upload')
    },
    filename:function(req,file,cb)
    {
        cb(null,Date.now()+"_"+file.originalname)
    }
})})



userRouter.post('/register', addUser);
userRouter.post('/uploadImage', uploadImage.single('image'),uploadUserImage);
userRouter.post('/login',userLogin)
userRouter.post('/sendOtp',sendOtp)
userRouter.post('/submitOtp',submitOtp)
userRouter.patch('/otpVarification',otpVarification)
userRouter.patch('/updateUserPassword',updateUserPassword)
userRouter.get('/getUser',getUser)
userRouter.delete('/deleteUser/:id',deleteUserById)
userRouter.get('/findUserbyName/:key',findDataByUserName)
userRouter.patch('/updateUserById/:id',updateById)
userRouter.get('/getUserById/:id',findUserById)
userRouter.patch('/updateUserStatus/:id',updateStatusByAdmin)

    
export default  userRouter

