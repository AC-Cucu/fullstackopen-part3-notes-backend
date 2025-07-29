import { useState, useEffect } from "react"

import Note from "./components/Note"
import Notification from "./components/Notification"
import Footer from "./components/Footer"

import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    console.log('effect')
    // Fetch notes from the server
    noteService
      .getAll()
      .then(initialNotes => {
        console.log('promise fulfilled')
        const notes = initialNotes
        setNotes(notes)
      })
  }

  useEffect(hook, [])

  if (!notes) {
    return null
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      // id: notes.length + 1,
      content: newNote,
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote  => {
        console.log('note added:', returnedNote )
        const addedNote = returnedNote

        const newNotes = [...notes, addedNote]
        console.log('newNotes:', newNotes)

        setNotes(newNotes)
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    const newNoteFromInput = event.target.value
    console.log('note changed', newNoteFromInput)
    setNewNote(newNoteFromInput)
  }
  

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  console.log('notesToShow:', notesToShow)

  const handleClickShowAll = () => {
    setShowAll(!showAll)
  }

  const toggleImportantceOf = (id) => {
    console.log(`importance of ${id} needs to be toggled`)
    
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote  => {
        const updatedNote = returnedNote 

        const newNotes = notes.map(note => note.id !== id ? note : updatedNote)
        setNotes(newNotes)
      })
      .catch(error => {
        console.error("Updating notes error:", error)
        setErrorMessage(
          `the note '${note.content}' was already deleted from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={handleClickShowAll}>
        show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {
          notesToShow.map(note => 
            <Note 
              key={note.id} 
              note={note} 
              toggleImportance={() => toggleImportantceOf(note.id)} 
            />
          )
        }
      </ul>
      <form onSubmit={addNote}>
        <input name="note" value={newNote} onChange={handleNoteChange} />
        <button type="submit">Add Note</button>
      </form>
      <Footer />
    </div>
  )
}

export default App