const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); 

const readNotes = () => {
    const data = fs.readFileSync('./db/db.json', 'utf8');
    return JSON.parse(data);
  };
  
  const saveNote = (note) => {
    const notes = readNotes();
    note.id = Math.floor(Math.random()*1000000).toString(16);
    notes.push(note);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    return note;
  };
  
  const deleteNoteById = async (id) => {
    const notes = await readNotes();
    const updatedNotes = notes.filter(note => note.id != id);
    fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes, null, 2));
  };


app.get('/api/notes', (req, res) => {
    res.json(readNotes());
});

app.post('/api/notes', (req, res) => {
    const newNote = saveNote(req.body);
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    console.log('server',req.params.id);
    deleteNoteById(req.params.id);
    res.json({ success: true });
});

app.get('/api/notes', (req, res) => {
    res.json(readNotes());
});

app.post('/api/notes', (req, res) => {
    const newNote = saveNote(req.body);
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    deleteNoteById(req.params.id);
    res.json({ success: true });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
