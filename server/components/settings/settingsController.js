const Setting = require('./SettingsSchema');

function register(req, res) {
  const newSetting = Setting({
    name: req.body.name,
    home: req.body.home,
    country: req.body.country,
    gender: req.body.gender,
    age: req.body.age,
    voice: req.body.voice,
    pitch: req.body.pitch,
    pace: req.body.pace,
  });
  newSetting.save().then(() => {
    res.json({
      status: true,
      id: newSetting.id,
      message: 'Setting created successfully!',
    });
  })
  .catch(err => {
    throw new Error(err);
  });
}

function update(req, res) {
  const formData = {
    text: req.body.text,
    updatedDate: req.body.updatedDate,
  }

  const opts = {
    new: true,
  }
  
  if (req.body.id) {
    Setting.findOneAndUpdate({ _id:req.body.id }, { $set: formData }, opts)
      .then(setting => {
        const { _id, text, createdDate, updatedDate } = setting;
        const payload = {
          _id,
          text,
          createdDate,
          updatedDate,
        }
  
        res.json({
          ...payload,
        });
      });
  } else {
    const newSetting = Setting({
      text: req.body.text
    });
    newSetting.save().then(() => {
      res.json(newSetting);
    })
    .catch(err => {
      throw new Error(err);
    });
  }
}

function settingDelete(req, res) {
  Setting.findOneAndRemove({ _id:req.body.id })
    .then(() => {
      res.json({
        status: 'TEXT_DELETED',
        message: 'Text successfully deleted!',
      })
    });
}

const getSettingList = (req, res) => {
  Setting.find({}, (err, settings) => {
    res.send(settings);  
  });
}

module.exports = {
  register,
  update,
  settingDelete,
  getSettingList
}