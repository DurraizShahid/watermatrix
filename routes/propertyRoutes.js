const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { addProperty, getProperties } = require('../controllers/propertyController');

router.post('/addproperty', upload.single('Image'), addProperty);
router.get('/properties', getProperties);

module.exports = router;
