const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  let transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {       
      user: process.env.SENDER, 
      pass: process.env.SENDER_PASSWORD,
    },
  });
 
  try {
    let info = await transporter.sendMail({
      from: process.env.SENDER, 
      to: `${to.join(",")}`, 
      subject: `${subject}`, 
      html: `${html}`,
    });
    return info;
  } catch (error) {
    return error;
  }
};

module.exports = sendEmail;