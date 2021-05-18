const express = require('express');
const router = express.Router();
const models = require('../models');
const funcs = require('../utils/funcs');
const {Op} = models.Sequelize;
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('member/index')
});

//添加
router.get('/add', (req, res) => {
    res.render('member/add')
});

//保存
router.post('/add', (req, res) => {

    if (req.body.name !== '' && req.body.sex !== '') {
        models.member.create(req.body).then((data) => {
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
router.get('/memberList', async (req, res) => {
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
    if (searchParams['status']) {
        dynamicParams.push({
            status: searchParams['status'],
        });
    }


    let {page, limit} = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows: member, count: rowCount} = await models.member.findAndCountAll(
        {
            where: {
                [Op.and]: [
                    dynamicParams,
                    {[Op.or]: {confirmed: 1}}
                ]
            },
            order: [
                ['id', 'DESC']
            ],
            limit: limit,
            offset: offset,
        });
    res.json({code: 0, count: rowCount, msg: "ok", data: member});

});


//修改保存
router.post('/confirm', (req, res) => {
    models.member.update(req.body, {
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
    models.member.destroy({
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
    res.render('member/edit');
});


//编辑进度保存
router.post('/edit', (req, res) => {
    console.log(req.body)
    models.member.update(req.body,
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


//批量导入
router.get('/import', (req, res) => {

    res.render('member/import',);
})

router.use(bodyParser.urlencoded({extended: false}));
router.use(multer({dest: './public/upload'}).array('file'));
router.post('/import', async (req, res) => {
    req.session.tempTbl = '';
    let filePath = req.files[0].path;
    let csvTable = [];
    //获取csv数据
    await funcs.readCvsToJson(filePath).then((data) => {
        //获取列数为7/8列的数据
        csvTable = funcs.filteTable(data, [7, 8]);
    }).catch((err) => {
        res.json({code: 1, msg: "导入出错！"});
    });
    let tempTbl = [];
    let i = 0
    csvTable.forEach((row) => {
        if (i >= 1) {
            tempTbl.push({
                name: row[0],
                sex: row[1],
                tel: row[2],
                id_number: row[3],
                position: row[4],
                credits: row[5],
                type: row[6],
                status: row[7]
            });
        }
        i++;
    });
    req.session.tempTbl = tempTbl;
    fs.unlinkSync(filePath);
    res.json({code: 0, msg: "ok", data: tempTbl});
})
//批量上传保存
router.post('/importSave', async (req, res) => {
    if (req.session.tempTbl === '') {
        res.json({code: 1, msg: "保存数据为空！"});
    }
    await models.member.bulkCreate(req.session.tempTbl, {
        updateOnDuplicate: [
            'name',
            'sex',
            'tel',
            'id_number',
            'position',
            'credits',
            'type',
            'status',
        ]
    }).then((data) => {
        req.session.tempTbl = '';
        res.json({code: 0, msg: "0"});
    }).catch((err) => {
        res.json({code: 1, msg: "保存数据出错！"});
    });
});


//导出全部数据
router.post('/exportAllData', (req, res) => {
    models.member.findAll({
        order: [
            ['id', 'ASC']
        ],
    }).then((data) => {
        res.json({code: 0, msg: "ok", data: data});
    }).catch((e) => {
        res.json({code: 1, msg: "error"});
    })
});

//党员注册审批展示页面
router.get('/signConfirm', (req, res) => {
    res.render('member/signConfirm')
});

//党员注册审批展示列表
router.get('/memberConfirmList', async (req, res) => {
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
    if (searchParams['status']) {
        dynamicParams.push({
            status: searchParams['status'],
        });
    }


    let {page, limit} = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows: member, count: rowCount} = await models.member.findAndCountAll(
        {
            where: {
                [Op.and]: [
                    dynamicParams,
                    {[Op.or]: [{confirmed: 0}, {confirmed: 2}, {confirmed: null}, {confirmed: ''}]}
                ]
            },
            order: [
                ['id', 'DESC']
            ],
            limit: limit,
            offset: offset,
        });
    res.json({code: 0, count: rowCount, msg: "ok", data: member});

});

//审核是否通过
router.post('/confirm', (req, res) => {
    models.member.update(req.body, {
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