import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

//Get all posts
export const getAllPosts = async (req, res) => {
    const query = req.query;
    const filter = {};

    if (query.city && query.city !== 'undefined') {
        filter.city = query.city;
    }
    if (query.type) {
        filter.type = query.type
    }
    if (query.property) {
        filter.property = query.property
    }
    if (query.bedroom) {
        filter.bedroom = parseInt(query.bedroom)
    }
    if (query.minPrice || query.maxPrice) {
        filter.price = {}
        if (query.minPrice) {
            filter.price.gte = parseInt(query.minPrice)
        }
        if (query.maxPrice && query.maxPrice > 0) {
            filter.price.lte = parseInt(query.maxPrice)
        }
    }

    try {
        const posts = await prisma.post.findMany({
            where: filter
        });
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Get post by id
export const getPostById = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            }
        });

        let userId;

        const token = req.cookies.token;

        if (!token) {
            userId = null
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (err) {
                    userId = null
                } else {
                    userId = payload.id
                }
            })
        };

        const saved = await prisma.savePost.findUnique({
            where: {
                userId_postId: {
                    postId: req.params.id,
                    userId,
                }
            }
        });

        res.status(200).json({ ...post, isSaved: saved ? true : false });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Create post
export const createPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;
    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                }
            }
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Update post
export const updatePost = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Delete post
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (post.userId !== tokenUserId) return res.status(403).json({ message: "Not Authorized!" });

        await prisma.post.delete({
            where: { id }
        });
        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

