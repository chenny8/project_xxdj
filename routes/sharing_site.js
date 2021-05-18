const express = require('express');
const router = express.Router();
const models = require('../models');
const funcs = require('../utils/funcs');
const {Op} = models.Sequelize;


router.get('/', (req, res) => {
    res.render('sharing_site/index')
});

//添加
router.get('/add', (req, res) => {
    res.render('sharing_site/add')
});




//保存
router.post('/add', (req, res) => {

    if (req.body.name !== '' && req.body.sex !== '') {
        models.sharing_site.create(req.body).then((data) => {
            res.json(
                {code: 0, msg: 'ok'}
            );
        }).catch((err) => {
            res.json(
                {code: 1, msg: 'failed'}
            );
        });
    } else {
        res.json(
            {code: 1, msg: '必填数据为空！'}
        );
    }
});

//后台展示列表
router.get('/sharing_siteList', async (req, res) => {
    //搜索查询
    let dynamicParams = [];
    let searchParams = {};
    if (req.query.searchParams) {
        searchParams = JSON.parse(req.query.searchParams);
    }

    if (searchParams['name']) {
        dynamicParams.push({
            name: {[Op.like]: `%${searchParams['name'].trim()}%`},
        });
    }

    if (searchParams['type']) {
        dynamicParams.push({
            type: searchParams['type'],
        });
    }


    let {page, limit} = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows: sharing_site, count: rowCount} = await models.sharing_site.findAndCountAll(
        {
            where: {
                [Op.and]:  dynamicParams,
            },
            order: [
                ['id', 'DESC']
            ],
            limit: limit,
            offset: offset,
        });
    res.json({code: 0, count: rowCount, msg: "ok", data: sharing_site});

});





//删除数据
router.post('/delete', (req, res) => {
    let ids = req.body.id.split(',');
    models.sharing_site.destroy({
        where: {
            id: {[Op.in]: ids},
        }
    }).then((data) => {
        res.json(
            {code: 0, msg: 'ok！'}
        );
    }).catch((err) => {
        res.json(
            {code: 1, msg: 'failed！'}
        );
    });
});

//编辑页面
router.get('/edit', (req, res) => {
    res.render('sharing_site/edit');
});


//编辑保存
router.post('/edit', (req, res) => {
    console.log(req.body)
    models.sharing_site.update(req.body, {
        where: {
            id: req.body.id
        }
    }).then((data) => {
        res.json(
            {code: 0, msg: 'ok！1'}
        );
    }).catch((err) => {
        res.json(
            {code: 1, msg: 'failed！'}
        );
    });
})

//改变状态
router.post('/status', (req, res) => {
    models.sharing_site.update(req.body, {
        where: {
            id: req.body.id
        }
    }).then((data) => {
        res.json(
            {code: 0, msg: 'ok！'}
        );
    }).catch((err) => {
        res.json(
            {code: 1, msg: 'failed！'}
        );
    });
})





module.exports = router;