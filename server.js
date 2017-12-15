// Server
const express = require('express');
// Templating engine, handlebars, wrapping handlebars in hbs
const hbs = require('hbs');
// file system
const fs = require('fs');

// get port variable for Heroku from environment variables.
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
//     // NO next() CALL, so NOTHING ELSE below this line can run.
// });

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(`${now}: ${req.method} ${req.url}`);
    fs.appendFileSync('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });

    next();
});

hbs.registerHelper('getCurrentYear', ()=> {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my page'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to fulfill this request.'
    });
});

// variable for port, Heroku using variable ports.
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
