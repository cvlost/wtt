import express from 'express';
import auth from '../middleware/auth';
import * as reportsController from '../controllers/reports-controller';

const reportsRouter = express.Router();

reportsRouter.get('/', auth, reportsController.getAll);
reportsRouter.get('/:date', auth, reportsController.getByDate);
// tasksRouter.post('/', auth, reportsController.createOne);
// tasksRouter.put('/:date', auth, reportsController.updateOne);
// tasksRouter.delete('/date', auth, reportsController.deleteOne);

export default reportsRouter;
