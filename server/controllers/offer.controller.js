const { Offer, Sequelize } = require('./../models');
const { offer: messages } = require('./../helper/messages');

module.exports = {
  create(req, res) {
    const { needId } = req.query;

    const dataCreate = Object.assign({}, req.body, { need_id: needId, owner_id: req.decoded.id });
    Offer.create(dataCreate)
      .then((offer) =>
        res.status(200).json({ message: messages.created })
      )
      .catch((error) => res.status(404).send(error));
  },
  // delete(req, res) {
  //   const groupsIds = req.body.map((each) => each.id);
  //   GroupOfBookmarks.destroy({ where: { id: groupsIds } })
  //     .then((groups) => res.status(200).json({ groups }))
  //     .catch((error) => res.status(404).send(error));
  // },
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
