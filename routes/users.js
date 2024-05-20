import { Router } from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt";

const router = Router()

// $2b$10$cB2BqZm.QbJVSdNWwLjAgO/DumE/CbxrY1OIEQjqfIbN14uf20Wvi now password


//update User
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body })
            res.status(200).json({ massage: "Account has been Updated" })
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("you can updated only your account")
    }
})
//delete User
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        // if (req.body.password) {
        //     try {
        //         const salt = await bcrypt.genSalt(10);
        //         req.body.password = await bcrypt.hash(req.body.password, salt)
        //     } catch (error) {
        //         return res.status(500).json(error)
        //     }
        // }
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json({ massage: "Account has been deleted successfully" })
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("you can delete only your account")
    }
})
//get a User
router.get("/:id", async (req, res) => {
    try {
        // const user = await User.findById(req.params.id)
        const user = await User.findById(req.params.id)
        const { password, email, updatedAt, ...other } = user._doc
        res.status(200).json({ status: 200, other })
    } catch (error) {
        res.status(500).json({ status: 500, error: error, massage: "user not found" })
    }
})
//follow User
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json({ status: 200, massage: "user has been Followed" })
            } else {
                res.status(403).json({ massage: "you already follow this user" })
            }
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else {
        res.status(403).json({ massage: "you can not follow your self" })
    }

})
//unfollow User
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json({ status: 200, massage: "user has been unfollowed" })
            } else {
                res.status(403).json({ massage: "you dont follow this user" })
            }
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else {
        res.status(403).json({ massage: "you can not unfollow your self" })
    }

})

// module.exports = router;
export default router;