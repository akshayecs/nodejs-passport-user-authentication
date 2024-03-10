require('dotenv').config();
const express = require('express');
const session = require('express-session');
const {engine} = require('express-handlebars');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connectDB = require('./config/db')
const User = require('./models/user')
const {isLoggedIn,isLoggedOut} = require('./middleware/user')
const app = express();
const port = process.env.PORT || 3000;


//Middleware
app.engine('handlebars',engine());
app.set('view engine','handlebars');
app.set('views','./views');
app.use(express.static(__dirname+'/public'));
app.use(session({
    secret:"verygoodsecret",
    resave:false,
    saveUninitialized:true
}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});


passport.use(new localStrategy(async function (username, password, done) {
    try {
        const user = await User.findOne({ username: username });
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));



//routes
app.get('/', isLoggedIn, (req, res) => {
	res.render("index", { title: "Home" });
});

app.get('/about', (req, res) => {
	res.render("index", { title: "About" });
});

app.get('/login', isLoggedOut, (req, res) => {
	const response = {
		title: "Login",
		error: req.query.error
	}

	res.render('login', response);
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login?error=true'
}));

app.get('/logout',  (req, res) => {
	req.logout();
	res.redirect('/');
});

// Setup our admin user
app.get('/setup', async (req, res) => {
	const exists = await User.exists({ username: "admin" });

	if (exists) {
		res.redirect('/login');
		return;
	};

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash("pass", salt, function (err, hash) {
			if (err) return next(err);
			
			const newAdmin = new User({
				username: "admin",
				password: hash
			});

			newAdmin.save();

			res.redirect('/login');
		});
	});
});

app.listen(port,()=>{
    console.log(`listening on port: ${port}`);
})