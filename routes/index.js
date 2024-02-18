const express = require('express');
const router = express.Router();
const fs = require('fs');
const jpeg = require('jpeg-js');
const { MultiFormatReader, BarcodeFormat, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } = require('@zxing/library')


router.get('/', function(req, res, next) {
  res.render('index', {blacklist: [{'asdf':'j'}]});
});
router.get('/products', async function(req, res, next) {
  res.render('products');
});
router.get('/loading', async function(req, res, next) {
  res.render('loading');
  
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




// router.post('/upload', function(req, res, next) {
//   try {
//     const hints = new Map(); 
//     const formats = [BarcodeFormat.UPC_A, BarcodeFormat.UPC_E];
//     const reader = new MultiFormatReader();
//     console.log(req.body.b64);
//     const rawImageData = jpeg.decode(Buffer.from(req.body.b64, 'base64').toString('binary'));
//     console.log(rawImageData);
//     const len = rawImageData.width * rawImageData.height;
//     const luminancesUint8Array = new Uint8Array(len);
//     for(let i = 0; i < len; i++) {
//       luminancesUint8Array[i] = ((rawImageData.data[i * 4] + rawImageData.data[i * 4 + 1] * 2 + rawImageData.data[i * 4 + 2]) / 4) & 0xFF;
//     }
//     const luminanceSource = new RGBLuminanceSource(luminancesUint8Array, rawImageData.width, rawImageData.height);
//     const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
//     hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
//     reader.decode(binaryBitmap, hints);
//     console.log(hints);
//   }
//   catch (err) {
//     console.log(err);
//   }
//   res.end('loading');
// });
// console.log('restart done');



router.post('/barcodePost', function(req, res, next) {

  const barcode= req.body['barcode'];
  console.log(barcode);
  try {
    fetch('https://us-central1-pioneerhacksv.cloudfunctions.net/getIngredients?number=' + barcode)
        .then(response => response.json()).then(data => {
      console.log(data);
      return data;
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error processing image');
    return 404;

  }
});

module.exports = router;