const ideasRouter = require('expres').Router();
module.exports = ideasRouter;

const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabaseById,
} = require ('./db');

const checkMillionDollarIdea = require('./checkMillionDollarIdea');

// Using router parameters to handle the edge cases
ideasRouter.param('id', (req,res,next, id) => {
const idea = getFromDatabaseById('ideas', id);
if(idea) {
    req.idea = idea;
    next();
} else {
    res.status(404).send();
}
});
// Get an array of all ideas
ideasRouter.get('/', (req,res,next) => {
    res.send(getAllFromDatabase('ideas'));
});

// Get a single idea by id
ideasRouter.get('/:id', (req,res,next) => {
    res.send(req.idea);
});

// Update a single idea by id
ideasRouter.put('/:id', checkMillionDollarIdea, (req,res,next) => {
    const updateIdea = updateInstanceInDatabase('ideas', req.body);
    res.send(updateIdea);
});

// Create a new idea and save it to the database
ideasRouter.post('/', checkMillionDollarIdea, (req,res,next) => {
    const newIdea = addToDatabase('ideas', req.body);
    res.status(201).send(newIdea);
});

// Delete a single idea by Id
ideasRouter.delete('/:id', (req,res,next) => {
    const deleted = deleteFromDatabaseById('ideas', req.params.id);
    if(deleted) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
});