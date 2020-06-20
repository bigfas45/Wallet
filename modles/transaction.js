const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const transactionSchema = new mongoose.Schema({
    transactionMadeBy: {
        type: ObjectId,
        ref: 'User',
        required: true,
      },
    
      walletId: {
        type: ObjectId,
        ref: 'Wallet',
        required: true,
      },
      amount: {
        type: Number,
        trim: true,
        required: true,
      },

      status: {
        type: Number,
        default: 0
      },
},
 {timestamps: true}
);






module.exports = mongoose.model("Transaction", transactionSchema);