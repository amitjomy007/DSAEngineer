import express from 'express'; 
const router = express.Router();
//Controller Imports
import { loginControl, registerControl } from '../controllers/authController';
import { judgeControl } from '../controllers/judgeController';
//Auth Routes
router.post('/login', loginControl);
router.post('/register', registerControl);
router.post('/judge', judgeControl);




export default router;
