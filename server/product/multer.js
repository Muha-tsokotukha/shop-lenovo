const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/products');
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        let fileExt = filename.split(".");
        fileExt = fileExt[fileExt.length - 1];
        const uniqueSuffix = Date.now() + '.' + fileExt;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const upload = multer({storage});

module.exports = {
    upload
}