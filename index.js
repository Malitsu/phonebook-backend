require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('build'))
const Person = require('./models/person')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())

morgan.token('data', function getBody(req) {
  return JSON.stringify(req.body)
})

const logFormat = ' :method :url :status :res[content-length] - :response-time ms :data'
app.use(morgan(logFormat))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
  .find({})
  .then(persons => {
    //res.json(persons)
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  res.send('<p>Phonebook has info for ' +persons.length +' people</p><p>' +Date() +'</p>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
8
const generateId = () => {
  const id = Math.floor(Math.random() * 1000)
  console.log(id)
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'information missing' 
    })
  }

  /* const samePersons = persons.filter(person => person.name.includes(body.name))

  if (samePersons.length > 0) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  }) 

  person
  .save()
  .then(savedPerson => {
    response.json(savedPerson.toJSON())
  })

})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})