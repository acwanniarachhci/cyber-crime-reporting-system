require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', JSON.stringify(process.env.EMAIL_USER));
console.log('EMAIL_APP_PASSWORD:', JSON.stringify(process.env.EMAIL_APP_PASSWORD));
console.log('Password length:', process.env.EMAIL_APP_PASSWORD?.length);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Test Email',
  text: 'This is a test email from the Cybercrime Reporting System.',
}, (error, info) => {
  if (error) {
    console.log('❌ ERROR:', error.message);
  } else {
    console.log('✅ SUCCESS:', info.response);
  }
});