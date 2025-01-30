const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
});
const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;