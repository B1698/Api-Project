const minonsRouter = require('expres').Router();
module.exports = minionsRouter;

const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabaseById,

} = require('./db');

// Using router parameters to handle the edge cases
minionsRouter.param('minionId',(req,res,next,id) => {
    const minion = getFromDatabaseById('minions', id);
    if(minion) {
        req.minion = minion;
        next();
    } else {
        res.status(404).send();
    }
});

// Get an array of all minions 

minionsRouter.get('/', (req,res,next) => {
    res.send(getAllFromDatabase('minions'));
});

// Get a single minion by Id
minionsRouter.get('/:minionId', (req,res,next) => {
    res.send(req.minion);
});

// Update a single minion by id
minionsRouter.put('/:minionId',(req,res,next) => {
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    res.send(updatedMinion);
});

// Create a new minion and save it to the database
minionsRouter.post('/', (req,res,next) => {
    const newMinion = addToDatabase('minions', req.body);
    res.status(201).send(newMinion);
});

// Delete a single minion by id
minionsRouter.delete('/:minionId', (req,res,next) => {
    const deleted = deleteFromDatabaseById('minions', req.params.minionId);
    if(deleted) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
});

// Get an array of all work for the specified minion
minionsRouter.get('/:minionId/work',(req,res,next) => {
    const work = getAllFromDatabase('work').filter((singleWork) => {
        return singleWork.minionId === req.params.minionId;
    });
    res.send(work);
});

// Create a new work object and save it to the database
minionsRouter.post('/:minionId/work',(req,res,next) => {
    const workToAdd = req.body;
    workToAdd.minionId = req.params.minionId;
    const createdWork = addToDatabase('work', workToAdd);
    res.status(201).send(createdWork);
});

minionsRouter.param('workId', (req,res,next,id) => {
    const work = getFromDatabaseById('work', id);
    if(work) {
        req.work = work;
        next();
    } else {
        res.status(404).send();
    }
});

// Update a single work by Id
minionsRouter.put('/:minionId/work/:workId', (req,res,next) => {
    if(req.params.minionId !== req.body.minionId) {
        res.status(400).send();
    } else {
        updatedWork = updateInstanceInDatabase('work', req.body);
        res.send(updatedWork);
    }
});

// Delete a single work by id
minionsRouter.delete('/:minionId/work/:workId', (req,res,next) => {
    const deleted = deleteFromDatabaseById('work', req.params.workId);
    if (deleted) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
});