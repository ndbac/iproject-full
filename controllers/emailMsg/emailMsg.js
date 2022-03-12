const expressAsyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/mailing");

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { from, to, subject, message } = req.body;
  try {
    const data = {
      from,
      to,
      subject,
      message,
    };
    await sendEmail(data);
    res.json({ Status: "Email sent" });
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  sendEmailMsgCtrl,
};
