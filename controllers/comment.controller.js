const express = require("express");
const router = express.Router();
const commentService = require("../services/comment.service");

const createNewComment = async(req, res) => {
    if(!req.body.userId) return res.status(400).json({error: 'Not a valid user'})
    if(!req.body.blogId) return res.status(400).json({error: 'Blog Id is mandatory'})
    if(!req.body.comment) return res.status(400).json({error: 'Comment cannot be empty'})
    let exists = await commentService.checkBlogExists(req.body.blogId);
    if(exists){
        commentService.createNewComment(req,res, (data)=>{
            res.status(200).send({data:data})
        },(err)=>{
            res.status(400).send(err);
        })
    }
    else res.status(400).json({error: 'Blog does not exist'})
}

router.post("/create", createNewComment);
module.exports = router;