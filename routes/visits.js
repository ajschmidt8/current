const router = require('express').Router();
const controller = require('../controllers/visits');

router.get('/visit', controller.get);
router.post('/visit', controller.post);

module.exports = router;
