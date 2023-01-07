const express = require(`express`)
const app = express()
const mongoose = require(`mongoose`)
const {mongourl} = require(`./secret.js`)
require(`./models/user.js`)
const userRouter = require(`./routes/auth.js`)


mongoose.connect(mongourl)
mongoose.connection.on(`connected`, ()=>{
    console.log(`Database is connected`)
})
mongoose.connection.on(`error`,(err)=>{
    console.log(`Not connected`,err)
})

app.use(express.json())
app.use(`/api/auth/`, userRouter)

app.listen(3000,()=>{
    console.log(`server is running...`)
})