const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Comment = require('../models/commentSchema');
const User = require('../models/userSchema');
const Post = require('../models/postSchema');








router.post('/', async (req, res)=>{
    const commentData = req.body;
    try{
      const newComment = await Comment.create(commentData)
      await User.findOneAndUpdate(
        { _id: commentData.author },
        { $push: { comments: newComment._id } }, 
        { new: true }
      )
      await Post.findOneAndUpdate(
        { _id: commentData.post },
        { $push: { comments: newComment._id } }, 
        { new: true }
      )
      
      res.status(201).json({success: true, newComment});
    } catch (error){
      console.error(error)
      res.status(500).json({success: false, message: 'Internal server error:'})
    }
  })


  router.get('/:id', async (req, res)=>{
    const {id} = req.params;
    try {
      const comments = await Comment.findById(id);
      res.status(200).json(comments); 
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
  })
  router.delete('/:id/delete', async (req, res)=>{
    const {id} = req.params;
    try{
      const result = await Comment.deleteOne({ _id: id})
      if(result.deletedCount === 1){
        res.send("Comment deleted successfully")
      }else{
        res.status(400).send("Comment was not deleted successfully")
      }
    } catch(error){
      console.error(error)
      res.status(500).send("Internal Server Error")
    }
  
  })









module.exports = router;