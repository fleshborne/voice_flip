const express = require('express');
const passport = require('passport');
const multer  = require("multer")
const storage = multer.memoryStorage() // or use disk storage
const upload = multer({ storage })
const fs = require('fs');
const Guest = require('./GuestsSchema');

const guestsController = require('./guestsController');

const router = express.Router();

/* 
  @route  /api/guests/register
  @desc   Register guests
  @access public
*/
router.post('/register', guestsController.register);

/* 
  @route  /api/guests/audio
  @desc   Audio guests
  @access public
*/
router.post('/audio', upload.single("audioFile"), async (req, res) => {
  console.log(req.body.id)
  const buffer = Buffer.from( await req.file.buffer);
  let filename = `${(Date.now())}.webm`
  fs.writeFile('./server/public/' + filename, buffer, () => {
    console.log('audio saved!')
    const opts = {
      new: true,
    }

    if (req.body.id) {
      Guest.findOneAndUpdate({ _id:req.body.id }, { $set: {filename: filename} }, opts)
      .then(guest => {
        res.json({
          status: true,
          id: guest.id,
          message: 'Guest audio saved successfully!',
        });
      });
    }else{
      const newGuest = Guest({
        filename: filename,
      });
      newGuest.save().then(() => {
        res.json({
          status: true,
          id: newGuest.id,
          message: 'Guest audio saved successfully!',
        });
      })
      .catch(err => {
        throw new Error(err);
      });
    }
  });
  // see https://github.com/expressjs/multer#file-information
});
/* 
  @route  /api/guests/update
  @desc   Update profile information
  @access private
*/
router.put('/update', guestsController.update);

/* 
  @route  /api/guests/delete
  @desc   Delete account
  @access private
*/
router.post('/delete',
  passport.authenticate('jwt', { session: false }),
  guestsController.guestDelete,
);

/* 
  @route  /api/guests/all
  @desc   Get all guests
  @access private
*/
router.get('/all',
  passport.authenticate('jwt', { session: false }),
  guestsController.getGuestList,
);

module.exports = router;