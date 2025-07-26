const express = require('express');
const bookmark = require('../controller/bookmarkController');

const bookmarkRouter = express.Router();

bookmarkRouter.get('/', bookmark.getBookmarkData);

bookmarkRouter.put('/:id', bookmark.updateBookmarkData);

module.exports = bookmarkRouter;
