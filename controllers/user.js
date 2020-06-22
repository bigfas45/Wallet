const User = require("../modles/users");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    req.profile = user;
    next();
  });
};





exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.slat = undefined;
  return res.json(req.profile);
};




exports.update = (req, res) => {
  console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { firstname,lastname,email, telephone,  role, password } = req.body;

  User.findOne({ _id: req.profile._id }, (err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: 'User not found'
          });
      }
      if (!firstname) {
          return res.status(400).json({
              error: 'Name is required'
          });
      } else {
          user.firstname = firstname;
      }

      if (!lastname) {
        return res.status(400).json({
            error: 'lastname is required'
        });
    } else {
        user.lastname = lastname;
    }
    if (!email) {
      return res.status(400).json({
          error: 'email is required'
      });
  } else {
      user.email = email;
  }
  if (!telephone) {
    return res.status(400).json({
        error: 'telephone is required'
    });
} else {
    user.telephone = telephone;
}


if (!role) {
  return res.status(400).json({
      error: 'role is required'
  });
} else {
  user.role = role;
}






      if (password) {
          if (password.length < 6) {
              return res.status(400).json({
                  error: 'Password should be min 6 characters long'
              });
          } else {
              user.password = password;
          }
      }

      user.save((err, updatedUser) => {
          if (err) {
              console.log('USER UPDATE ERROR', err);
              return res.status(400).json({
                  error: 'User update failed'
              });
          }
          updatedUser.hashed_password = undefined;
          updatedUser.salt = undefined;
          res.json(updatedUser);
      });
  });
};


exports.passwordReset = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { password} = req.body;

  User.findOne({ _id: req.profile._id }, (err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: 'User not found'
          });
      }
     

      if (password) {
          if (password.length < 6) {
              return res.status(400).json({
                  error: 'Password should be min 6 characters long'
              });
          } else {
              user.password = password;
          }
      }

      user.save((err, updatedUser) => {
          if (err) {
              console.log('USER UPDATE ERROR', err);
              return res.status(400).json({
                  error: 'User update failed'
              });
          }
          updatedUser.hashed_password = undefined;
          updatedUser.salt = undefined;
          res.json(updatedUser);
      });
  });
};




exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  User.find()
    .select("-hashed_password")
    .select("-salt")
    .sort([[sortBy, order]])
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({ error: "Users not found" });
      }
      res.json(users);
    });
};






exports.remove = (req, res) => {
  const user = req.user;
  user.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message: "user deleted"
    });
  });
};
