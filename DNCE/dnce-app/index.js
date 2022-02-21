var express = require('express');
var app = express();
app.use(express.static('src'));
app.use(express.static('../dnce-contract/build/contracts'));
app.get('/', function (req, res) {
  res.render('index.html');
});
app.listen(3000, function () {
  console.log('DNCE app listening on port 3000!');
});