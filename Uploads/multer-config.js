const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

const s3 = new aws.S3({
    accesskeyId:  process.env.AWS_IAM_USER_KEY_TWO,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET_TWO,
    Bucket: process.env.AWS_BUCKET_NAME
});

// const localStorage = multer.diskStorage({
//     destination: (req, res, cb) => {
//         cb(null, 'src/api/media')
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + '-' + file.originalname)
//     }
// });

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        // metadata: function (req, file, cb) {
        //     cb(null, {fieldName: 'Meta_Data'});
        //   },
        key: function(req, file, cb){
            const folderName = req.params.id;
            cb(null, folderName + '/' + file.originalname);
        }
    }),
});

module.exports = upload;