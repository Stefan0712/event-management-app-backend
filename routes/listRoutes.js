const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Event = require('../models/eventSchema');
const List = require('../models/listSchema');








router.post('/', async (req, res) => {
    try {
      // Create a new list
      const newList = await List.create(req.body);
  
      // Update the event with the new list's ID
      await Event.findOneAndUpdate(
        { _id: req.body.event },
        { $push: { lists: newList._id } }, 
        { new: true }
      );
  
      res.status(201).json({ message: 'List created and event updated successfully' });
    } catch (error) {
      res.status(500).json({ error: `Failed to create the list or update the event: ${error}`});
    }
  });
  router.get('/:id', async (req, res)=>{
    const {id} = req.params;
    try{
      const list = await List.findById(id)
      const event = await Event.findById(list.event).populate('participants')
      const participants = event.participants;
      const dataToSend ={list, participants}
      if(!list){
        return res.status(404).json({message: "List not found"})
      }
      res.status(200).json(dataToSend)
    } catch (error){
      res.status(500).json({ error: `Failed to find the list or update the event: ${error}`});
    }
    
  })


  router.get('/:id/tasks', async (req, res)=>{
    const { id } = req.params;
    try{
      const list = await List.findById(id).populate({
        path: 'tasks',
        populate: {
            path: 'assignedTo',
            model: 'User', 
        },
    });
      
      if(list){
        let tasks = list.tasks
        res.status(200).json(tasks)
      }else{
        res.send({message: 'There was an error fetching tasks'})
      }
    } catch(error){
      res.status(500).json({error: `Failed to find the list or update the event: ${error}`})
    }
})












module.exports = router;