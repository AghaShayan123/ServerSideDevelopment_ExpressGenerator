const express = require('express');

const leadersRouter = express.Router();

leadersRouter.use(express.json())

leadersRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res, next) => {
    res.end('Will send details of all leaders')
})
.post((req, res, next) => {
    res.end(`Will add the leader: ${req.body.name} with details ${req.body.description}`)
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('Put operation not supported on leaders')
})
.delete((req, res, next) => {
    res.end('Delete all leaders')
})

leadersRouter.route('/:leadersId')
.get((req, res, next) => {
    res.end(`Will send details of leader ${req.params.leadersId} to you!`)
})
.post((req, res, next) => {
    res.end(`POST operation not supported on leaders/${req.params.leadersId}`)
})
.put((req, res, next) => {
    res.write(`Updating the leader ${req.params.leadersId} \n`)
    res.end(`Will update leader ${req.body.name} with details ${req.body.description}`)
})
.delete((req, res, next) => {
    res.end(`Delete leader ${req.params.leadersId}`)
})

module.exports = leadersRouter 