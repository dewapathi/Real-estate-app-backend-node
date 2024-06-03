import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

//Users get function
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//User get function
export const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Update user function
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) return res.status(403).json({ message: "Not Authorized!" });

    let updatedPassword = null;

    try {
        if (password) updatedPassword = await bcrypt.hash(password, 10);

        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar })
            }
        });

        const { password: userPassword, ...info } = updateUser;

        res.status(200).json(info);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Delete user function
export const deleteUser = async (req, res) => {
    const tokenUserId = req.userId;

    if (req.params.id !== tokenUserId) return res.status(403).json({ message: "Not Authorized" });

    try {
        await prisma.user.delete({
            where: { id: req.params.id }
        })
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Save post function
export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPost = await prisma.savePost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId
                }
            }
        });

        if (savedPost) {
            await prisma.savePost.delete({
                where: {
                    id: savedPost.id
                }
            })
            res.status(200).json({ message: "Post removed from save list!" });
        } else {
            await prisma.savePost.create({
                data: {
                    userId: tokenUserId,
                    postId
                }
            })
            res.status(200).json({ message: "Post saved!" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Get profile post functions
export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const userPosts = await prisma.post.findMany({
            where: { userId: tokenUserId }
        });
        const saved = await prisma.savePost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true
            }
        });

        const savePosts = saved.map(item => item.post);

        res.status(200).json({ userPosts, savePosts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
};

//Get notification numbers
export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const number = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenUserId]
                    }
                }
            }
        });

        res.status(200).json(number);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Fail to get notification number!" });
    }
}