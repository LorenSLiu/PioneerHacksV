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
  // console.log('uploading');
  // const img = req.body;
  // try {
  //   var reader = new FileReader();
  // }catch(e){
  //   console.log('error');
  //   console.log(e); 
  // }
  // console.log('base64');
  // reader.readAsDataURL(img);
  
  
  // const decodeBarcodeFromImage = functions.https.onRequest(async (request, response) => {
      
  //     const decodeBarcodeFromImage = functions.https.onRequest(async (request, response) => {
  //       const base64Image = request.body.image; // 确保这是完整的Base64数据URI
  //       let img = new Image();
  //       img.onload = async () => {
  //           const codeReader = new BrowserMultiFormatReader();
  //           try {
  //               const result = await codeReader.decodeFromImageElement(img);
  //               console.log({ barcode: result.text }); // 注意这里使用 result.text 而不是 result.getText()
  //               response.send({ barcode: result.text });
  //           } catch (err) {
  //               if (err instanceof NotFoundException) {
  //                   response.status(400).send({ error: 'No barcode detected' });
  //               } else {
  //                   response.status(500).send({ error: 'Error decoding barcode: ' + err.message });
  //               }
  //           }
  //       };
  //       img.onerror = (err) => {
  //           response.status(500).send({ error: 'Error loading image' });
  //       };
  //       img.src = base64Image; // 确保base64Image是一个完整的Base64数据URI
  //   });

  // });
  console.log(req.body);
  try {
    Quagga.decodeSingle({
      src: req.body.fileUpload,
      numOfWorkers: 0,
      inputStream: {
          size: -1,
      },
      decoder: {
          readers: ["upc_reader", "upc_e_reader"],
      },
    }, (result) => {
      console.log(result.codeResult ? result.codeResult.code : null);
    });
  }
  catch (err) {
    console.log(err);
  }
  //res.render('error', {formData: formData});
});
console.log('restart done');

module.exports = router;