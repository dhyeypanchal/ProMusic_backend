const express = require('express');
const Music = require("../models/musicModel")
const router = express.Router();
const cloudinary = require("cloudinary").v2


// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


// ROUTE:1 get all the songs in musics db using: GET "/music", login required
router.get("/music", async (req, res) => {
    try {
        const music = await Music.find()
        res.json(music)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})


router.post("/music", async (req, res) => {
    const file = req.files.audio; // this is useful for storing music.
    cloudinary.uploader.upload(file.tempFilePath, { resource_type: "video" }, async (err, result) => { // this resource_type is required for the string audio element in image it is not needed.
        console.log(result);
        const music = await new Music({
            songname: req.body.songname,
            audio: result.url,
            movie: req.body.movie,
            artists: req.body.artists
        })
        await music.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                new_music: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            })
        })
    })
})


// for searching songs
router.get("/music/search",async(req,res)=>{
    let data = await Music.find(
        {
            "$or":[
                {songname:{$regex:req.query.search}},
                {movie:{$regex:req.query.search}},
                {artists:{$regex:req.query.search}}
            ]
        }
    )
    res.status(200).send(data);
})

module.exports = router;