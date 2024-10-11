import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY

export const authenticate = (req,res,next)=>{

    
    const tokenGet = req.headers['authorization']
    
    if(tokenGet)
    {

       const shortToken = tokenGet.split(' ')[1]
       
       const varifyToken = jwt.verify(shortToken,SECRET_KEY)
       if(varifyToken)
       {
         next()
       }
       else{
          res.status(400).send({msg:"Invalid Token"})
       }   
    }
    else{

        res.status(500).send({msg:"Token is required"})
    }
    
    
}