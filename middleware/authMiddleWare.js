const models = require("../models");
const bcryptjs = require("bcryptjs");       //加密模块
const authMiddleWare = {};
//不需要校验登录的url
const noNeedAuthUrl = [
    '/auth/captcha',
    '/auth/login',
    '/auth/verify'
];

authMiddleWare.checkLogin = async function (req, res, next) {
    let url = req.url.split("?")[0]
    let noNeedAuth = noNeedAuthUrl.indexOf(url);
    if (noNeedAuth < 0) {
        // console.log(req.session.username+"check login!");
        //判断是否有session
        if (!req.session.user || typeof (req.session.user) === undefined) {
            let cookieUserId = req.cookies.userid;
            let cookieToken = req.cookies.token;
            //如没有session则判断是否有cookie
            if (!cookieUserId || typeof (cookieUserId) === undefined || !cookieToken || typeof (cookieToken) === undefined) {
                console.log("no login!");
                res.redirect('/auth/login');
                return;
            } else {
                let user = await models.users.findOne({
                    where: {
                        remember_token: cookieToken
                    }
                });
                if (!user) {
                    console.log("check cookie no login!");
                    res.redirect('/auth/login');
                    return;
                } else {
                    let compareResult = bcryptjs.compareSync(user.name, cookieUserId);
                    if(compareResult){
                        req.session.user = user;
                        console.log("check cookie login!");
                    }

                }
            }

        } else {
            console.log(req.session.user.name+req.session.user.id + "login!");
        }
    } else {
        console.log("no need check login!");
    }


    next();

}


module.exports = authMiddleWare;