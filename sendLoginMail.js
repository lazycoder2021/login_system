const sendGrid = require('@sendgrid/mail'); 


const sendLoginMail =  async (options) => {
    try {
        sendGrid.setApiKey(process.env.SENDGRID_API_KEY); 
        const msg = {
            to: options.email, // Change to your recipient
            from: process.env.FROM, // Change to your verified sender
            subject: 'Vikalp Login Passcode',
            text: 'Test Mail From My NodeJs App Using SendGrid API',
            html: "<div style =" +
                "width:100%; height:100%;  " +
                "><h1 style=" +
                "font-weight:500>Hey, " +
                options.name + "<h2 style =" +
                "color:red;" +
                ">Delete this mail once you successfully login!</h2>" +
                "<br>Here is Your Login Passcode</h1><h3>Your Login Passcode is : " +
                options.lid + 
                " </h3></div><a href=http://localhost:3000/logincode>Click Here to Login</a><p>If this request is not made by you kindly ignore this mail.</p><p>Regards, <p><strong>Vikalp Team</strong></p></p>",
        }
        const info = await sendGrid.send(msg)
        console.log(info);

    } catch (e) {
        console.log(e)
    }
}

module.exports = sendLoginMail; 