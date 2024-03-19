const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Post = require('../models/postSchema');
const User = require('../models/userSchema');




router.post('/', async (req, res)=>{
    const postData = req.body;
    try{
      const newPost = await Post.create(postData)
      await User.findOneAndUpdate(
        { _id: postData.author },
        { $push: { posts: newPost._id } }, 
        { new: true }
      )
      
      res.status(201).json({success: true, newPost});
    } catch (error){
      console.error(error)
      res.status(500).json({success: false, message: 'Internal server error:'})
    }
  })

  router.get('/all', async (req, res)=>{
    try {
      const posts = await Post.find().populate('comments')
      res.status(200).json(posts); 
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
  })
  router.get('/:id', async (req, res)=>{
    const {id} = req.params;
    try {
      const post = await Post.findById(id).populate('comments')
      res.status(200).json(post); 
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
  })
  
  router.delete('/:id/delete', async (req, res)=>{
    const {id} = req.params;
    try{
      const result = await Post.deleteOne({ _id: id})
      if(result.deletedCount === 1){
        res.send("Post deleted successfully")
      }else{
        res.status(400).send("Post was not deleted successfully")
      }
    } catch(error){
      console.error(error)
      res.status(500).send("Internal Server Error")
    }
  
  })

  router.post('/:id/update', async (req, res) => {
    const { id } = req.params;
    const postData = req.body
    console.log(postData)
    try{
      await Post.findOneAndUpdate(
        {_id: id},
        postData,
        {new: true}
      )
      if (postData) {
        console.log('Post updated successfully:', postData);
        res.status(200).json(postData)
      } else {
          console.log('Task not found or update failed.');
          return res.status(404).json({message: "Event not found"})
      }
    }catch(error){
      res.status(500).json({ error: `Failed to uodate the event: ${error}`});
    }
  });





module.exports = router;