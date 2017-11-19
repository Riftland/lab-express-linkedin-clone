const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//Init page
router.get('/', (req, res, next) => {
  res.render('authentication/login');
});

//Get and post for sign up
router.get('/signup', (req, res, next) => {
  res.render('authentication/signup');
});

router.post("/signup", (req, res, next) => {
  const {username, email, password} = req.body;

  if (username !== "" && password !== "" && email !== "") {
    User.findOne({username}, 'username')
      .then(userFinded => {
        let salt = bcrypt.genSaltSync(bcryptSalt);
        let hashPass = bcrypt.hashSync(password, salt);

        let newUser = User({
          username,
          email,
          password: hashPass
        });

        newUser.save()
          .then(() => {
            res.redirect('/');
          })
          .catch(error => {
            res.render('authentication/signup', {
              errorMessage: 'Some error has occurred'
            });
          });
      })
      .catch(error => {
        res.render('authentication/signup', {
          errorMessage: 'Some error has occurred'
        });
      });

  } else{
    res.render("authentication/signup", {
      errorMessage: 'Fill al fields!'
    });
  }
});

//Post for log in
router.post("/", (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "username": username },
    "_id username password",
    (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect('/profile');
        } else {
          res.render("authentication/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

//For log out
router.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
