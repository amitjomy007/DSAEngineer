import express from 'express'; 
const router = express.Router();
import { addProblemControl } from '../controllers/addProblemControl';
//Controller Imports
import { loginControl, registerControl } from '../controllers/authController';
import { judgeControl } from '../controllers/judgeController';
//Auth Routes
router.post('/login', loginControl);
router.post('/register', registerControl);
router.post('/judge', judgeControl);
router.post('/addProblem',addProblemControl);



export default router;
