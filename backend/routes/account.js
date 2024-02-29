const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { mongoose } = require('mongoose');

router.get("/balance", authMiddleware, async (req, res) => {

    const account = await Account.findOne({
        userId: req.userId
    });

    return res.status(200).json({
        balance: account.balance
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        const senderAccount = await Account.findOne({
            userId: req.userId
        }).session(session)

        if (!senderAccount || senderAccount.balance < amount) {
            return res.status(400).json({ message: "Insufficient Balance" })
        }

        const recieverAccount = await Account.findOne({
            userId: to
        }).session(session);

        if (!recieverAccount) {
            return res.status(400).json({ message: "Reciever account not found" })
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        await session.endSession();
        res.json({ message: "Transaction successful" })
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
})


module.exports = router;