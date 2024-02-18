var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', {blacklist: [{'asdf':'j'}]});
});
router.get('/products', function(req, res, next) {
  res.render('products');
});
router.get('/:id', async function(req, res, next) {
  const id = req.params['id'];
  // await fetch(process.env.BACKEEND_URL, {
  //   method: "POST",
  //   body: JSON.stringify(body),
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // })
  // .then(response => response.json()).then(data => console.log(data));
  res.render('loading');
});
console.log('restart done');

module.exports = router;