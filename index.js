import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from "cookie-parser"
const app = express()
import mongoose from "mongoose"


import userRoute from './routes/user.route.js'

dotenv.config()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

const PORT = process.env.PORT || 5000
const URL = process.env.MONGODB_URL

try {
  mongoose.connect(URL)
  console.log("connected to mongodb")
  
} catch (error) {
  console.log(error.message)
}

app.use("/user", userRoute)



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})