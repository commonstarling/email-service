var express = require('express');
var app = express();
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

app.listen(3000);
console.log('Server listening on port 3000');

app.post('/sendEmail', function(req, res) {
  var fromEmail = new helper.Email(req.from);
  var toEmail = new helper.Email(req.to);
  var subject = req.subject;
  var content = new helper.Content('text/plain', req.message);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
});