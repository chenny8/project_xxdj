const express = require('express');
const router = express.Router();
const models = require('../models');
const funcs = require('../utils/funcs');
const {Op} = models.Sequelize;


router.get('/', (req, res) => {
    res.render('interaction/index')
});

//后台展示列表
router.get('/interactionList', async (req, res) => {
    //搜索查询
    let dynamicParams = [];
    let searchParams = {};
    //console.log(req.query)
    if (req.query.searchParams) {
        searchParams = JSON.parse(req.query.searchParams);
    }

    if (searchParams['comment']) {
        dynamicParams.push({
            comment: {[Op.like]: `%${searchParams['comment'].trim()}%`},
        });
    }

    if (searchParams['category']) {
        dynamicParams.push({
            category: searchParams['category'],
        });
    }
    if (searchParams['status']) {
        dynamicParams.push({
            status: searchParams['status'],
        });
    }
    if (searchParams['confirmed']) {
        dynamicParams.push({
            confirmed: searchParams['confirmed'],
        });
    }

    let {page, limit} = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows: interaction, count: rowCount} = await models.interaction.findAndCountAll(
        {
            where: {
                [Op.and]: dynamicParams,
            },
            order: [
                ['id', 'DESC']
            ],
            limit: limit,
            offset: offset,
        });
    res.json({code: 0, count: rowCount, msg: "ok", data: interaction});

});
//审核是否通过
router.post('/confirm',(req,res)=>{
    models.interaction.update(req.body, {
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


//删除数据
router.post('/delete', (req, res) => {
    let ids = req.body.id.split(',');
    models.interaction.destroy({
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

//编辑进度页面
router.get('/edit', (req, res) => {
    res.render('interaction/edit');
});

//编辑进度保存
router.post('/edit', (req,res)=>{
    console.log(req.body)
    models.interaction.update({
        progress:req.body.progress
    }, {
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

module.exports = router;