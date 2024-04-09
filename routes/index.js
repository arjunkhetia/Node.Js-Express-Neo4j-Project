var express = require('express');
var router = express.Router();
var db = require('../dbconfig');

/* GET home page. */
router.get('/', async function(req, res, next) {
  var data = '';
  await db.getSession().run('MATCH (node: person) RETURN node;').then((result) => {
    data = result.records;
  }).catch((error) => {
    console.log(error);
  }).then(() => db.closeSession());
  res.render('index', { title: 'Express', data: JSON.stringify(data, null, 4) });
});

module.exports = router;
