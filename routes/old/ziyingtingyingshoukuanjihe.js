const express = require('express');
const router = express.Router();
const models = require('../../models');
const {Op} = models.Sequelize;
const funcs = require('../../utils/funcs');

router.get('/', (req, res) => {
    res.render('./ziyingtingyingshoukuanjihe/index');
});

//报表日期列表
router.get('/dateList', async (req, res) => {
    //搜索查询
    let dynamicParams = [];
    let searchParams = {};
    console.log(req.query)
    if (req.query.searchParams) {
        searchParams = JSON.parse(req.query.searchParams);
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
    console.log(dynamicParams);
    let {page, limit} = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows: result, count: rowCount} = await models.ziyingting_yskjh.findAndCountAll(
        {
            attributes: ['bussiness_time'],
            group: ['bussiness_time'],
            where: {
                [Op.and]: dynamicParams,
            },
            order: [
                ['bussiness_time', 'DESC']
            ],
            limit: limit,
            offset: offset,
        });

    res.json({code: 0, count: rowCount.length, msg: "ok", data: result});
});
//查看报表数据
router.get('/reportData',(req,res)=>{
    let reportDate = req.query.bussiness_time;
    if(!reportDate){
        res.json({code:1,msg:"日期参数为空！"});
    }
    models.ziyingting_yskjh.findAll({
        where:{
            bussiness_time:reportDate,
        },
        order: [
            ['branch', 'ASC']
        ],
    }).then((data)=>{
        res.json({code:0,msg:"ok",data:data});
    }).catch((e)=>{
        res.json({code:1,msg:"error"});
    })
});

//导出全部数据
router.post('/exportAllDetailData',(req,res)=>{
    models.ziyingting_yskjh.findAll({
        order: [
            ['bussiness_time', 'ASC'],
            ['branch', 'ASC']
        ],
    }).then((data)=>{
        res.json({code:0,msg:"ok",data:data});
    }).catch((e)=>{
        res.json({code:1,msg:"error"});
    })
});

//生成数据页面
router.get('/generate', (req, res) => {
    let generateDate = req.query.generateDate;
    res.render('./ziyingtingyingshoukuanjihe/generate', {generateDate: generateDate});
});
//获取生成数据
router.get('/data/:generateDate', async (req, res) => {
    let queryDate = req.params.generateDate;
    if(!queryDate){
        res.json({code:1,msg:"日期参数为空！"});
    }
    let data = await funcs.getZiYingTingYingShouKuanJiheTable(queryDate);
    res.json({code: 0, msg: "ok", data: data});

});
//保存
router.post('/save', async (req, res) => {
    let {bussiness_date, data, override} = req.body;
    // console.log(JSON.parse(data));
    //判断是否需要覆盖
    if (override === 'false') {
        let result = await models.ziyingting_yskjh.findOne({
            where: {
                bussiness_time: bussiness_date,
            }
        });
        if (!result) {
            //执行插入数据
            await models.ziyingting_yskjh.bulkCreate(JSON.parse(data)).then(d => {
                res.json({code: 0, msg: 'ok'});
            }).catch(e => {
                res.json({code: 1, msg: e});
            });
        } else {
            res.json({code: 1, msg: '已存在记录！'})
        }
    } else {
        //先删除原有数据
        await models.ziyingting_yskjh.destroy({
            where: {
                bussiness_time: bussiness_date,
            }
        })

        //执行插入数据
        await models.ziyingting_yskjh.bulkCreate(JSON.parse(data)).then(d => {
            res.json({code: 0, msg: 'ok'});
        }).catch(e => {
            res.json({code: 1, msg: e});
        });


    }


});


module.exports = router;