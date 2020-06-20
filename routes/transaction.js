const express = require("express");
const router = express.Router();

const {
    create,
    list
    
   
} = require("../controllers/transaction");
const {
  
    walletById,
  
} = require("../controllers/wallet");
const {requireSignin, isAuth, isAdmin} = require("../controllers/auth");
const {userById} = require("../controllers/user");

router.post("/transaction/create/:walletId/:userId", requireSignin, isAuth, create);
router.get("/transaction/history/:userId", requireSignin, isAuth, isAdmin,  list);


router.param("walletId", walletById);
router.param("userId", userById);

module.exports = router;
