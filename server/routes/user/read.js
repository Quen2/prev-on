const express = require('express');
const router = express.Router();
const crypto = require('crypto')

router.post('/readUser', async (req, res) => {
    const {
      password
    } = req.body

    let data = {
        password : password
    }
    const newPassword = crypto.createHash('md5').update(data.password).digest("hex")
    try {
        res.json(newPassword)
    } catch (e) {
        res.json('fail')
    }
});

module.exports = router