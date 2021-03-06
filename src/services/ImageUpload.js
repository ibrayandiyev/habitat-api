const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/config');

aws.config.update({
  secretAccessKey: config.aws.secret,
  accessKeyId: config.aws.key,
  region: config.aws.region,
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: config.aws.s3Bucket,
    // metadata(req, file, cb) {
    //   cb(null, { fieldName: 'TESTING_METADATA' });
    // },
    key(req, file, cb) {
      cb(null, `${req.body.userId}/${file.originalname}`);
    },
  }),
});

module.exports = { s3, upload };
