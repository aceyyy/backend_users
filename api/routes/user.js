const express = require('express')
const router = express.Router()
const multer = require('multer');
const exjwt = require('express-jwt');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname); 
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage, 
  limits: {
  fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

const jwtMW = exjwt({
  secret: 'keyboard cat 4 ever'
});

const userController = require('../controllers/user')

router.get('/', jwtMW, userController.getAllUser, (res) => {
  res.send('You are authenticated'); //Sending some response when authenticated
});

router.post('/login', userController.loginController)

router.post('/register', upload.single('userImage'), userController.registerController)

router.get('/:id', userController.getSingleUser)

router.put('/:id', userController.editUser)

router.delete('/:id', userController.deleteUser)


module.exports = router