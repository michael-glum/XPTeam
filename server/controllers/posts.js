import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const post = await Post.find().sort({ createdAt: -1 });
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        const user = await User.findById(post.userId);

        if (isLiked) {
            post.likes.delete(userId);
            await User.findByIdAndUpdate(
                post.userId,
                { likes: user.likes != undefined ? --user.likes : 0 }
            );
        } else {
            post.likes.set(userId, true);
            await User.findByIdAndUpdate(
                post.userId,
                { likes: user.likes != undefined ? ++user.likes : 1 }
            );
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* DELETE */
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        const user = await User.findById(post.userId);
        const likes = user.likes != undefined ? user.likes - post.likes.size : 0;
        await User.findByIdAndUpdate(
             post.userId,
             { likes: likes}
        );
        await Post.findByIdAndDelete(postId);
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(201).json(posts);
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}