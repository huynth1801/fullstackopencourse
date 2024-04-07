const express  = require("express")
const app = express()

app.use(express.json())

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

app.get("/api/persons", (request, response) => {
    response.json(notes)
})

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

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
