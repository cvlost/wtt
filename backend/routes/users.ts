import express from 'express';
import auth from '../middleware/auth';
import * as usersController from '../controllers/users-controller';
import { imagesUpload } from '../multer';
import { permit } from '../middleware/permit';

const usersRouter = express.Router();

usersRouter.get('/', auth, usersController.getAll);
usersRouter.post('/register', auth, permit('admin'), imagesUpload.single('avatar'), usersController.register);
usersRouter.post('/login', usersController.login);
usersRouter.delete('/logout', usersController.logout);
usersRouter.get('/refresh', usersController.refresh);
usersRouter.get('/:id', auth, usersController.getOne);
usersRouter.patch('/:id', auth, imagesUpload.single('avatar'), usersController.updateOne);
usersRouter.delete('/:id', auth, permit('admin'), usersController.deleteOne);

export default usersRouter;
