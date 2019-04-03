const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Martti Tienari",
    number: "040-123456"
  },
  {
    id: 3,
    name: "Arto Järvinen",
    number: "040-123456"
  },
  {
    id: 4,
    name: "Lea Kutvonen",
    number: "040-123456"
  }
]

app.use(bodyParser.json())

app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Phonedirectory backend.</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const min = Math.ceil(0);
  const max = Math.floor(1000000);
  const maxId = Math.floor(Math.random() * (max - min)) + min;
  return maxId
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(body.name === undefined || body.number === undefined){
    return res.status(400).json({Error: 'Name or number is missing!'})
  }

  for(let i = 0; i < persons.length; i++){
    if(body.name === persons[i].name) {
      return res.status(400).json({error: 'Name must be unique!'})
    }
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
