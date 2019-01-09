import nodemailer from 'nodemailer';

module.exports = {
  send: function(title, message, reciever) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hverdagshelt8@gmail.com',
        pass: 'slackmaster'
      }
    });

    var mailOptions = {
      from: 'Hverdagshelt <hverdagshelt8@gmail.com>',
      to: reciever,
      subject: title,
      html: message
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      }
    });
  }
};
