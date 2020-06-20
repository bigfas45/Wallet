const express = require("express");
const router = express.Router();

const {
    create,
    walletById,
    read,
    list,
    refById,
    update
} = require("../controllers/wallet");
const {requireSignin, isAuth, isAdmin} = require("../controllers/auth");
const {userById} = require("../controllers/user");

router.get("/wallet/:walletId/:userId3", requireSignin, read);
router.get("/wallets/:userId", requireSignin, isAuth, isAdmin,  list);

router.post("/wallet/create/:userId", requireSignin, isAuth, create);

router.put("/wallet/:walletId/:userId", requireSignin, isAuth, update);


// router.delete("/wallet/:walletId/:userId", requireSignin , isAuth,isAdmin,remove);


router.param("walletId", walletById);
router.param("userId", userById);

module.exports = router;
