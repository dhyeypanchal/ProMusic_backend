const express = require('express');
const Playlist = require("../models/playlistModel")
const Music = require("../models/musicModel")
const router = express.Router();
const fetchUser = require("../Middleware/fetchUser")

router.get("/playlist",fetchUser, async (req, res) => {
    try {
        const playlist = await Playlist.find({user:req.user.id})
        res.json(playlist)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

router.post("/playlist",fetchUser, async (req, res) => {
    let song = await Playlist.findOne({ audio: req.body.audio, user:req.user.id});
    if (song) {
        console.log("already there");
        return res.status(400).json({ error: "sorry user with this email already exist." })
    }
    console.log(req.body.songname,req.body.audio, req.body.audio, req.body.artists);
    const playlist = await new Playlist({
        user: req.user.id,
        songname: req.body.songname,
        audio: req.body.audio,
        movie: req.body.movie,
        artists: req.body.artists
    })
    await playlist.save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            new_playlist: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            Error: err
        })
    })
})

// for deleting from playlist
// ROUTE:4 Delete song from playlist using: POST "delete", login required
router.delete("/delete/:id",fetchUser, async (req, res) => {
    try {
        // find the note to be deleted and delete it.
        let playlist = await Playlist.findById(req.params.id);
        // console.log(playlist);
        if (!playlist) {
            return res.status(404).send("Not Found")
        }
        // allow deletion only if user have this song in his/her playlist
        if (playlist.user.toString() !== req.user.id) { // this will check database user id with this user who want to update note id.
            return res.status(401).send("Not Allowed")
        }
        playlist = await Playlist.findByIdAndDelete(req.params.id)
        res.json({ "Success": "song has been deleted", Playlist: Playlist })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

// for searching songs
router.get("/playlist/search", async (req, res) => {
    let data = await Playlist.find(
        {
            "$or": [
                { songname: { $regex: req.query.search } },
                { movie: { $regex: req.query.search } },
                { artists: { $regex: req.query.search } }
            ]
        }
    )
    res.status(200).send(data);
})
router.get("/suggetions", async (req, res) => {
    let data = await Music.find(
        {
            "$or": [
                { artists: { $regex: req.query.artist1 } },
                { artists: { $regex: req.query.artist2 } },
                { artists: { $regex: req.query.artist3 } },
                { artists: { $regex: req.query.artist4 } },
                { artists: { $regex: req.query.artist5 } }
            ]
        }
    )
    res.status(200).send(data);
})

module.exports = router;