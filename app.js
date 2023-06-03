const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/user');
const musicRoutes = require('./Routes/music');
const playlistRoutes = require('./Routes/playlist');
const contactRoute = require('./Routes/contact');
require("./db/database")
const fileUpload = require("express-fileupload")

const app = express();
const port = process.env.PORT || 5000;

app.use(fileUpload({
    useTempFiles:true // this is useful for uploading file from device.
}))
app.use(cors()); //cors is required to connect react app with the server
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', userRoutes);
app.use('/', musicRoutes);
app.use('/', playlistRoutes);
app.use('/', contactRoute);

app.get('/', (req, res) => {
    res.send("Hello You are inside the server");
})


app.listen(port, () => {
    console.log("The server is listening on the port " + port);
}); 