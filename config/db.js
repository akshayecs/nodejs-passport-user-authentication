require('dotenv').config();
const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // useFindAndModify:true
    });

    const connection = mongoose.connection;
    
    connection.once('open',() => {
        console.log("Connected to Database");
    });

    connection.on('error',(err) => {
        console.log("Connection failed:",err);
    });
}

module.exports = connectDB();