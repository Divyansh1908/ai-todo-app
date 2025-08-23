import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import todoRoutes from './routes/todos'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/todos', todoRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})