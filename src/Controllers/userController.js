import userModel from '../Model/userModel.js';
import { Success, failure, login } from '../utils/responseWrapper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import otpgenerator from 'otp-generator'
import passGenerator from 'generate-password'
import twillio from 'twilio'
import fs from 'fs'
import cloudinary from 'cloudinary'
import { log } from 'console';

cloudinary.config({ 
    cloud_name: 'dbdmxzalv', 
    api_key: '321272226956835', 
    api_secret: '3PQQTFLr0DjIDm0UmgWV-dw15RY' // Click 'View API Keys' above to copy your API secret
});

dotenv.config()

// Function to add a new user

export const addUser = async (req, res) => 
    {
    
        // const OTP = Math.floor(100 + Math.random() * 150)
        const OTP = Math.floor(1000 + Math.random() * 9000);
            
             try {
        // Log the request body (consider removing or securing this in production)
        
        console.log(req.body);

        const { name, email, password, address,phone,image } = req.body;
        console.log(name,email,password,address,phone,image);
         
        // Input validation check all field are required and not

        if ( !name || !email  || !address || !phone  ) 
            {
                return  res.status(400).send(failure(400, 'All fields are required.'));
            }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
           
        if (existingUser) 
        {
            return res.status(400).send(failure(400, 'Email already registered.'));
        }   
    
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        // const transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true, // true for port 465, false for other ports
        //     auth: {
        //         user: 'sohelkhanp619@gmail.com',
        //         pass: 'innd luun zfhf bfbb'
        //     }      
        // })

        // //send OTP on Mail 
        // const info = await transporter.sendMail({

        //     from:"sohelkhanp619@gmail.com",
        //     to:email,
        //     subject:"OTP ",
        //     text: String(OTP),
        //     html:`<html> OTP bta de yar ${OTP} </html>`

        // })
             
        // if(info.messageId)



        {    
          const response = await userModel.create({
              name,
              email,
              password: hashedPassword, // Ensure the key matches your model
              address,
              OTP,
              phone,
              image
            
          });
          res.status(201).send(Success(response));
       }
        
        // Send success response
    } catch (error) 
     {

        // Handle specific errors as necessary
        res.status(500).send(failure(500, error.message || 'An error occurred.'));
    }
};


// this otp varification for user register time 

export const otpVarification = async (req,res)=>{

  try {
    const{userOTP} = req.body
    
    const response = await userModel.updateOne({OTP:userOTP},{$set:{isVarify:true}})
    //password send on user email after varification by otp

    const passGenerate = await passGenerator.generate({length: 10,numbers: true });
    
    const data = await userModel.findOne({OTP:userOTP})

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: 'sohelkhanp619@gmail.com',
            pass: 'innd luun zfhf bfbb'
        }      
    })

    //send OTP on Mail 
    const info = await transporter.sendMail({

        from:"sohelkhanp619@gmail.com",
        to:data.email,
        subject:"Password",
        text: String(passGenerate),
        html:`<html> Password yad rakhna  ${passGenerate} </html>`

    })
    
    if(info.messageId)
        {    
            const hashedPassword = await bcrypt.hash(passGenerate,10)


          const update = await userModel.updateOne({email:data.email},{$set:{ password: hashedPassword}} );
          res.status(200).send({msg:"Success",data:update})
       }

    } catch (error) {
    
        res.status(400).send({msg:"Failed verification",error})
    }
    
}

export const userLogin = async (req,res)=>{
    try {
        
        const { email, password } = req.body;
        const response = await userModel.findOne({email,isVarify:true})
         if(response){
            
            //Compare password method by bcrypt
            const comparePassword = await bcrypt.compare(password,response.password)
            if(comparePassword)
            {
                //Create jwt authentication code 
                let token = jwt.sign({response},process.env.SECRET_KEY,{expiresIn:"24h"})
                
                res.status(200).send(login(response,token))
            }
            else{
                res.status(401).send(failure('Invalid Password'))
            }
         }   
         
         else{
                       //this is failure function
            res.status(401).send(failure("User not found"))
         }

        
    } catch (error) {

        res.send(failure(400,error))
        
    }

}

//send OTP method for user varification
export const sendOtp = async (req,res)=>{

    try {
           const {email} = req.body

          //send to user mail
          const otp = Math.floor(1000 + Math.random() * 9000);
          console.log(otp);

         const response = await userModel.findOne({email})
         
         if(!response)
          {
             res.status(400).send({msg:"user not found",status:"failed"})
           }
        else{

         let transporter = nodemailer.createTransport({

            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for port 465, false for other ports
            auth: {
                user: 'sohelkhanp619@gmail.com',
                pass: 'innd luun zfhf bfbb'
            }      
         })
         let info = await transporter.sendMail({
            from:'sohelkhanp619@gmail.com',
            to: email,
            subject:"Forgot Password OTP",
            text:String(otp),
            html:`<html> OTP bta de nhi to Password change nhi hoga ${otp} </html>`
         })         
            if(info.messageId)
            {          
                
                let updateOtp  = await userModel.updateOne({email:email},{$set:{OTP:otp}})
                
                if(updateOtp)
                {                    
                    return res.status(201).send({ msg: "User OTP Send successfully", status: "Success" });
                }
                else{
                    return res.status(400).send({ msg: "User OTP not updated", status: "failed" });
                    }

            }
            else{
                res.status(400).send({msg:"server error",status:"failed"})
            }
    }
     }
     catch (error) {
        return res.status(500).send({ msg: "Internal server error", status: "failed" });
    }
     
}

             //OTP varification for the forgot password time 

export const submitOtp = async (req,res)=>{

    try {
        
        const{otp,email} = req.body  

        const response = await userModel.findOne({email:email})
         if(response.OTP===otp)
          {
            res.status(200).send({msg:"User otp varification successfully",})
         }
          else{
             res.status(400).send({msg:"User Otp doesn't match ",error})
          }        
    } catch (error) {
        res.status(400).send({msg:"Failed varification",error})
    }
}
export const updateUserPassword = async (req,res)=>{

    try {
        console.log(req.body);
        const{password,confPassword,email} = req.body
        
          
             const  hashedPassword = await bcrypt.hash(password,10)
             
             if(password===confPassword)
                {      
                    const updatePassword = await userModel.updateOne({email:email},{$set:{password:hashedPassword}})
                    res.status(200).send({msg:"User Password update successfully",data:updatePassword})
                }
            else{
                res.status(500).send({msg:"Password Doesn't Match "})
            }             
                                      

    } catch (error) {
        res.status(400).send({msg:"Failed Update password",error})
    }
}

export const getUser = async (req,res)=>{
    const{limit , page } = req.query
    const page1 = parseInt(page) || 1
    const limit1 = parseInt(limit)||10
    const startIndex = (page1-1) * limit1
    try {   
        // console.log("limit",limit,'page',page);
        
        const totalItems = await userModel.countDocuments();
        
        const totalPages = Math.ceil(totalItems / limit);
           
        const response = await userModel.find({}).limit(limit1).skip(startIndex);
        res.status(200).send({msg:"Success",data:response,totalItems:totalPages})
    } catch (error) {
        res.status(400).send({msg:"Failed get Data",error})
    }
}

export const deleteUserById = async (req,res)=>{
              
    try {
          const id = req.params.id
        
        const response = await userModel.findByIdAndDelete({_id:id})
        const path = response.image
        console.log(path);
        fs.unlink(path,(error)=>{
            if(error)
            {
                console.log(error);
                
            }
        })
        
        
        
        res.status(200).send({msg:"Success",data:response})
    } catch (error) {
        res.status(400).send({msg:"Failed delete user",error})
    }
}


 export const findDataByUserName = async (req,res)=>{
    try {
        
        
         const response = await userModel.find({
            $or:[
               {name:{$regex:req.params.key}},
               {email:{$regex:req.params.key}}
                
            ]
         })
    res.status(200).send({msg:"Success",data:response})
    } catch (error) {
        
        res.status(400).send({msg:"Failed find user",error})
    }
}

export const updateById = async (req,res)=>{
    try {
         const id = req.params.id;
         console.log();
         
         const{name,email,phone,address,image} = req.body

         const response = await userModel.updateOne({_id:id},{$set:{
            name:name,
            email:email,
            phone:phone,
            address:address,
            image:image
         }})
            console.log(response);
            
         res.status(200).send({msg:"Success",data:response})
    } catch (error) {

        res.status(400).send({msg:"Failed",error})
        
    }
}

export const findUserById = async (req,res)=>{

    try {
            const id = req.params.id
            const response = await userModel.findOne({_id:id})
            res.status(200).send({msg:"Success get user",data:response})         
    } catch (error) {
        
          res.status(400).send({msg:"Failed",error})
    }
}
export const uploadUserImage = async (req,res)=>{
    try {
        
      const uploadimage = await cloudinary.uploader.upload(req.file.path)
         fs.unlink(req.file.path,(err)=>{
            if(err)
            {
                console.log(err);
                return err
                
            }
            console.log('file Deleted Successfullyy');
                        
            
         })
           res.status(201).send({msg:"Success Image Upload",data:uploadimage.secure_url})
    } catch (error) {
        
    }
}
export const updateStatusByAdmin = async (req,res)=>{
     
      try {
        
           const id = req.params.id
           const {status} = req.body
           
           const response = await userModel.updateOne({_id:id},{$set:{status:status}})
           res.status(200).send({msg:"User Status Update Success",data:response})
      } catch (error) {

        res.status(400).send({msg:"Failed Update user Status",error})
        
      }
}