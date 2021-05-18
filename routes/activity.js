const express = require('express');
const router = express.Router();
const models = require('../models');
const funcs = require('../utils/funcs');
const {Op,QueryTypes } = models.Sequelize;
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('activity/index')
});

//添加
router.get('/add', (req, res) => {
    res.render('activity/add')
});



//选择地图页面
router.get('/selectMap', (req, res) => {
    res.render('activity/selectMap');
});



//保存
router.post('/add', (req, res) => {

    if (req.body.name !== '' && req.body.sex !== '') {
        models.activity.create(req.body).then((data) => {
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
router.get('/activityList', async (req, res) => {
    //搜索查询
    let dynamicParams = [];
    let searchParams = {};
    //console.log(req.query)
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
    let {rows: activity, count: rowCount} = await models.activity.findAndCountAll(
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
    res.json({code: 0, count: rowCount, msg: "ok", data: activity});

});





//删除数据
router.post('/delete', (req, res) => {
    let ids = req.body.id.split(',');
    models.activity.destroy({
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
    res.render('activity/edit');
});


//编辑保存
router.post('/edit', (req, res) => {
    console.log(req.body)
    models.activity.update(req.body, {
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


//查看活动
router.get('/activityRecord', (req, res) => {
    res.render('activity/activityRecord');
});

//活动记录展示列表
router.get('/activityRecordList', async (req, res) => {
    let  activityRecord =await models.sequelize.query(
        'select r.*,a.name as activity_name,m.name as member_name ' +
        'from activity_record r ' +
        'LEFT JOIN activity a on a.id = r.activity_id ' +
        'LEFT JOIN member m on m.id = r.member_id ' +
        'where a.id =:id',
        {
            replacements: { id: req.query.id},
            type: QueryTypes.SELECT
        }
    );
    res.json({code: 0, count: activityRecord.length, msg: "ok", data: activityRecord});

});








module.exports = router;