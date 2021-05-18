const express = require('express');
const router = express.Router();
const models = require('../../models');
const {Op} = models.Sequelize;
const funcs = require('../../utils/funcs');



/* GET users listing. */
router.get('/', async function (req, res, next) {
    res.render('branch/index');
});


//列表数据
router.get('/dataList', async (req, res) => {
    //搜索查询
    let dynamicParams = [];
    let searchParams = {};
    //console.log(req.query)
    if(req.query.searchParams){
        searchParams = JSON.parse(req.query.searchParams);
    }

    if (searchParams['branch']) {
        dynamicParams.push({
            branch: {[Op.like]: `%${searchParams['branch'].trim()}%`},
        });
    }
    if (searchParams['unit']) {
        dynamicParams.push({
            unit: {[Op.like]: `%${searchParams['unit'].trim()}%`},
        });
    }
    if (searchParams['is_zy']) {
        dynamicParams.push({
            is_zy: searchParams['is_zy'],
        });
    }

    let {page, limit} = req.query;
    limit =  parseInt(limit) || 10;
    page =  parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows:branch,count:rowCount} = await models.branch.findAndCountAll(
        {
            where: {
                [Op.and]: dynamicParams,
            },
            order: [
                ['id', 'ASC']
            ],
            limit: limit,
            offset: offset,
        });
     res.json({code: 0, count: rowCount, msg: "ok", data: branch});
});

//新增记录
router.get('/add', (req, res) => {
    res.render('branch/add');
});
//新增保存
router.post('/add', (req, res) => {

    if (req.body.branch !== '' && req.body.unit !== '' ) {
        models.branch.create(req.body).then((data) => {
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
    if(!req.body.createdAt) {req.body.createdAt=new Date()}
    if(!req.body.updatedAt) {req.body.updatedAt=new Date()}
    console.log(req.body)
    models.branch.update(req.body, {
        where: {
            id: editId
        }
    }).then((data) => {
        res.json(
            {code: 0, msg: 'ok！'}
        );
    }).catch((err) => {
        res.json(
            {code: 1, msg: 'failed！'+err}
        );
    });
});



//删除数据
router.post('/delete', (req, res) => {

    let ids = req.body.id.split(',');
    models.branch.destroy({
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