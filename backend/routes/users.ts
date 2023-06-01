import express from 'express';
import auth from '../middleware/auth';
import * as usersController from '../controllers/users-controller';
import { imagesUpload } from '../multer';

const usersRouter = express.Router();

usersRouter.get('/', auth, usersController.getAll);
usersRouter.post('/register', auth, imagesUpload.single('avatar'), usersController.register);
usersRouter.post('/login', usersController.login);
usersRouter.delete('/logout', usersController.logout);
usersRouter.get('/refresh', usersController.refresh);
usersRouter.get('/:id', auth, usersController.getOne);

export default usersRouter;
