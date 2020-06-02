const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

morgan.token('response', function(req, res) { return JSON.stringify(req.body); });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response'));

let persons = [
    {
        name: "Arto Hellas",
        number: "045-31235234",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

app.get('/info', (request, response) => {
    const receivedDate = new Date().toString();
    const numPersons = persons.length;
    response.send(
        `<div>
            <p>Phonebook has info for ${numPersons} people</p>
            <p>${receivedDate}</p>
        </div>`
    );
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    if(person){
        response.json(person);        
    } else{
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons.filter(p => p.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const id = Math.round(Math.random()*1000000);

    const body = request.body;

    if(!body.name){
        return response.status(400).json({
            error: 'name missing'
        });
    }
    if(!body.number){
        return response.status(400).json({
            error: 'number missing'
        });
    }
    if(persons.some(p => p.name === body.name)){
        return response.status(409).json({
            error: 'name must be unique'
        });
    }

    const newPerson = {
        id,
        ...request.body
    }
    persons = persons.concat(newPerson);
    
    response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})