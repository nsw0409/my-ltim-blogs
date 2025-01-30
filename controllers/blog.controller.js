const express = require("express");
const router = express.Router();
const blogService = require("../services/blog.service");

const createNewBlog = async(req, res) => {
    let exists = await blogService.checkTitleExists(req.body.title);
    if(!exists){
        blogService.createNewBlog(req,res, (data)=>{
            res.status(200).send({data:data})
        },(err)=>{
            res.status(400).send(err);
        })
    }
    else res.status(400).json({error: 'Blog name already exists'})
}

const getAllBlogs = async(req, res) => {
    blogService.getAllBlogs(req, res, (data)=>{
        res.status(200).send({data:data})
    },(err)=>{
        res.status(400).send(err);
    })
}

const getBlogById = async(req, res) => {
    blogService.getBlogById(req, res, (data)=>{
        res.status(200).send({data:data})
    },(err)=>{
        res.status(400).send(err);
    })
}

router.post("/create", createNewBlog);
router.get("/get", getAllBlogs);
router.get("/get/:id", getBlogById);

module.exports = router;