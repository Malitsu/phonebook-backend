const express = require('express')
const app = express()
app.use(express.static('build'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Alli Kuikamoinen",
      "number": "123 123",
      "date": "2019-07-13T13:57:26.799Z",
      "important": true,
      "id": 5
    },
    {
      "name": "Timo Hokkanen",
      "number": "000 0000",
      "date": "2019-07-14T15:42:29.547Z",
      "important": true,
      "id": 6
    }
  ]

morgan.token('data', function getBody(req) {
  return JSON.stringify(req.body)
})

const logFormat = ' :method :url :status :res[content-length] - :response-time ms :data'
app.use(morgan(logFormat))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
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

const generateId = () => {
  const id = Math.floor(Math.random() * 1000)
  console.log(id)
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'information missing' 
    })
  }

  const samePersons = persons.filter(person => person.name.includes(body.name))

  if (samePersons.length > 0) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})