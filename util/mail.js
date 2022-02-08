const nodeMailer = require("nodemailer");

const mail = (req, res) => {
    const output = `
          <p>You have a new mail from Treasure crest Contact form</p>
          <h3>Contact Details</h3>
          <ul>
            <li>Name: ${req.body.contact_name}</li>
            <li>Company: ${req.body.contact_company}</li>
            <li>Email: ${req.body.contact_email}</li>
            <li>Phone: ${req.body.contact_phone}</li>
          </ul>
          <h3>Message</h3>
          <p>${req.body.contact_message}</p>
        `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"RCF Minerals Website" ' + process.env.MAIL_USER, // sender address
        to: process.env.RECEIVER_EMAIL_ADDR, // list of receivers
        subject: req.body.contact_name + "  sent a message via RcfMineralsLtd.com", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            res.json({
                success: true,
                text: "Message sent we'll response shortly!"
            });
            return console.log("Message sent: %s", info.messageId);
        }

        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    });
    // console.log(req.body);
}

module.exports = mail;