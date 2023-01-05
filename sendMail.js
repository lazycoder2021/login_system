const sendGrid = require('@sendgrid/mail'); 


const sendMail =  async (options) => {
    try {
        sendGrid.setApiKey(process.env.SENDGRID_API_KEY); 
        const msg = {
            to: options.email, // Change to your recipient
            from: process.env.FROM, // Change to your verified sender
            subject: 'Vikalp Account Verification',
            text: 'Test Mail From My NodeJs App Using SendGrid API',
            html: "<div style =" +
                "width:100%; height:100%;  " +
                "><h1 style=" +
                "font-weight:500>Hey, " +
                options.name +
                "<br>Thanks for Signing up for Vikalp</h1><h2>Copy and Paste below verification code to verify your account</h2><h2 style =" +
                "color:red;" +
                ">Delete this mail once you successfully verify your account!</h2><h3>Your Code for verification is : " +
                options.uid + 
                " </h3></div><a href=http://localhost:3000/verifycode>Click Here to Verify</a><p>If this request is not made by you kindly ignore this mail.</p><p>Regards, <p><strong>Vikalp Team</strong></p></p>",
        }
        const info = await sendGrid.send(msg)
        console.log(info);

    } catch (e) {
        console.log(e)
    }
}

module.exports = sendMail; 