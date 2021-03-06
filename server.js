const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

// ROUTE TO GET NOTES HTML
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

// API ROUTE TO GET STORED NOTES
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
        res.json(JSON.parse(data));
    })
})

// API ROUTE TO ADD A NOTE
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    console.log(newNote);
    fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
        let jsonDB = JSON.parse(data);
        console.log(jsonDB);
        console.log(newNote);
        newNote.id = uuidv4();
        jsonDB.push(newNote);
        console.log(jsonDB);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(jsonDB), (e) => {
            if (e) throw e;
            res.json(`Note added successfully`);
        });
    })
})
// API ROUTE TO DELETE A NOTE
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
        const jsonDB = JSON.parse(data);
        const newJsonDB = jsonDB.filter((note) => note.id !== req.params.id);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(newJsonDB), (e) => {
            if (e) throw e;
            res.json(`Note deleted successfully`);
        })
    })
})

// ALL OTHER ROUTES RETURN INDEX HTML 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.listen(PORT, () => {
    console.info("Listening on PORT ", PORT)
})