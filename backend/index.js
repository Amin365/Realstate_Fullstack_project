

import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { ErrorHandle } from './middleware/ErrorHanlde.js'
import Authrouter from './routes/userAuth.js'
import { NotFound } from './middleware/NotFound.js'
import helmet from 'helmet'
import cors from 'cors'

dotenv.config()

const Port = process.env.PORT || 4300

const app=express()
app.use(helmet())

app.use(express.json())
app.use(cors(
  {
    origin:['http://localhost:5173']
   
  }
))

app.use('/api',Authrouter)
app.use('/', NotFound)
app.use(ErrorHandle)
mongoose.connect(process.env.mongodb_url)
  .then(() => console.log('✅ Connection Successfully'))
  .catch((error) => console.log('❌ Connection Error', error))
app.listen(Port, () => {
  console.log(`🚀 Server is running on port ${Port}`)
})



