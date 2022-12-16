const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");

const secret = require("../../config/jwt.secretkey");
const { User } = require("./../models");
const { user: messages } = require("./../helper/messages");

module.exports = {
  login(req, res) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (user) {
          if (passwordHash.verify(req.body.password, user.password)) {
            if (user.isActivate) {
              return res.status(200).json({
                message: messages.successfulLogin,
                token: jwt.sign({ id: user.id }, secret.KEY, {
                  expiresIn: secret.TIME_TOKEN,
                }),
                userId: user.id,
              });
            } else if (!user.isActivated) {
              return res.status(400).json({ message: messages.notActivated });
            }
          } else {
            return res.status(400).json({ message: messages.notValidPassword });
          }
        } else {
          if (req.body.email === process.env.ADMIN_EMAIL) {
            User.create({
              isAdmin: true,
              nickname: null,
              email: req.body.email,
              password: passwordHash.generate(req.body.password),
              isActivate: true,
            }).then((user) =>
              res.status(200).json({
                message: messages.successfulLogin,
                token: jwt.sign({ id: user.id }, secret.KEY, {
                  expiresIn: secret.TIME_TOKEN,
                }),
              })
            );
          } else {
            User.create({
              isAdmin: false,
              nickname: null,
              email: req.body.email,
              password: passwordHash.generate(req.body.password),
              isActivate: false,
            }).then((user) =>
              res.status(200).json({
                message: messages.soonActivate,
              })
            );
          }
        }
      })
      .catch((error) => res.status(401).send(error));
  },

  // activation(req, res) {
  //   User.findById(req.body.id)
  //     .then((user) => {
  //       user.update({
  //         isActivated: true,
  //       });
  //       res.status(200).json({ message: messages.activated });
  //     })
  //     .catch((error) => res.status(400).send(error));
  // },

  // deactivation(req, res) {
  //   User.findById(req.body.id)
  //     .then((user) => {
  //       user.update({
  //         isActivated: false,
  //       });
  //       res.status(200).json({ message: messages.deactivated });
  //     })
  //     .catch((error) => res.status(400).send(error));
  // },
};
