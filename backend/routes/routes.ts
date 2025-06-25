import express from 'express'; 
const router = express.Router();
//Controller Imports
import { loginControl, registerControl } from '../controllers/authController';

//Auth Routes
router.post('/login', loginControl);
router.post('/register', registerControl);




export default router;
