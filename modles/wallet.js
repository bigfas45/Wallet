const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const walletSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
        unique: true
      },
    
      walletBalance: {
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






module.exports = mongoose.model("Wallet", walletSchema);