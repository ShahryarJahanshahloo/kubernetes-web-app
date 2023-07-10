import express from 'express'

const app = express()

const PORT = process.env.PORT | 3000

app.use(express.json())

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
