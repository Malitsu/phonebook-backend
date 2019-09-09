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
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  res.send('<p>Phonebook has info for ' +persons.length +' people</p><p>' +Date() +'</p>')
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person.toJSON())
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

/* const generateId = () => {
  const id = Math.floor(Math.random() * 1000)
  console.log(id)
  return id
} */

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'information missing' 
    })
  }

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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})