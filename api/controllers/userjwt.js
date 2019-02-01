const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken');

const registerController = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      res.json({
        error: err
      })
    }

    let user = new User({
      username: req.body.username,
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age,
      birthday: req.body.birthday,
    })
    
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User Created Successfully',
          status: 'Success',
          user: result
        })
      })
      .catch(err => {
        res.status(500).json({
          message: 'Username is already taken',
          error: err
        })
      })
  })
}

const loginController = (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  User.findOne({username})
    .then(user => {
      if(user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if(err) {
            res.status(500).json({
              message: 'Error Occured'
            })
          }
          if (result) {
            //If all credentials are correct do this
            let token = jwt.sign({ id: result._id, username: result.username }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
            res.status(200).json({
                sucess: true,
                message: "Login Successful",
                err: null,
                token
            });
          } else {
            res.status(401).json({
              sucess: false,
              token: null,
              err: 'Login Failed. Username or Password Doesn\'t Match',
            })
          }

        })
      } else {
        res.status(500).json({
          message: 'User not found',
          status: 'Failed'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        err
      })
    })
}

const getAllUser = (req, res, next) => {
  User.find()
    .then(users => {
      res.json({
        users
      })
    })
    .catch(err => {
      res.json({
        error
      })
    })
}

const getSingleUser = (req, res, next) => {
  let id = req.params.id

  User.findById(id)
    .then(user => {
      if(user) {
      res.status(200).json({
        user
      })
    } else {
      res.status(500).json({
        message: 'Id not found'
      })
    }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Error Occured',
        error: err
      })
    })
}

const deleteUser = (req, res, next) => {
  let id = req.params.id

  User.findByIdAndRemove(id)
    .then(result => {
      if(result) {
       res.status(200).json({
        message: 'User Deleted',
        status: 'Success',
        result
      })
    } else {
      res.status(500).json({
        message: 'No User Found',
        status: 'Failed'
      })
    }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Error Occured',
        status: 'Failed',
        error: err
      })
    })
}

const editUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      res.status(500).json({
        error: err
      })
    }

  let id = req.params.id

  let updateUser = {
    username: req.body.username,
    password: hash,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    birthday: req.body.birthday
  }

  User.findByIdAndUpdate(id, {$set: updateUser})
    .then(user => {
      User.findById(user._id)
      .then(newUser => {
        res.status(200).json({
          message: 'Updated Successfully',
          status: 'Success',
          newUser
        })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Error Occured',
        status: 'Failed',
        error: err
      })
    })
  })
}

module.exports = {
  registerController,
  getAllUser,
  loginController,
  getSingleUser,
  deleteUser,
  editUser
}