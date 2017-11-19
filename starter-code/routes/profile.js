const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../models/User");

let id;

//Ver perfil
router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
  }else {
    id = req.session.currentUser._id;
    User.findById(id)
      .then((user) => {
        res.render('profile/show', {
          user : user
        });
      }).catch((err) => {
        return next(err);
      });
    }
});

//Editar perfil
router.get('/:id', (req, res, next) => {
  id = req.params.id;
  console.log(id);
  User.findById(id)
    .then(user => {
      res.render('profile/edit', {
        user
      })
    })
    .catch(error => {
      res.render('profile/show', {
        errorMessage: 'Ha habido algún tipo de error'
      })
    });
});

router.post('/edit', (req, res,next) => {
  const dataToUpdate = {
    username: req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobtitle
  }

  console.log(req.body.username, req.body.email, req.body.summary, req.body.imageUrl, req.body.company, req.body.jobTitle);

  User.findByIdAndUpdate(id, dataToUpdate)
    .then(() => {
      res.redirect('/profile');
    })
    .catch(error => {
      errorMessage: error.message
    });
});

module.exports = router;
