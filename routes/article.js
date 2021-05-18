const express = require('express');
const router = express.Router();
const models = require('../models');
const funcs = require('../utils/funcs');
const {Op} = models.Sequelize;
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('article/index')
});

//后台展示列表
router.get('/mList', async (req, res) => {
    //搜索查询
    let dynamicParams = [];
    let searchParams = {};
    //console.log(req.query)
    if (req.query.searchParams) {
        searchParams = JSON.parse(req.query.searchParams);
    }

    if (searchParams['title']) {
        dynamicParams.push({
            title: {[Op.like]: `%${searchParams['title'].trim()}%`},
        });
    }

    if (searchParams['section']) {
        dynamicParams.push({
            section: searchParams['section'],
        });
    }

    let {page, limit} = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    let offset = (page - 1) * limit;
    let {rows: article, count: rowCount} = await models.article.findAndCountAll(
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
    res.json({code: 0, count: rowCount, msg: "ok", data: article});

});
//添加文章
router.get('/add', (req, res) => {
    res.render('article/add')
});


//保存文章
router.post('/add', (req, res) => {

    if (req.body.title !== '' && req.body.content !== '') {
        models.article.create(req.body).then((data) => {
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


//图片上传
router.use(bodyParser.urlencoded({extended: false}));
router.use(multer({dest: './public/upload'}).array('mypic'));//mypic 是前端控件的名字，要一致
router.post('/upload', async (req, res) => {
        let filename, filePath, fileNewPath, fileType
        let resJson = [];
        try {
            for (let i = 0; i < req.files.length; i++) {
                filePath = req.files[i].path;
                // console.log(req.files);
                fileType = req.files[i].originalname.split(".").pop();
                fileNewPath = filePath + "." + fileType;
                filename = req.files[i].filename + "." + fileType;
                resJson[i] = {
                    isOK: true,
                    imgPath: "../upload/"+filename, //文件存储的路径
                    imgName: filename
                };
                fs.rename(filePath, fileNewPath, (err) => {
                    if (err) {
                        console.log('err:' + err);
                    } else {
                        console.log('修改文件名成功');
                    }
                });
            }
        } catch (e) {
            res.json({error: 1});
        }
        console.log(resJson);
        res.json({
            error: 0,
            data: resJson
        });
    }
);

//删除数据
router.post('/delete', (req, res) => {
    let ids = req.body.id.split(',');
    models.article.destroy({
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
router.get('/edit',(req,res)=>{
    res.render('article/edit');
});


//编辑保存
router.post('/edit', (req, res) => {

    models.article.update(req.body, {
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
});


module.exports = router;