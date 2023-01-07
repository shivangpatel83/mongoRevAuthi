const express = require(`express`)
const userRouter = express.Router()
const mongoose = require(`mongoose`)
const userdata = mongoose.model(`userdata`)
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)
const {secretKey} = require(`../secret.js`)
const checklogin = require(`../middleware/checklogin.js`)


// signup API 

let validatePassword=(password)=>{
    const minLength = 8
    const maxLength =16
    const regularExp = (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*])[A-Za-z0-9!@#$%&*]{8,16}$/)
    if(password.length<minLength || password.length>maxLength){
        return true
    }
    else if(!regularExp.test(password)){
        return true
    }
}

userRouter.post(`/signup`, (req,res)=>{
    const {name,email,password} = req.body 
     
    if(!name || !email || !password){
        console.log(`fill all the details`)
        return res.send({error : "Please fill all the fields"})
    }
    else if(name.length < 3){
        console.log(`Name should be atleast 3 characters`)
        return res.send({error : "Name shoule be atleast 3 characters"})
    }
    else if(!email.includes(`@`) || !email.includes(`.`)){
        console.log(`Please enter the valid mail`)
        return res.send({error : "Please enter the valid E-mail"})
    }
    else if(validatePassword(password)){
        console.log(`Please enter the valid password`)
        return res.send({error : "Password should be in between 8 to 16 characters with capital and special character"})
    }
    userdata.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser != null){
            console.log(`user already exist`)
            return res.send({error : "User already exist"})
        }
        else if(savedUser == null){
            bcrypt.hash(password,10)
            .then((hashedPwd)=>{
                const storeUser = new userdata(
                    {
                    name : name,
                    email : email,
                    password : hashedPwd
                    }
                )
                storeUser.save()
                .then((saveUser)=>{
                    console.log(`user saved`, saveUser)
                    return res.send({message : "User signed up successfully"})
                })
                .catch((err)=>{
                    console.log(`while storing user in databse`)
                })
            })
            .catch((err)=>{
                console.log(`while hashing the password`)
            })
        }
    })
    .catch((err)=>{
        console.log(`while searching user email in database`)
    })
})


//login API

userRouter.post(`/login/` , (req,res)=>{
    const {email , password} = req.body 

    if(!email || !password){
        console.log(`fill all the details`)
        return res.send({error : "Please fill all the fields"})
    }
    else if(!email.includes(`@`) || !email.includes(`.`)){
        console.log(`Please enter the valid mail`)
        return res.send({error : "Please enter the valid E-mail"})
    }
    userdata.findOne({email:email})
    .then((result)=>{
        // console.log(result)
        if(result == null){
            console.log(`email donot exist`)
            return res.send({error : "Invalid Username or Password"})
        }
        const signupPwd = result.password
        bcrypt.compare(password,signupPwd)
        .then((comparePwd)=>{
            if(comparePwd==false){
                console.log(`Incorrect password`)
                return res.send({error : "Invalid Username or Password"})
            }
            const token = jwt.sign({_id : result._id},secretKey)
            console.log(`user logged in successfully`)
            return res.send({message : "User successfully logged in", token : token})
        })
        .catch((err)=>{
            console.log(`while matching password`)
        })
    })
    .catch((err)=>{
        console.log(`while searching email`)
    })
})

userRouter.post(`/dummy` , (req,res)=>{
     res.send({message : "Better luck next time!!!..."})
})
userRouter.get(`/secret` ,checklogin, (req,res)=>{
    console.log(req.user)
     res.send({message : "Well try! Inside the secret"})
})

module.exports = userRouter
