const nodemailer = require('nodemailer');

function sendmail(email){

    const user_email=email;

    const otp=Math.floor(Math.random() * 9000 + 1000);

   
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sauravrct101@gmail.com',
            pass: 'jxkxnolkbjylkmjo'
        }
      });
      
      const mailOptions = {
        from: 'sauravrct101@gmail.com',
        to: user_email,
        subject: 'Reset password',
        text: `your otp is ${otp} valid till 5 min`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
       console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          // do something useful
        }
      });


      return otp;

}

module.exports={sendmail}