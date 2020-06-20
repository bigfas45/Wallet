const express = require("express");
const router = express.Router();

const {
  userById,
  read,
  update,
  list,
  remove,
  passwordReset,

} = require("../controllers/user");
const { requireSignin, isAdmin, isAuth } = require("../controllers/auth");


router.get("/user/:userId",  read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.put("/user/update/:userId", update);
router.put("/user/passwordreset/:userId", passwordReset);


router.get("/users/:userId", requireSignin, isAuth, list);


router.delete("/user/:userIdD/:userId", requireSignin, isAuth, isAdmin, remove);

router.param("userId", userById);

module.exports = router;
