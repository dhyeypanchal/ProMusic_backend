const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    songname:{
        type:String
    },
    audio:{
        type:String,
        required:true,
        unique:true // this is for my simplicity that i am not store any same song again and agian.
    },
    movie:{
        type:String,
    },
    artists:{
        type:[String]
    }
});

module.exports = new mongoose.model('Music', musicSchema);