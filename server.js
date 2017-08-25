var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var keys = require('./apiKeys');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(keys.SENDGRID_API_KEY);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000);
console.log('Server listening on port 3000');

app.post('/sendEmail', function(req, res) {
  var fromEmail = new helper.Email(req.body.from);
  var toEmail = new helper.Email(req.body.to);
  var subject = req.body.subject;
  var content = new helper.Content('text/plain', req.body.message);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    //console.log('===================sending')
    if (error) {
      console.log('===================sending', error.response.body.errors)
      res.sendStatus(404);
    } else {
      res.status(200).send(response)
    }
  });
});