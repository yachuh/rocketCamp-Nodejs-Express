const express = require('express');
const router = express.Router();
const Post = require('../models/postsModel');
const User = require('../models/usersModel');
const errorHandle = require('../errorHandle');

// const headers = {
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
//     'Content-Type': 'application/json'
// };

router.get('/', async function(req,res){
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt";
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const posts = await Post.find(q).populate({
        path:'user',
        select:'name photo'
    }).sort(timeSort);
    res.send({ // 會自動將物件轉為 JSON 字串
        "status":"success",
        posts
    });
})

router.post('/:uuid',async function(req,res){
    try{
        const data = req.body;
        const uuid = req.params.uuid;
        if(data.content !== undefined){
            const newPost = await Post.create(
                {
                    user: uuid,
                    content: data.content,
                    image: data.image
                }
            );
            res.send({
                "status":"success",
                "post": newPost
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
        const name = req.body.name;
        const content = req.body.content;
        const posts = await Post.find();
        const index = posts.findIndex(element => element.id === id);
        await Post.findByIdAndUpdate(id,{
            "name": name,
            "content": content
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