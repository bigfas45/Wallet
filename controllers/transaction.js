const formidable = require("formidable");
const _ = require("lodash");
const Transaction = require("../modles/transaction");
const Wallet = require("../modles/wallet");
const {errorHandler} = require("../helpers/dbErrorHandler");


exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => { // check for all fields
        const {amount} = fields;
        if (!amount) {
            return res.status(400).json({error: " All fields are required "});
        }
        let transaction = new Transaction(fields);
        transaction.transactionMadeBy = req.profile._id;
        transaction.walletId = req.wallet._id;
        let walletBalance = req.wallet.walletBalance;
        if (amount > walletBalance) { // Check if amount > walletBalance
            transaction.status = 1
            transaction.save((err, result) => { // Insert transaction fail with a status of "1" where status is  1 = "Transaction Fail" and  status is 2 ="Successful Transaction"

                if (err) {
                    return res.status(400).json(err);
                } else {
                    console.log("Insufficient Funds");
                }
            });
            return res.status(400).json({error: "Insufficient Funds"});
        } else {

            Wallet.findOne({ //    update wallet balance
                _id: req.wallet._id
            }, (err, wallet) => {
                if (err || !wallet) {
                    return res.status(400).json({error: 'wallet not found'});
                }
                wallet.walletBalance = walletBalance - amount;
                wallet.save((err, updatedWallet) => {
                    if (err) {
                        console.log('WALLET UPDATE ERROR', err);
                        return res.status(400).json({error: 'WALLET update failed'});
                    }
                });
            });
        } transaction.save((err, result) => { // save sucessful transaction with a status of 0
            if (err) {
                return res.status(400).json(err);
            }
            res.json(result);
        });
    });
}

//

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Transaction.find().sort([[sortBy, order]]).limit(limit).populate("userId").populate("walletId").exec((err, transaction) => {
        if (err) {
            return res.status(400).json({error: "Transaction not found"});
        }
        res.json(transaction);
    });
};

