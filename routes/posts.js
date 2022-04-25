const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const errorHandle = require('../errorHandle');

// const headers = {
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
//     'Content-Type': 'application/json'
// };

router.get('/', async function(req,res){
    // const name = req.query.name;
    const posts = await Post.find();
    // res.writeHead(200, headers);
    res.send({ // 會自動將物件轉為 JSON 字串
        "status":"success",
        posts
    });
})

router.post('/',async function(req,res){
    try{
        const data = req.body;
        if(data.content !== undefined){
            const newPost = await Post.create(
                {
                    name: data.name,
                    content: data.content
                }
            );
            res.send({
                "status":"success",
                "data": newPost
            });
        } else {
            errorHandle(res);
        }
    }
    catch (error){
        errorHandle(res);
    }
})

router.delete('/',async function(req,res){
    try{
        await Post.deleteMany({});
        res.send({
            "status":"success",
            "message":"刪除成功"
        })
    } catch {
        errorHandle(res);
    }
})

router.delete('/:id',async function(req,res){
    try{
        const id = req.params.id;
        if( id !== undefined){
            await Post.findByIdAndDelete(id);
            await res.send({
                "status": "success",
                "data": null,
            })
        } else {
            errorHandle(res);
        }
    } catch(error){
        errorHandle(res);
    }
})

router.patch('/:id', async function(req,res){
    try{
        const id = req.params.id;
        const data = req.body;
        const posts = await Post.find();
        const index = posts.findIndex(element => element.id === id);
        await Post.findByIdAndUpdate(id,{
            "name": data.name,
            "content": data.content
        });
        await res.send({
            "status":"success",
            "data":posts[index]
        });
    } catch {
        errorHandle(res);
    }
})

module.exports = router;