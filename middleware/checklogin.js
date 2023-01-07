const express = require(`express`)
const mongoose = require(`mongoose`)
const userdata = mongoose.model(`userdata`)
const jwt = require(`jsonwebtoken`)
const { secretKey } = require("../secret")


const checklogin=(req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.send({error : "User must be login first"})
    }
    const token = authorization.replace(`Bearer `,``)
    jwt.verify(token, secretKey , (err, decoded)=> {
        if(err){
            return res.send({error : "User must be login first"})
        }
     userdata.findById(decoded._id)
     .then((foundUser)=>{
        if(foundUser==null){
            return res.send({error : "User must be login first"})
        }
        console.log(`Login verified`)
        req.user = foundUser
        next()
     })
     .catch((err)=>{
        console.log(err)
     })
 
   });
 
}

module.exports = checklogin