// const mongoose = require('mongoose')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://huuhuy1801:${password}@cluster0.hk2ocni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery',false)

// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })


require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)


let notes = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/" , (request, response) => {
  response.send(" <p>Hello world!</p>")
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// app.get("/api/persons", (request, response) => {
//   response.json(notes)
// })

app.get("/info", (request, response) => {
  // Lấy thời gian hiện tại
  const currentTime = new Date().toString();
  
  response.send(`Phonebook has info for 2 people <br/> Current time: ${currentTime}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id
  )
  if(note) {
      response.json(note)
  } else {
      response.status(404).end
  }
});

// Delete
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

//Post
app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body.number) {
      return response.status(400).json({ 
        error: 'number is missing' 
      })
    }
  
  const note = {
  name: body.name,
  number: String(body.number) || "",
  id: generateId(),
  }

  notes = notes.concat(note)

  console.log(notes);

  response.json(note)
})

const cors = require('cors')

app.use(cors())


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})