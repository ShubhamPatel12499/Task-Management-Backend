const express=require("express")
const {connection}=require("./config/db")
const {taskRouter}=require("./routes/Task.route")
const {userRouter}=require("./routes/User.route")

const cors = require('cors')

const app=express()
require("dotenv").config();

app.use(cors({
    origin:"*"
}))
app.use(express.json())

app.use("/users",userRouter)
app.use("/tasks",taskRouter)


app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("Connected to DB")
    }
    catch(err){
      console.log("Not connected to DB")
      console.log(err)
    }
    console.log(`Server is running on ${process.env.port}`)
})