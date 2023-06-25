const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { User, Need, Offer } = require('./../models');
const { user: messages } = require('./../helper/messages');

const tokenList = {};

module.exports = {
  login(req, res) {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then((user) => {
        if (user) {
          if (passwordHash.verify(req.body.password, user.password)) {
            if (user.isActivate) {
              const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
                expiresIn: process.env.TIME_REFRESH_TOKEN
              });
              tokenList[refreshToken] = refreshToken;
              return res.status(200).json({
                isPrevUserCreated: true,
                message: messages.successfulLogin,
                token: jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
                  expiresIn: process.env.TIME_TOKEN
                }),
                refreshToken: refreshToken,
                userId: user.id
              });
            } else if (!user.isActivated) {
              return res.status(200).json({
                isPrevUserCreated: true,
                message: messages.notActivated
              });
            }
          } else {
            return res.status(200).json({
              isPrevUserCreated: true,
              message: messages.notValidPassword
            });
          }
        } else {
          if (req.body.email === process.env.ADMIN_EMAIL) {
            User.create({
              isAdmin: true,
              nickname: null,
              email: req.body.email,
              password: passwordHash.generate(req.body.password),
              isActivate: true
            }).then((user) => {
              const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
                expiresIn: process.env.TIME_REFRESH_TOKEN
              });
              tokenList[refreshToken] = refreshToken;
              return res.status(200).json({
                isPrevUserCreated: true,
                message: messages.successfulLogin,
                token: jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
                  expiresIn: process.env.TIME_TOKEN
                }),
                refreshToken: refreshToken,
                userId: user.id
              });
            });
          } else {
            if (!req.body.isPrevUserCreated) {
              User.create({
                isAdmin: false,
                nickname: null,
                email: req.body.email,
                password: passwordHash.generate(req.body.password),
                isActivate: false
              }).then((user) =>
                res.status(200).json({
                  isPrevUserCreated: true,
                  message: messages.soonActivate
                })
              );
            } else {
              return res.status(200).json({
                isPrevUserCreated: true,
                message: messages.alreadyCreated
              });
            }
          }
        }
      })
      .catch((error) => res.status(401).send(error));
  },
  refreshToken(req, res) {
    // refresh the damn token
    const postData = req.body;
    // if refresh token exists
    if (postData.refreshToken && postData.refreshToken in tokenList) {
      const user = {
        id: postData.id
      };
      const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.TIME_REFRESH_TOKEN
      });
      const response = {
        token: token
      };
      // update the token in the list
      delete tokenList[postData.refreshToken];
      res.status(200).json(response);
    } else {
      res.status(403).send('Invalid request');
    }
  },
  retrieve(req, res) {
    User.findOne({
      where: { id: req.params.id }
    })
      .then((user) => res.status(200).json({ user }))
      .catch((error) => res.status(404).send(error));
  },
  list(req, res) {
    User.findAll({
      where: { id: { [Op.not]: req.params.id } }
    })
      .then((users) => res.status(200).json({ users }))
      .catch((error) => res.status(404).send(error));
  },
  activation(req, res) {
    User.findOne({
      where: {id: req.body.id}
    })
      .then((user) => {
        user.update({
          isActivate: true
        });
        res.status(200).json({ message: messages.activated });
      })
      .catch((error) => res.status(400).send(error));
  },
  deactivation(req, res) {
    User.findOne({
      where: {id: req.body.id}
    })
      .then((user) => {
        user.update({
          isActivate: false
        });
        res.status(200).json({ message: messages.deactivated });
      })
      .catch((error) => res.status(400).send(error));
  },
  delete(req, res) {
    Need.findAll({ where: { owner_id: req.body.id } })
      .then((needs) => {
        needs &&
          needs.forEach((need) => {
            need.destroy();
          });
        })
      .then(() => {
        Offer.findAll({ where: { owner_id: req.body.id } })
          .then((offers) => {
            offers &&
              offers.forEach((offer) => {
                offer.destroy();
              });
            })
          .then(() => {
            User.destroy({ where: { id: req.body.id } }).then((user) => {
              res.status(200).json({ message: messages.deleted });
            });
          });
      })
      .catch((error) => res.status(404).send(error));
  }
};
