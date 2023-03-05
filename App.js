import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"



export default function App() {
    const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || [])
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0] && notes[0].id) || ""
    )

    const createNewNote = () => {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => {
            return [newNote, ...prevNotes]
        })
        setCurrentNoteId(newNote.id)
    }

    const updateNote = (text) => {
        setNotes(oldNotes => {
            const filteredNote = oldNotes.filter(el => el.id !== currentNoteId)
            const oldNote = oldNotes.find(el => el.id === currentNoteId);
            const newNotes = oldNote ? [{ id: oldNote.id, body: text }, ...filteredNote] : [...oldNotes];
            return newNotes
        }
        )
    }
    const findCurrentNote = () => {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    const deleteNote = (event, noteId) => {
        event.stopPropagation()
        setNotes((oldNotes) => {
            return oldNotes.filter(el => el.id !== noteId)
        })
    }
    
    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes))
    }, [notes])
    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={findCurrentNote()}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={findCurrentNote()}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
