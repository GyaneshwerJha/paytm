const express = require('express');
const router = express.Router();
const z = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, Account } = require('../db');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');

// To validate the signup body
const signUpBody = z.object({
    username: z.string().email(),
    password: z.string().min(8, { message: 'Password is too short' }).max(20, { message: 'Password is too long' }),
    firstName: z.string(),
    lastName: z.string()
});

router.post('/signup', async (req, res) => {
    try {
        // Validate with Zod
        const { success } = signUpBody.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ message: 'Email is already taken / Incorrect input' });
        }

        // Check if it is an existing user or not
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(411).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create the user
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        await Account.create({
            userId: user._id,
            balance: 1 + Math.random() * 10000
        })

        // Use jwt.sign to generate a token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({
            message: 'User created successfully',
            token: token
        });
        return;
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const signInBody = z.object({
    username: z.string().email(),
    password: z.string().min(8, { message: 'Password is too short' }).max(20, { message: 'Password is too long' }),
})

router.post("/signin", async (req, res) => {
    // validate
    try {
        const { success } = signInBody.safeParse(req.body)
        if (!success) {
            return res.status(411).json({ message: "Email doesn't exist" })
        }

        // find in database
        const user = await User.findOne({
            username: req.body.username
        })

        if (user) {
            // compare the hashed password with user password
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatch) {

                const token = jwt.sign({ userId: user._id }, JWT_SECRET)
                return res.json({
                    token: token
                })

            }

        }


        res.status(401).json({
            message: "Error while signIn"
        })
    }
    catch (err) {
        console.err("Error during signin", err);
        res.status(500).json({ message: "Interval server error" })
    }
})

const updateBody = z.object({
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({ message: "Error while updating information" })
    }

    await User.updateOne({ _id: req.userId }, req.body)

    res.json({ message: "Updated successfully" })
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            {
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }
            }
        ]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})




module.exports = router;



// for signup
// validate with zod
// check if success of not
// check if it is existign user or not
// hash the password
// create the user
// create userId for token
// use jwt.sign to generate token

// extracting the value of the success property from the result of signUpBody.safeParse(req.body)
