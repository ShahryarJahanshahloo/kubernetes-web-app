import React, { useState, useEffect } from 'react'
import axios from 'axios'
import logo from './logo.svg'
import './App.css'

axios.defaults.baseURL = 'http://server-cluster-ip-service:3001/'

function App() {
  const [seenIndexes, setSeenIndexes] = useState([])
  const [values, setValues] = useState({})
  const [index, setIndex] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const values = await axios.get('/values/current')
      const seenIndexes = await axios.get('/values/all')
      setValues(values.data)
      setSeenIndexes(seenIndexes.data)
    }
    fetch()
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()
    await axios.post('/values', {
      index: index,
    })
    setIndex('')
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <h1 className='App-title'>Fib Calculator version 2</h1>
      </header>
      <div>
        <form onSubmit={handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={index}
            onChange={event => setIndex(event.target.value)}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {seenIndexes.map(({ number }) => number).join(', ')}

        <h3>Calculated Values:</h3>
        {values.map((index, value) => {
          return (
            <div key={index}>
              For index {index} I calculated {value}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
