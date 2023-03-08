const { Need, Sequelize } = require('./../models');
const { getPagination, getPagingData } = require('./../helper/pagination');
const { need: messages } = require('./../helper/messages');

module.exports = {
  create(req, res) {
    const dataCreate = Object.assign({}, req.body, { status: 'actual', owner_id: req.decoded.id });
    Need.create(dataCreate)
      .then((need) =>
        res.status(200).json({ message: messages.created })
      )
      .catch((error) => res.status(404).send(error));
  },
  getById(req, res) {
    Need.findOne({
      where: { id: req.params.id }
    })
      .then((need) => res.status(200).json({ need }))
      .catch((error) => res.status(404).send(error));
  },
  getAll(req, res) {
    Need.findAll()
      .then((needs) => res.status(200).json({ needs }))
      .catch((error) => res.status(404).send(error));
  },
  delete(req, res) {
    Need.destroy({ where: { id: req.params.id } })
      .then((need) => res.status(200).json({ need }))
      .catch((error) => res.status(404).send(error));
  },
  getList(req, res) {
    const { page, size, title, filter } = req.query;
    
    let condition;
    if (title) {
      condition = { title: { [Sequelize.Op.like]: `%${title}%` } };
      if (filter) {
        condition = { title: { [Sequelize.Op.like]: `%${title}%` }, status: filter };
      }
    } else {
      condition = {};
      if (filter) {
        condition = { status: filter };
      }
    }

    const { limit, offset } = getPagination(page, size);

    Need
      .findAndCountAll({
        limit,
        offset,
        where: condition
      })
      .then((needs) => {
        const response = getPagingData(needs, page, limit);
        res.status(200).send(response);
      })
      .catch((error) => res.status(404).send(error));
  }
};
