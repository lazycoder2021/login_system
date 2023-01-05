const express = require('express'); 
const app = express(); 
const mongoose = require('mongoose'); 
const session = require('express-session'); 
const MongoStore = require('connect-mongo');
const User = require('./model/User'); 
const sendMail = require('./sendMail');
const sendLoginMail = require('./sendLoginMail');
const path = require('path'); 
const auth = require('./auth'); 

const { v4: uuidv4 } = require('uuid')


require('dotenv').config({}); 

mongoose.set('strictQuery', false);

app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collection: 'sessions' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))






app.use(express.static('public')); 
app.use(express.json());


app.post('/register', async function (req, res) {
    try {

        /*
        
        const userExists = await User.findOne({ email: req.body.email });
        console.log(userExists)
        if (!userExists) {
            return res.status(200).json({ "msg": "email already exists!" });
        }

*/
        
        
        
            console.log(req.body)
            const user = await new User({name: req.body.name, email:req.body.email, phone: req.body.phone, country: req.body.country,  uid: uuidv4() });
            await user.save()
            console.log(user.name, req.session.id);

            const options = {
                name: user.name,
                email: user.email,
                uid: user.uid,
                subject: 'Vikalp Account Verification'
            }

            sendMail(options)

            res.status(200).json({ "msg": "Verification email has been sent. Please check your inbox and verify your email to complete registration", user })
        
        
    } catch (e) {
        console.log(e)
    }
})


app.post('/login', async function (req, res) {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (!userExists) {
            return res.status(200).json({"msg": "account does not exist"})
        }

        
        userExists.lid = uuidv4(); 
        await userExists.save()
        console.log(userExists.lid);

        const options = {
            name: userExists.name,
            email: userExists.email,
            lid: userExists.lid,
            subject: 'Here is your Vikalp Passcode'
        }

        sendLoginMail(options)

        res.status(200).json({ "msg": "Passcode has been sent to your mail. Please use that to login", userExists })
    } catch (e) {
        console.log(e)
    }
})





app.get('/verifycode', async function (req, res) {
    try {
        //console.log(path.join(__dirname))
        await res.sendFile(path.join(__dirname, 'public/verifycode.html'));

    } catch (e) {
        console.log(e)
    }
})

app.get('/logincode', async function (req, res) {
    try {
        //console.log(path.join(__dirname))
        await res.sendFile(path.join(__dirname, 'public/logincode.html'));

    } catch (e) {
        console.log(e)
    }
})


app.post('/verifycode', async function (req, res) {
    try {
        const user = await User.findOne({ uid: req.body.code });
        if (user) {
            //console.log(user._id.toString())
            req.session.userId = user._id;
            console.log(req.session.userId.toString())
            user.verify = true;
            await user.save();
            res.json({ "msg": "verification successful, you can now access the site" })
        } else {
            res.json({ "msg": "verification unsuccessful, please check your verifiction code" })
        }
    } catch (e) {
        console.log(e)
    }
})


app.post('/logincode', async function (req, res) {
    try {
        const user = await User.findOne({ lid: req.body.code });
        if (user) {
            
            req.session.userId = user._id;
            console.log(req.session.userId.toString())
            user.lid = '';
            await user.save();
            res.json({ "msg": "login successful, you can now access the site" })
        } else {
            res.json({ "msg": "login failed, please check your verifiction code" })
        }
    } catch (e) {
        console.log(e)
    }
})

app.get('/access', auth, async function (req, res) {
    try {
        res.status(200).json({"msg": "serve content from dashboard page"})
    } catch (e) {
        console.log(e)
        res.status(200).json({ "msg": "dont serve content from dashboard page" })
    }
})


app.get('/logout', auth, async function (req, res) {
    try {
        req.session.destroy();
        res.status(200).json({ "msg": "session destroyed successfully" });
    } catch (e) {
        console.log(e)
    }
})




app.listen(process.env.PORT, function () {

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('db connected')
        })
        .catch((e) => {
            console.log(e)
        })
    
    console.log('server up and running')
})
