var http = require('http');
var qrCode = require('qrcode');
var speakeasy = require('speakeasy');
var express = require('express');
const app = express();

const secret = speakeasy.generateSecret({ length: 20 });

var code = null;
qrCode.toDataURL(secret.otpauth_url, (err, image) => {
  console.log(image);
  // https://www.site24x7.com/tools/datauri-to-image.html
});

setInterval(() => {
  var totp = speakeasy.totp({
    secret: secret.ascii
  });

  if (totp !== code) console.log('new password: %s', totp);

  code = totp;
}, 100);

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
