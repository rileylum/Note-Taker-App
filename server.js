const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
        res.json(JSON.parse(data));
    })
})

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    console.log(newNote);
    fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
        // console.log(JSON.parse(data));
        let jsonDB = JSON.parse(data);
        console.log(jsonDB);
        console.log(newNote);
        jsonDB.push(newNote);
        console.log(jsonDB);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(jsonDB), (e) => {
            if (e) throw e;
            res.json(`Note added successfully`);
        });
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.listen(PORT, () => {
    console.info("Listening on PORT ", PORT)
})