const { 
  userController,
  needController,
  offerController
} = require('./../controllers');

module.exports =
  (app) => {
    app.get('/test', (req, res) => res.status(200).send({
      message: 'Welcome'
    }));

    app.post('/login', userController.login);
    // app.post('/user/:id/user_activate', userController.activation);
    // app.post('/user/:id/user_deactivate', userController.deactivation);

    app.get('/needs', needController.getList);
    app.get('/needs-all', needController.getAll);
    app.get('/needs/:id', needController.getById);
    app.post('/needs/create', needController.create);
    app.delete('/needs/:id/delete', needController.delete);

    app.get('/offers-to-need', offerController.getListToNeed);
    app.post('/offer/create', offerController.create);
  };
