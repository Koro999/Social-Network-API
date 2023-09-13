const { connect, connection } = require('mongoose');

//connection file
//connect to mongoDB
connect('mongodb://127.0.0.1:27017/developersApplications');

module.exports = connection;
