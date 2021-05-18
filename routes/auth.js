const express = require('express');
const router = express.Router();
const models = require('../models');
const funcs = require('../utils/funcs');

//加密模块
const bcryptjs = require("bcryptjs");

/* GET users listing. */
router.get('/login', async function (req, res, next) {
    res.render('./auth/login');
});

router.get('/captcha', (req, res) => {
    let captcha = funcs.getCaptcha();
    req.session.captcha = captcha.text.toLowerCase();
    res.type('svg');
    res.status(200).send(captcha.data);
});


router.post('/verify', async function (req, res, next) {
    let {name, password, captcha,rememberMe} = req.body;
    let sessionCaptcha = req.session.captcha;
    req.session.captcha = null;
    let user = await models.users.findOne({
        where: {
            name: name,
        }
    });
    if (!user) {
        res.type('svg');
        res.json({code: 1, msg: 'failed'});
        return;
    }
    //校验密码
    let compareResult = bcryptjs.compareSync(password, user.password);
    if (captcha.toLowerCase() !== sessionCaptcha) {
        res.json({code: 2, msg: '验证码错误'});
    } else if (compareResult) {
        if(rememberMe === 'checked'){
            await funcs.setCookies(name,req,res);
        }else{
            res.clearCookie('userid');
            res.clearCookie('token');
        }
        //保存登录用户对象到session
        req.session.user = user;
        res.json({code: 0, msg: 'ok'});
    } else {
        res.json({code: 1, msg: 'failed'});
    }


});

router.get('/logout', async function (req, res, next) {
    req.session.user = null;
    res.redirect("./auth/login");
});


module.exports = router;