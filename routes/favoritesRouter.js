const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites')

const favoriteRouter = express.Router();

favoriteRouter.use(express.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user": req.user._doc._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user": req.user._doc._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({user: req.user._doc._id, dishes: req.body})
            .then((favorites) => {
                console.log('Favorite Created ', favorites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            if(favorites.dishes.indexOf(req.params.favoriteId) !== -1){
                err = new Error(`Dish ${req.params.favoriteId} already exists in favorites`);
                err.status = 404;
                return next(err);
            }
            else{
                favorites.dishes.push(req.body);
                favorites.save()
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('Put operation not supported on Favorites')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({"user": req.user._doc._id})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err))    
})

favoriteRouter.route('/:favoriteId')
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)})
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorite/'+ req.params.favoriteId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user": req.user._doc._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({user: req.user._doc._id})
            .then((favorites) => {
                console.log('Favorite Created ', favorites);
                
                favorites.dishes.push(req.params.favoriteId);
                favorites.save()
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            if(favorites.dishes.indexOf(req.params.favoriteId) !== -1){
                err = new Error(`Dish ${req.params.favoriteId} already exists in favorites`);
                err.status = 404;
                return next(err);
            }
            else{
                favorites.dishes.push(req.params.favoriteId);
                favorites.save()
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite/'+ req.params.favoriteId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user": req.user._doc._id})
    .then((favorites) => {
        if(favorites){
            const index = favorites.dishes.indexOf(req.params.favoriteId)
            if(index != -1){
                favorites.dishes.splice(index, 1);
                favorites.save()
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }
            else{
                err = new Error(`Dish ${req.params.favoriteId} not exists in favorites`);
                err.status = 404;
                return next(err);
            }
        }
        else{
            err = new Error(`Dish ${req.params.favoriteId} not exists in favorites`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); 
})

module.exports = favoriteRouter