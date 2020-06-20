const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Wallet = require("../modles/wallet");
const {errorHandler} = require("../helpers/dbErrorHandler");

exports.walletById = (req, res, next, id) => {
    Wallet.findById(id).populate("userId").exec((err, wallet) => {
        if (err || !wallet) {
            return res.status(400).json({error: " Wallet not found"});
        }
        req.wallet = wallet;
        next();
    });
};

exports.read = (req, res) => {

    return res.json(req.wallet);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => { // check for all fields
        const {userId, walletBalance} = fields;

        if (!userId || !walletBalance) {
            return res.status(400).json({error: " All fields are required "});
        }
        let wallet = new Wallet(fields);
        wallet.save((err, result) => {
            if (err) {
                return res.status(400).json(err);
            }
            res.json(result);
        });
    });
}


exports.update = (req, res) => {
    Wallet.findOne({
        _id: req.wallet._id
    }, (err, wallet) => {
        if (err || !wallet) {
            return res.status(400).json({error: 'wallet not found'});
        }
        const { walletBalance } = req.body;
        wallet.walletBalance = walletBalance;
        wallet.save((err, updatedWallet) => {
            if (err) {
                console.log('WALLET UPDATE ERROR', err);
                return res.status(400).json({error: 'WALLET update failed'});
            }
            res.json(updatedWallet);
        });
    });
};


exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Wallet.find().sort([[sortBy, order]]).limit(limit).populate("userId").exec((err, wallet) => {
        if (err) {
            return res.status(400).json({error: "wallet not found"});
        }
        res.json(wallet);
    });
};
