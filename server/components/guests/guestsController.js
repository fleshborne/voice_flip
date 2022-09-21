const Guest = require('./GuestsSchema');

function register(req, res) {
  const newGuest = Guest({
    name: req.body.name,
    home: req.body.home,
    country: req.body.country,
    gender: req.body.gender,
    age: req.body.age,
    voice: req.body.voice,
    pitch: req.body.pitch,
    pace: req.body.pace,
    voiceWish: req.body.voiceWish,
  });
  newGuest
    .save()
    .then(() => {
      res.json({
        status: true,
        id: newGuest.id,
        message: 'Guest created successfully!',
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
}

function update(req, res) {
  const formData = {
    name: req.body.name,
    home: req.body.home,
    country: req.body.country,
    gender: req.body.gender,
    age: req.body.age,
    voice: req.body.voice,
    pitch: req.body.pitch,
    pace: req.body.pace,
    voiceWish: req.body.voiceWish,
    updatedDate: req.body.updatedDate,
  };

  const opts = {
    new: true,
  };
  Guest.findOneAndUpdate({ _id: req.body.id }, { $set: formData }, opts).then(
    (guest) => {
      const {
        name,
        home,
        country,
        gender,
        age,
        voice,
        pitch,
        pace,
        voiceWish,
        createdDate,
        updatedDate,
      } = guest;
      const payload = {
        name,
        home,
        country,
        gender,
        age,
        voice,
        pitch,
        pace,
        voiceWish,
        createdDate,
        updatedDate,
      };

      res.json({
        ...payload,
      });
    }
  );
}

function guestDelete(req, res) {
  Guest.findOneAndRemove({ _id: req.body.id }).then(() => {
    res.json({
      status: 'ACCOUNT_DELETED',
      message: 'Account successfully deleted!',
    });
  });
}

const getGuestList = (req, res) => {
  Guest.find({}, (err, guests) => {
    res.send(guests);
  });
};

module.exports = {
  register,
  update,
  guestDelete,
  getGuestList,
};
