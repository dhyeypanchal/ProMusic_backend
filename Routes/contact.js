const express = require('express');
const Contact = require("../models/contactModel")
const router = express.Router();


// for contacting us
router.post("/contact", async (req, res) => {
    let success=true;
    try {
        let contact = await Contact.create({
            name: req.body.name,
            query: req.body.query
        })
        res.json({ success, contact })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

module.exports = router;