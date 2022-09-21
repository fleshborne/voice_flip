const express = require('express');
const passport = require('passport');
const settingsController = require('./settingsController');

const router = express.Router();

/* 
  @route  /api/settings/register
  @desc   Register settings
  @access public
*/
router.post('/register', settingsController.register);

/* 
  @route  /api/settings/update
  @desc   Update profile information
  @access private
*/
router.put('/update',
  passport.authenticate('jwt', { session: false }),
  settingsController.update,
);
/* 
  @route  /api/settings/delete
  @desc   Delete account
  @access private
*/
router.post('/delete',
  passport.authenticate('jwt', { session: false }),
  settingsController.settingDelete,
);

/* 
  @route  /api/settings/all
  @desc   Get all settings
  @access private
*/
router.get('/all',
  settingsController.getSettingList,
);

module.exports = router;