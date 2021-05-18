const express = require('express');
const router = express.Router();
const models = require('../../models')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let model = await models.feiyonghuizong.findAll();

  res.render('index',{models:model,title:"aaa"});
});

module.exports = router;