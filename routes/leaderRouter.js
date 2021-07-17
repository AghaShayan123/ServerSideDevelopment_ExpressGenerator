const express = require('express');
const mongoose = require('mongoose');

const Leaders = require('../models/leaderships')

const leadersRouter = express.Router();

leadersRouter.use(express.json())

leadersRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leaders Created ', leader);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('Put operation not supported on leaders')
})
.delete((req, res, next) => {
    Leaders.remove({})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err))
})

leadersRouter.route('/:leadersId')
.get((req, res, next) => {
    Leaders.findById(req.params.leadersId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.end(`POST operation not supported on leaders/${req.params.leadersId}`)
})
.put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leadersId, {
        $set: req.body
    })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leadersId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = leadersRouter 