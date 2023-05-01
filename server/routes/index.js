const { 
  userController,
  needController,
  offerController,
  chatController
} = require('./../controllers');

module.exports =
  (app) => {
    app.get('/test', (req, res) => res.status(200).send({
      message: 'Welcome'
    }));

    app.post('/login', userController.login);
    app.get('/user/:id', userController.retrieve);
    app.get('/user/:id/user_list', userController.list);
    app.post('/user/:id/user_activate', userController.activation);
    app.post('/user/:id/user_deactivate', userController.deactivation);
    app.delete('/user/:id/user_delete', userController.delete);

    app.get('/needs', needController.getList);
    app.get('/needs-all', needController.getAll);
    app.get('/needs-all/:userId', needController.getAllByUserId);
    app.get('/needs/:id', needController.getById);
    app.post('/needs/create', needController.create);
    app.put('/needs/:id/update', needController.update);
    app.delete('/needs/:id/delete', needController.delete);

    app.get('/offers-to-need', offerController.getListToNeed);
    app.put('/offer/:id/accept_reject', offerController.acceptOrReject);
    app.post('/offer/create', offerController.create);

    app.get('/chat', chatController.getByNeedIdOfferId);
    app.post('/chat/create_update', chatController.createOrUpdate);
  };
