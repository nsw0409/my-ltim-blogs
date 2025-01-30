const Comment = require('../models/comment.model');
const Blog = require('../models/blog.model');
const service = {};

const createNewComment = async(req, res) => {
    try {
        const { comment, blogId, userId } = req.body;
        const data = new Comment({ comment, blogId, userId });
        await data.save();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add a new comment' });
    }
}

const checkBlogExists = async (id) => {
    try {
        const blog = await Blog.findById(id)
        if (blog) return true;
        else return false;
    } catch (error) {
        return true;
    }
};

service.createNewComment = createNewComment;
service.checkBlogExists = checkBlogExists;
module.exports = service;