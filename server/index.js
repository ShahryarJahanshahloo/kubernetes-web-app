import express from 'express'
import cors from 'cors'
import { Pool } from 'pg'
import { createClient } from 'redis'

const app = express()
const PORT = process.env.PORT | 3001
app.use(cors())
app.use(express.json())

const pgClient = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

pgClient.on('connect', () => {
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err))
})

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: () => 1000,
})
const redisPublisher = redisClient.duplicate()

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values')
  res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  const values = await redisClient.hGetAll('values')
  res.send(values)
})

app.post('/values', async (req, res) => {
  const index = req.body.index
  if (+index > 40) {
    return res.status(422).send('Index too high')
  }
  redisClient.hSet('values', index, 'Nothing yet!')
  redisPublisher.publish('insert', index)
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
  res.send({ working: true })
})

app.get('*', (req, res) => {
  res.status(200).send('successful GET request!')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
  console.log('server up on port ' + PORT)
})
