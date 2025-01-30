const Blog = require('../models/blog.model');
const Comment = require('../models/comment.model');
const service = {};

const createNewBlog = async (req,res)=> {
    try {
        const { title, content, userId } = req.body;
        const blog = new Blog({ title, content, userId });
        await blog.save();
        res.status(200).json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create a new blog' });
    }
}

const checkTitleExists = async (title) => {
    try {
        const blog = await Blog.findOne({title: title})
        if (blog) return true;
        else return false;
    } catch (error) {
        return true;
    }
};

const getAllBlogs = async(req, res) => {
    try {
        let blogs = await Blog.find({});
        res.status(200).json(blogs);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch the blogs' });
    }
}

const getBlogById = async(req, res) => {
    try {
        Promise.all([
            Blog.findById(req.params.id).exec(),
            Comment.find({blogId : req.params.id}).exec()
          ]).then(results => {
            const [blogResult, commentResult] = results;
            const combinedResults = {
              blog: blogResult,
              comments: commentResult
            };
            let data = JSON.stringify(combinedResults, null, 2);
            res.status(200).json(JSON.parse(data));
          }).catch(err => {
            res.status(500).json(err)
          });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch the blog details' });
    }
}

service.createNewBlog = createNewBlog;
service.checkTitleExists = checkTitleExists;
service.getAllBlogs = getAllBlogs;
service.getBlogById = getBlogById;
module.exports = service;