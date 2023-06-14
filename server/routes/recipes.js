var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('this is the recipes page');
});

router.get('/:recipeID', function(req, res, next) {
    res.send('this is the recipe page for ' + req.params.recipeID);
});

module.exports = router;