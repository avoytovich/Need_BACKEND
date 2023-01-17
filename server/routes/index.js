const { 
  userController,
  needController
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
    app.post('/needs/create', needController.create);

  };
