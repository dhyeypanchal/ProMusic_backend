const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // this act as a foreign key like connecting user with this notes database.
        ref: "user" // this we give as name in time of export in user model.
    },
    songname: {
        type: String
    },
    audio: {
        type: String,
        required: true,
        unique: false 
    },
    movie: {
        type: String,
    },
    artists: {
        type: [String]
    }
});

module.exports = new mongoose.model('Playlist', playlistSchema);