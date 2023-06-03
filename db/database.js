const mongoose = require('mongoose');

try {
    mongoose.set("strictQuery",false)
    let connection = mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    if (connection) {
        console.log("Database Connection is successfull");
    }
} catch (error) {
    console.log("Error while connecting the database", error);
}