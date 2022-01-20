const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        required: true,
        type: ObjectId,
        ref: 'Author'
    },
    tags: [String],
    category: {
        type: String,//[String],
        required: true
    },
    subcategory: { type: [String] },

    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt:{type:Date},

    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)


