# email-service

This Express server uses the SendGrid and MailGun APIs to allow users to send emails. If a post request to the SendGrid API fails, the server will then send the message through MailGun. 

In order to use this API, you will need to register for SendGrid and MailGun API keys, as well as have a domain set up with MailGun. After that, you will need to add those pieces of information to a file in the root folder called `apiKeys.js`. An example of how that file should be setup can be found in `apiKeys.example.js`.
