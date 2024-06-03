import bcrypt from "bcrypt";
import logger from "../logger.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    //Hash password
    if (!username || !email || !password) return res.status(403).json({ message: "All data should be fill" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create a new user and save to db
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            },
        });

        res.status(201).json({ message: "User created successfull...!" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error...!", err });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        //Check user exists
        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (!user) return res.status(401).json({ message: "Invalid Credentials..!" });

        //Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials..!" });

        //Generate cookie token and send to the user
        const age = 1000 * 60 * 60 * 24 * 7; //1 Week
        const token = jwt.sign({
            id: user.id,
            isAdmin: true
        }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        const { password: userPassword, ...userInfo } = user;

        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            maxAge: age,
        }).status(200).json(userInfo);
    } catch (err) {
        res.status(500).json({ message: "Internal server error...!" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successfull." })
}