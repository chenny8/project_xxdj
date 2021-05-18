const express = require('express');
const router = express.Router();
const models = require('../../models');
const {Op} = models.Sequelize;
const funcs = require('../../utils/funcs');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');


/* GET users listing. */
router.get('/', async function (req, res, next) {
    res.render('feiyonghuizong/index');
});


//列表数据
router.get('/dataList', async (req, res) => {
    //搜索查询
    let dynamicParams = [];
    let searchParams = {};
    console.log(req.query)
    if(req.query.searchParams){
        searchParams = JSON.parse(req.query.searchParams);
    }

    if (searchParams['channel_no']) {
        dynamicParams.push({
            channel_no: {[Op.like]: `%${searchParams['channel_no']}%`},
        });
    }
    if (searchParams['unit']) {
        dynamicParams.push({
            unit: {[Op.like]: `%${searchParams['unit']}%`},
        });
    }
    if (searchParams['cash_type']) {
        dynamicParams.push({
            cash_type: {[Op.like]: `%${searchParams['cash_type']}%`},
        });
    }
    if (searchParams['is_cmiot']) {
        dynamicParams.push({
            is_cmiot:searchParams['is_cmiot'],
        });
    }
    if (searchParams['begin_bussiness_time']) {
        dynamicParams.push({
            bussiness_time: {[Op.gte]: searchParams['begin_bussiness_time']},
        });
    }
    if (searchParams['end_bussiness_time']) {
        dynamicParams.push({
            bussiness_time: {[Op.lte]: searchParams['end_bussiness_time']},
        });
    }

    let {page, limit} = req.query;
    limit =  parseInt(limit) || 10;
    page =  parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows:feiyonghuizong,count:rowCount} = await models.feiyonghuizong.findAndCountAll(
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
    res.json({code: 0, count: rowCount, msg: "ok", data: feiyonghuizong});
});

//新增记录
router.get('/add', (req, res) => {
    res.render('feiyonghuizong/add');
});
//新增保存
router.post('/add', (req, res) => {

    if (req.body.channel_no !== '' && req.body.bussiness_time !== '' && req.body.income !== '') {
        models.feiyonghuizong.create(req.body).then((data) => {
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

//编辑保存
router.post('/edit/:id', (req, res) => {
    let editId = req.params.id;
    models.feiyonghuizong.update(req.body, {
        where: {
            id: editId
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

//批量导入
router.get('/import', (req, res) => {

    res.render('feiyonghuizong/import',);
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
                channel_no: row[0],
                unit: row[1],
                bussiness_type: row[2],
                cash_type: row[3],
                is_cmiot: row[4],
                income: row[5],
                bussiness_time: row[6],
                memo: row[7]
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
    await models.feiyonghuizong.bulkCreate(req.session.tempTbl, {
        updateOnDuplicate: [
            'channel_no',
            'unit',
            'bussiness_type',
            'cash_type',
            'is_cmiot',
            'income',
            'bussiness_time',
            'memo',
        ]
    }).then((data) => {
        req.session.tempTbl = '';
        res.json({code: 0, msg: "0"});
    }).catch((err) => {
        res.json({code: 1, msg: "保存数据出错！"});
    });
});


//删除数据
router.post('/delete', (req, res) => {
    let ids = req.body.id.split(',');
    models.feiyonghuizong.destroy({
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


module.exports = router;