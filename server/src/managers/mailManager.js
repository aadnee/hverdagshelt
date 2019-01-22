import nodemailer from 'nodemailer';

module.exports = {
  send: function(title, message, reciever, callback) {
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
      html: '<div style=\'font-family:"Times New Roman"\'>' + message + '</div>'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }
};
