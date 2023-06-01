import express from 'express';
import auth from '../middleware/auth';
import * as tasksController from '../controllers/tasks-controller';

const reportsRouter = express.Router();

reportsRouter.get('/', auth, tasksController.getAll);
reportsRouter.get('/:date', auth, tasksController.getByDate);
// tasksRouter.post('/', auth, tasksController.createOne);
// tasksRouter.put('/:date', auth, tasksController.updateOne);
// tasksRouter.delete('/date', auth, tasksController.deleteOne);

export default reportsRouter;
