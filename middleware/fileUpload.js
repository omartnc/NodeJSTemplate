const multer = require("multer");
const mkdirp = require('mkdirp')
const fs = require("fs");




  module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');
  
    try {
        const path_upload= "uploads/questions/";
        fs.existsSync(path_upload) || fs.mkdirSync(path_upload);
        const upload = multer({dest: path_upload,
            limits:{ fileSize: 1024*1024*5}
          });

          
      next();
    }
    catch (ex) {
      res.status(400).send('Invalid token.');
    }
  }