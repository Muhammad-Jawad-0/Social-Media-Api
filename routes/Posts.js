import { Router } from "express";
import PostModal from "../models/Post.js";
import UserModal from "../models/User.js";

const router = Router();

//create a post
router.post("/", async (req, res) => {
    const newPost = new PostModal(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json({ status: 200, post: savedPost })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})
//update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await PostModal.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json({ status: 200, massage: "the post has been updated" })
        } else {
            res.status(403).json({ massage: "you can update only your post!" })
        }
    } catch (error) {
        res.status(500).json({ status: 500, error: error })
    }
})
//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await PostModal.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json({ status: 200, massage: "the post has been deleted" })
        } else {
            res.status(403).json({ massage: "you can delete only your post!" })
        }
    } catch (error) {
        res.status(500).json({ status: 500, error: error })
    }
})
//like / dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await PostModal.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json({ status: 200, masssage: "the post has been liked" })
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json({ status: 200, masssage: "the post has been disliked" })
        }
    } catch (error) {
        res.status(500).json({ status: 500, error: error })
    }
})
//get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await PostModal.findById(req.params.id);
        res.status(200).json({ status: 200, massage: post })
        // res.status(200).send({ status: 200, massage: post })
    } catch (error) {
        res.status(500).json({ status: 500, error: error })
        // res.status(500).send({ status: 500, error: error })
    }
})
//get timeline posts
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await UserModal.findById(req.body.userId);
        const userPosts = await PostModal.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return PostModal.find({ userId: friendId })
            })
        );
        res.status(200).send(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).send({ error: error })
    }
})

export default router;