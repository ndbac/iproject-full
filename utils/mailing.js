const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: "iProject <ndinhbac.0@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //   html:
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
