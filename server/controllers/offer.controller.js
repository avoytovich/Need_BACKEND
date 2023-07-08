const { Offer, Need, Chat, Sequelize } = require('./../models');
const { offer: messages } = require('./../helper/messages');

module.exports = {
  create(req, res) {
    const { needId } = req.query;

    const dataCreate = Object.assign({}, req.body, { need_id: needId, owner_id: req.decoded.id });
    Offer.findOne({
      where: {
        need_id: needId,
        owner_id: req.decoded.id
      }
    })
    .then((offer) => {
      if (!offer) {
        Offer.create(dataCreate)
          .then((offer) =>
            res.status(200).json({ message: messages.created })
          )
          .catch((error) => res.status(404).send(error));
      } else {
        res.status(200).json({ message: messages.creationDenied });
      }
    }
  )
    .catch((error) => res.status(404).send(error));
  },
  acceptOrReject(req, res) {
    const dataUpdate = Object.assign({}, req.body);
    Offer.findOne({
      where: {
        id: req.params.id
      }
    })
    .then((offer) => {
      Need.findOne({
        where: {
          id: offer.need_id
        }
      })
        .then((need) => {
          if (req.body.isAccepted) {
            if(need.status !== 'in_progress') {
              need.update({status: 'in_progress'})
                .then((need) => {
                  Offer.update(dataUpdate, {
                    where: {
                      id: req.params.id
                    }
                  })
                    .then((offer) =>
                      res.status(200).json({ message: messages.updated })
                    )
                    .catch((error) => res.status(404).send(error));
                })
                .catch((error) => res.status(404).send(error));
            } else {
              res.status(200).json({ message: messages.acceptionDenied });
            }
          } else {
            if(need.status === 'in_progress') {
              need.update({status: 'actual'})
                .then((need) => {
                  Offer.update(dataUpdate, {
                    where: {
                      id: req.params.id
                    }
                  })
                    .then((offer) =>
                      res.status(200).json({ message: messages.updated })
                    )
                    .catch((error) => res.status(404).send(error));
                })
                .catch((error) => res.status(404).send(error));
            } else {
              res.status(200).json({ message: messages.rejectionDenied });
            }
          }
        })
          .catch((error) => res.status(404).send(error));
    })
      .catch((error) => res.status(404).send(error));
  },
  update(req, res) {
    const dataUpdate = Object.assign({}, req.body, { owner_id: req.decoded.id });
    Offer.update(dataUpdate, {
      where: {
        id: req.params.id
      }
    })
      .then((offer) =>
        res.status(200).json({ message: messages.updated })
      )
      .catch((error) => res.status(404).send(error));;
  },
  delete(req, res) {
    Chat.findAll({ where: { offer_id: req.params.id } })
      .then((chats) => {
        chats &&
          chats.forEach((chat) => {
            chat.destroy();
          });
        })
      .then(() => {
        Offer.findOne({
          where: {
            id: req.params.id
          }
        })
         .then(offer => {
            if (offer.isAccepted) {
              Need.findOne({
                where: {
                  id: offer.need_id
                }
              })
                .then((need) =>
                need.update({status: 'actual'})
              )
              .catch((error) => res.status(404).send(error));
            }
            Offer.destroy({
              where: {
                id: req.params.id
              }
            })
              .then((offer) =>
                res.status(200).json({ message: messages.deleted })
              )
              .catch((error) => res.status(404).send(error));
            
         })
         .catch((error) => res.status(404).send(error));
      })
      .catch((error) => res.status(404).send(error));
  },
  getListToUser(req, res) {
    Offer
      .findAll({
        where: {
          owner_id: req.decoded.id
        }
      })
      .then((offers) => res.status(200).send(offers))
      .catch((error) => res.status(404).send(error));
  },
  getListToNeed(req, res) {
    const { needId } = req.query;

    Offer
      .findAll({
        where: {
          need_id: needId
        }
      })
      .then((offers) => res.status(200).send(offers))
      .catch((error) => res.status(404).send(error));
  }
};
