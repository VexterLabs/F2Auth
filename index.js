var qrCode = require('qrcode'); // Lib to generate url-based QRCode
var speakeasy = require('speakeasy'); //Lib to passcode generator

var express = require('express');
const app = express();

// Create a secret passcode
const secret = speakeasy.generateSecret({ length: 20 });

var code = null;
// Generate a QRCode Image
qrCode.toDataURL(secret.otpauth_url, (err, image) => {
  console.log(image);
  // https://www.site24x7.com/tools/datauri-to-image.html
  // Use this website to render a QRCode image
  // TODO - Render QRCode on Terminal
});

setInterval(() => {
  // Create Totp secret
  var totp = speakeasy.totp({
    secret: secret.ascii
  });

  if (totp !== code) console.log('new password: %s', totp);

  code = totp;
}, 100);

// Simple router to testing
// localhost:3000/auth?token={PSSWRD}
app.get('/auth', (req, res, next) => {
  const { token } = req.query;
  if (token === code) {
    res.status(200).send({
      message: 'Autenticado!'
    });
    return;
  }

  res.status(401).send({
    message: 'Erro na autenticação'
  });
});

app.listen(3000);
