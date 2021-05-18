const express = require('express');
const router = express.Router();
const models = require('../models')
const bcryptjs = require("bcryptjs");       //加密模块

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/userSetting', (req, res) => {

    res.render('user-setting', {user: req.session.user});
});
router.post('/userSetting', async (req, res) => {
    try {

        await models.users.update(
            req.body,
            {
                where: {id: req.session.user.id},
            }
        );
        let user = await models.users.findOne({
            where: {id: req.session.user.id},
        });
        req.session.user = user;
        res.json({code: 0, msg: "ok"});
    } catch {
        res.json({code: 1, msg: "failed"});
    }

});


router.get('/updatePassword', (req, res) => {

    res.render('user-password');
});
router.post('/updatePassword', (req, res) => {
    let {old_password, new_password} = req.body;
    let compareResult = bcryptjs.compareSync(old_password, req.session.user.password);
    if (!compareResult) {
        res.json({code: 2, msg: "旧密码错误！"})
    }
    ;
    new_password = bcryptjs.hashSync(new_password, 10);
    models.users.update({password: new_password}, {
        where: {
            id: req.session.user.id,
        }
    }).then(res => {
        req.session.user.password = new_password;
        res.json({code: 0, msg: "ok"});
    }).catch(e => {
        res.json({code: 1, msg: "updateFailed!"});
    });


});


module.exports = router;
