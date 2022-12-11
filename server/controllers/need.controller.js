const { Need, Sequelize } = require('./../models');
const { getPagination, getPagingData } = require('./../helper/pagination');
const { need: messages } = require('./../helper/messages');

module.exports = {
  // create(req, res) {
  //   const dataCreate = Object.assign({}, req.body, { UserId: req.decoded.id });
  //   GroupOfBookmarks.create(dataCreate)
  //     .then((groupOfBookmark) =>
  //       res.status(200).json({ message: messages.created })
  //     )
  //     .catch((error) => res.status(404).send(error));
  // },
  // list(req, res) {
  //   Need.findAll({
  //     where: { owner_id: req.params.id },
  //   })
  //     .then((groups) => res.status(200).json({ groups }))
  //     .catch((error) => res.status(404).send(error));
  // },
  // delete(req, res) {
  //   const groupsIds = req.body.map((each) => each.id);
  //   GroupOfBookmarks.destroy({ where: { id: groupsIds } })
  //     .then((groups) => res.status(200).json({ groups }))
  //     .catch((error) => res.status(404).send(error));
  // },
  getAll(req, res) {
    const { page, size, title } = req.query;
    const condition = title ? { title: { [Sequelize.Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);

    Need
      .findAndCountAll({
        limit,
        offset,
        where: condition,
      })
      .then((needs) => {
        const response = getPagingData(needs, page, limit);
        res.status(200).send(response);
      })
      .catch((error) => res.status(404).send(error));
  },
};
