const mongoose = require('mongoose');
const User = require('./usersModel');

const postSchema = new mongoose.Schema (
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: [true, 'user ID 未填寫']
        },
        tags: Array,
        type: {
            type: String,
            default: "friend"
        },
        image: {
            type: String,
            default: "",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        content: {
            type: String,
            required: [true, 'Content 未填寫']
        },
        likes: {
            type:Number,
            default: 0
        },
        comments: {
            type:Number,
            default: 0
        }
    },
    {
        versionKey: false,
    }
);

const Post = mongoose.model('Post',postSchema);

module.exports = Post;