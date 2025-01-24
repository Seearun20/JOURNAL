const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const methodOverride = require('method-override');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));

// Home route to list all tasks
app.get('/', async (req, res) => {
    try {
        const files = await fs.readdir('./files');
        res.render('index', {files: files}); 
    } catch (err) {
        res.status(500).send('Error reading files');
    }
});

// View individual task
app.get('/files/:filename', async (req, res) => {
    try {
        const filedata = await fs.readFile(`./files/${req.params.filename}`, "utf-8");
        res.render('show', {
            filename: req.params.filename, 
            filedata: filedata
        });
    } catch (err) {
        res.status(404).send('File not found');
    }
});

// Create new task
app.post('/create', async (req, res) => {
    try {
        const filename = req.body.title.split(' ').join('') + '.txt';
        await fs.writeFile(`./files/${filename}`, req.body.details);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error creating task');
    }
});

// Edit task page
app.get('/files/:filename/edit', async (req, res) => {
    try {
        const filedata = await fs.readFile(`./files/${req.params.filename}`, "utf-8");
        res.render('edit', {
            filename: req.params.filename, 
            filedata: filedata
        });
    } catch (err) {
        res.status(404).send('File not found');
    }
});

// Update task
app.put('/files/:filename', async (req, res) => {
    try {
        await fs.writeFile(`./files/${req.params.filename}`, req.body.details);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error updating task');
    }
});

// Delete task
app.delete('/files/:filename', async (req, res) => {
    try {
        await fs.unlink(`./files/${req.params.filename}`);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error deleting task');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});