var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var keys = require('./apiKeys');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(keys.SENDGRID_API_KEY);
var mailgun = require('mailgun-js')({apiKey: keys.MAILGUN_API_KEY, domain: keys.mailgunDomain});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000);
console.log('Server listening on port 3000');

app.post('/sendEmail', function(req, res) {
  var fromEmail = new helper.Email(req.body.from);
  /* Line 19 provides incorrect data for the 'from' email field. Use it in place of line 17 if you'd like to see how the server handles SendGrid errors */
  //var fromEmail = new helper.Email(req.from);
  var toEmail = new helper.Email(req.body.to);
  var subject = req.body.subject;
  var content = new helper.Content('text/plain', req.body.message);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  //Initiate the SendGrid post request
  sg.API(request, function (error, response) {
    //If there's an error in the SendGrid request
    if (error) {
      //Initiate a post request through MailGun
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
    //Else if there wasn't an error sending a message through SendGrid
    } else {
      //Send back a 'success' status code
      console.log('Message successfully sent through SendGrid');
      res.sendStatus(200);
    }
  });
});







