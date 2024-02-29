const express = require('express');
const search = require('../controller/searchController');

const searchRouter = express.Router();

searchRouter.get('/', search.searchPostsPage);

searchRouter.get('/users', search.searchUsersPage);

exports.searchRouter = searchRouter;
