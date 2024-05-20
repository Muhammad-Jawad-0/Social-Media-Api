import { Router } from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt"

const router = Router()


//REGISTER
router.post("/register", async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //generate new User
        const newUser = User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        //save user and response
        const user = await newUser.save();
        res.status(200).json(user)
        // res.status(200).send({ status: 200, massage: "User Register Successfully" })
    } catch (error) {
        console.log("error", error)
        res.status(500).json(error)
    }
})


//LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            // res.status(404).send({ status: 404, massage: "user not found" })
            res.status(404).json({ massage: "user not found" })
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        // !validPassword && res.status(400).send({ status: 400, massage: "invalid password" })
        !validPassword && res.status(400).json({ massage: "wrong password" })

        res.status(200).json(user)
    } catch (error) {
        console.log("error", error)
        res.status(500).json(error)
    }
})

// module.exports = router;
export default router;