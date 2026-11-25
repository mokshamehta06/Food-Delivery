import express from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controllers"

const authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.get("/signIn",signIn)
authRouter.get("/signOut",signOut)

export default authRouter