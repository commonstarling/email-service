var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var keys = require('./apiKeys');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(keys.SENDGRID_API_KEY);
var mailgunDomain = 'mg.sheenamramirez.com';
var mailgun = require('mailgun-js')({apiKey: keys.MAILGUN_API_KEY, domain: mailgunDomain});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000);
console.log('Server listening on port 3000');

app.post('/sendEmail', function(req, res) {
  var fromEmail = new helper.Email(req.body.from);
  var toEmail = new helper.Email(req.body.to);
  //var toEmail = new helper.Email(req.to);
  var subject = req.body.subject;
  var content = new helper.Content('text/plain', req.body.message);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error sending through SendGrid, trying MailGun...');
      var data = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.message
      };
      mailgun.messages().send(data, function (error, body) {
        if (error) {
          console.log('Error sending through MailGun', error);
          res.sendStatus(500);
        } else {
          console.log('Message successfully sent through MailGun');
          res.sendStatus(200);
        }
      });
    } else {
      console.log('Message successfully sent through SendGrid');
      res.sendStatus(200);
    }
  });
});







