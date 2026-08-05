import express from "express";
import {signup, login} from "../controllers/auth.js";
import {forgetPassword} from "../controllers/forgetPassword.js";
import {resetPassword} from "../controllers/resetPassword.js";
const router=express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);


export default router;