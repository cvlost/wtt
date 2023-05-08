import express from 'express';
import auth from '../middleware/auth';
import * as usersController from '../controllers/users-controller';

const usersRouter = express.Router();

usersRouter.get('/', auth, usersController.getAll);
usersRouter.post('/registration', usersController.register);
usersRouter.post('/login', usersController.login);
usersRouter.delete('/logout', usersController.logout);
usersRouter.get('/refresh', usersController.refresh);

export default usersRouter;
