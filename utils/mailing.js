const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log(options);
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
    from: options.from || "iProject <ndinhbac.0@gmail.com>",
    to: options.to,
    subject: options.subject,
    text: options.message,
    //   html:
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
