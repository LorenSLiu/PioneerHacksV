const express = require('express');
const router = express.Router();
const Quagga = require('@ericblade/quagga2').default;

router.get('/', function(req, res, next) {
  res.render('index', {blacklist: [{'asdf':'j'}]});
});
router.get('/products', async function(req, res, next) {
  res.render('products');
  
});
// router.get('/:id', async function(req, res, next) {
//   const id = req.params['id'];
//   // await fetch(process.env.BACKEEND_URL, {
//   //   method: "POST",
//   //   body: JSON.stringify(body),
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //   }
//   // })
//   // .then(response => response.json()).then(data => console.log(data));
//   res.render('loading');
// });
// set a post route to handle the form submission
router.post('/upload', function(req, res, next) {
  console.log(req.body);
  res.render('loading');
});
console.log('restart done');

module.exports = router;