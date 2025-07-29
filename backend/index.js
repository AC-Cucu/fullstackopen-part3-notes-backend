require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const Note = require('./models/note')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id

  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id

  Note.findByIdAndDelete(id)
    .then(result => {
      if (result.content) {
        console.log('Note deleted successfully');
        response.status(204).end()
      } else {
        console.log('Note not found');
        response.status(404).end()
      }
    })
    .catch(error => {
      console.error('Error deleting note:', error);
      response.status(500).end()
    });  
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    console.log('Note created successfully');
    response.json(savedNote)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})