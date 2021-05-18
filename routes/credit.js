const express = require('express');
const router = express.Router();
const models = require('../models');
const funcs = require('../utils/funcs');
const {Op,QueryTypes} = models.Sequelize;


router.get('/', (req, res) => {
    res.render('credit/rule')
});


//展示积分规则列表
router.get('/creditList', async (req, res) => {
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



    let {page, limit} = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows: credits_rule, count: rowCount} = await models.credits_rule.findAndCountAll(
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
    res.json({code: 0, count: rowCount, msg: "ok", data: credits_rule});

});





//编辑积分保存
router.post('/changeCredit', (req, res) => {
    console.log(req.body)
    models.credits_rule.update(req.body, {
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


//积分记录页面
router.get('/record', (req, res) => {
    res.render('credit/record')
});

//展示积分记录列表
router.get('/recordList', async (req, res) => {
    //搜索查询

    let searchParams = {};
    if (req.query.searchParams) {
        searchParams = JSON.parse(req.query.searchParams);
    }
    if(searchParams['name']){
        searchParams['name'] = "%"+searchParams['name']+"%";
    }else{
        searchParams['name']="%%";
    }

    let {page, limit} = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    let offset = (page - 1) * limit;
    // let {rows: credits_rule, count: rowCount} = await models.credits_rule.findAndCountAll(
    //     {
    //         where: {
    //             [Op.and]:  dynamicParams,
    //         },
    //         order: [
    //             ['id', 'DESC']
    //         ],
    //         limit: limit,
    //         offset: offset,
    //     });
    // res.json({code: 0, count: rowCount, msg: "ok", data: credits_rule});

    let  record =await models.sequelize.query(
        'select r.*,a.name as rule_name,m.name as member_name ' +
        'from credits_record r ' +
        'LEFT JOIN credits_rule a on a.id = r.credits_rule_id ' +
        'LEFT JOIN member m on m.id = r.member_id ' +
        'where r.name like :name '+
        'limit :page , :limit',

        {
            replacements: { name: searchParams['name']|| '',page:offset,limit:limit},
            type: QueryTypes.SELECT
        }
    );
    res.json({code: 0, count: record.length, msg: "ok", data: record});


});

//添加积分记录页面
router.get('/addRecord', (req, res) => {
    res.render('credit/addRecord')
});

//保存
router.post('/addRecord', (req, res) => {

    if (req.body.name !== '' && req.body.credits !== '') {
        models.credits_record.create(req.body).then((data) => {
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

//编辑积分记录页面
router.get('/editRecord', (req, res) => {
    res.render('credit/editRecord');
});


//编辑进度保存
router.post('/editRecord', (req, res) => {

    models.credits_record.update(req.body,
        {
            where: {
                id: req.body.id
            }
        }
    ).then((data) => {
        res.json(
            {code: 0, msg: 'ok！'}
        );
    }).catch((err) => {
        res.json(
            {code: 1, msg: 'failed！'}
        );
    });
})

//删除积分数据
router.post('/deleteRecord', (req, res) => {
    let ids = req.body.id.split(',');
    models.credits_record.destroy({
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

//导出全部数据
router.post('/exportAllData', (req, res) => {
    models.credits_record.findAll({
        order: [
            ['id', 'ASC']
        ],
    }).then((data) => {
        res.json({code: 0, msg: "ok", data: data});
    }).catch((e) => {
        res.json({code: 1, msg: "error"});
    })
});

module.exports = router;