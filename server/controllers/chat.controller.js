const { Chat, Sequelize } = require('./../models');
const { chat: messages } = require('./../helper/messages');

module.exports = {
  getByNeedIdOfferId(req, res) {
    const { needId, offerId } = req.query;
    Chat.findOne({
      where: {
        need_id: needId,
        offer_id: offerId
      }
    })
      .then((chat) => res.status(200).json({ chat }))
      .catch((error) => res.status(404).send(error));
  },
  createOrUpdate(req, res) {
    const { needId, offerId } = req.query;
    const data = Object.assign({}, req.body, { need_id: needId, offer_id: offerId });
    Chat.findOne({
      where: {
        need_id: needId,
        offer_id: offerId
      }
    })
    .then((chat) => {
      if (chat) {
        Chat.update(data, {
          where: {
            id: chat.id
          }
        })
        .then((chat) => res.status(200).json({ chat }))
        .catch((error) => res.status(404).send(error));
      } else {
        Chat.create(data)
          .then((chat) => res.status(200).json({ chat }))
          .catch((error) => res.status(404).send(error));
      }
    })
    .catch((error) => res.status(404).send(error));
  }
};
