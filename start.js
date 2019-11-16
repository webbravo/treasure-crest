// import environmental variables from our variables.env file
require('dotenv').config({
  path: 'variables.env'
});



// READY?! Let's go!

// import all of our models file

// Start our app!
const app = require('./app');

app.set('port', process.env.PORT || 8600);
const server = app.listen(app.get('port'), () => {
  console.debug(`Express running → PORT ${server.address().port}`);
});