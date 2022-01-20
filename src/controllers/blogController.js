//const mongoose = require("mongoose")
const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')


//---------------------2nd-CREATE BLOGS--------------------

const createBlog = async function (req, res) {
  try {
    const authorId = req.body.authorId;
    if (req.user.userId == authorId) {                                               //Authentication (userId===Token ID)
      const blogDetails = req.body;
      if (blogDetails.isPublished == true) {
        blogDetails["publishedAt"] = new Date()
      }
      const getDetails = await authorModel.findById(authorId)                       //getDetails author is exist or not
      if (getDetails) {
        const writeBlog = await blogModel.create(blogDetails);                         // blog create using create method and blog details
        res.status(201).send({ msg: "Blog created", writeBlog });
      } else {
        res.status(400).send({ msg: "Author doesn't exist" })
      }
    }
    else {
      res.status(404).send({ err: "Prohibited authentication" })
    }

  } catch (err) {

    res.status(500).send({ error: err.message })
  }
}

//-----------------------3rd-GET BLOGS LIST-----------------------------------

const getBlogs = async function (req, res) {

  try {
    if (req.user.userId == req.query.authorId) {                                         // authentication (req.user is used for tokenId)

      const updatedfilter = {isDeleted: false, isPublished: true}

      if (req.query.authorId) {
        updatedfilter["authorId"] = req.query.authorId
      }
      if (req.query.category) {
        updatedfilter["category"] = req.query.category
      }
      if (req.query.tags) {
        updatedfilter["tags"] = req.query.tags
      }
      if (req.query.subcategory) {
        updatedfilter["subcategory"] = req.query.subcategory
      }

      const getDetails = await blogModel.find(updatedfilter) 

      if (getDetails.length > 0) {
        res.status(200).send({ status: true, data: getDetails })
      }
      else {
        res.status(404).send({ msg: "Details not find" })
      }
    } else {
      res.status(404).send({ err: "Prohibited authentication " })
    }
  }
  catch (error) {
    res.status(500).send({ msg:error.message })
  }
}

//-----------------------------4th- UPDATE BLOG-------------------------------------

const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId                                              // fetching data from params
    const title = req.body.title                                                  // fetching data from body
    const body = req.body.body
    const tags = req.body.tags
    const subcategory = req.body.subcategory
    const isPublished = req.body.isPublished

    const getDetails = await blogModel.findOne({ _id: blogId })
    const authorId = getDetails.authorId

    if (req.user.userId == authorId) {                                            // Authentication
      const updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { 
        title: title,
         body: body,
          $push: { tags: tags, subcategory: subcategory },                         // add value in array
           isPublished: isPublished },
            { new: true })

      if (updatedBlog.isPublished == true) {
        updatedBlog.publishedAt = new Date()
      }
      res.status(200).send({ status: true, message: 'Blog updated successfully', data: updatedBlog });
    } else {
      res.status(404).send({ msg: "Prohibited authentication" })
    }
  } catch (error) {

    res.status(500).send({ status: false, message: error.message });
  }
}

//---------------------------------5th-DELETE BLOG WITH ID----------------------------------------

const checkdeletestatus = async function (req, res) {

  try {

    const blogId = req.params.blogId

    const getDetails = await blogModel.findOne({ _id: blogId })
    const authorid = getDetails.authorId
    if (req.user.userId == authorid) {                                                           // Authentication
      const deletedblogs = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
      if (deletedblogs) {
        res.status(200).send({ msg: " Blog delete successfully" })
      }

      else {
        res.status(404).send({ msg: "Blog doesn't exist" })
      }
    }
    else {
      res.status(404).send({ err: "Invalid AuthorId " })
    }

  }

  catch (error) {
    res.status(500).send({ err: error.message })
  }
}

//----------------------------6th-DELETE BLOG WITH QUERY----------------------------------------

const deletebyparams = async function (req, res) {
  try {
    if (req.user.userId == req.query.authorId) {
      const updatedfilter = {}

      //console.log(updatedfilter)
      if (req.query.authorId) {
        updatedfilter["authorId"] = req.query.authorId
      }
      if (req.query.category) {
        updatedfilter["category"] = req.query.category
      }
      if (req.query.tags) {
        updatedfilter["tags"] = req.query.tags
      }
      if (req.query.subcategory) {
        updatedfilter["subcategory"] = req.query.subcategory
      }
      if (req.query.isPublished) {
        updatedfilter["isPublished"] = req.query.isPublished
      }
      //console.log(updatedfilter)

      const deleteData = await blogModel.findOne(updatedfilter)
      if (!deleteData) {
        return res.status(404).send({ status: false, msg: "Given data is Invalid" });
      }

      deleteData.isDeleted = true;
      deleteData.deletedAt = new Date()
      deleteData.save();

      res.status(200).send({ msg: "Succesful", data: deleteData });
    }
    else {
      res.status(404).send({ msg: "Invalid AuthorId" })
    }
  }
  catch (error) {
    res.status(500).send({ msg: error });
  }
}

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.checkdeletestatus = checkdeletestatus;
module.exports.deletebyparams = deletebyparams;