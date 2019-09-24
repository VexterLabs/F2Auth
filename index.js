var qrCode = require('qrcode'); // Lib to generate url-based QRCode
var speakeasy = require('speakeasy'); //Lib to passcode generator

var express = require('express');
const app = express();

// Create a secret passcode
const secret = speakeasy.generateSecret({ length: 20 });

var code = null;
// Generate a QRCode Image
qrCode.toString(secret.otpauth_url, { type: 'terminal' }, (err, image) => {
  console.log(image);
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
