import express from 'express';
import auth from '../middleware/auth';
import * as reportsController from '../controllers/reports-controller';

const reportsRouter = express.Router();

reportsRouter.get('/', auth, reportsController.getAll);
reportsRouter.get('/:date', auth, reportsController.getByDate);
reportsRouter.get('/single/:id', auth, reportsController.getOne);
reportsRouter.post('/', auth, reportsController.createOne);
reportsRouter.patch('/:id', auth, reportsController.updateOne);
reportsRouter.delete('/:id', auth, reportsController.deleteOne);

export default reportsRouter;
