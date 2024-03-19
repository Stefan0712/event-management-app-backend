const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const List = require('../models/listSchema');
const User = require('../models/userSchema');
const Task = require('../models/taskSchema');






router.post('/', async (req, res)=>{
  const taskData = req.body;

  try{
    const newTask = await Task.create(taskData)
    await List.findOneAndUpdate(
      { _id: taskData.listId },
      { $push: { tasks: newTask._id } }, 
      { new: true }
    )
    await User.findOneAndUpdate(
      {_id: taskData.author},
      { $push: { assignedTasks: newTask._id } },
      {new: true}
    )
    res.status(201).json({success: true, newTask});
  } catch (error){
    console.error(error)
    res.status(500).json({success: false, message: 'Internal server error:'})
  }
})
  
  
router.post('/:id/update', async (req, res) => {
  const { id } = req.params;
  const taskData = req.body;
  console.log(taskData);

  try {
      // Find the current task
      const currentTask = await Task.findById(id);

      if (!currentTask) {
          return res.status(404).json({
              success: false,
              message: 'Task not found',
          });
      }

      // Retrieve the current assigned user ID
      const currentAssignedUserId = currentTask.assignedTo;

      // Check if the assigned user is changed
      if (currentAssignedUserId.toString() !== taskData.assignedTo.toString()) {
          // Remove the task ID from the current user's assignedTasks array
          await User.findByIdAndUpdate(
              currentAssignedUserId,
              { $pull: { assignedTasks: id } }
          );

          // Add the task ID to the new user's assignedTasks array
          await User.findByIdAndUpdate(
              taskData.assignedTo,
              { $push: { assignedTasks: id } }
          );
      }

      // Update the task data
      const updatedTask = await Task.findOneAndUpdate(
          { _id: id },
          taskData,
          { new: true }
      );

      if (updatedTask) {
          console.log('Task updated successfully:', updatedTask);
          res.json({
              success: true,
              message: 'Task updated successfully',
              task: updatedTask,
          });
      } else {
          console.log('Task not found or update failed.');
          res.status(404).json({
              success: false,
              message: 'Task not found or update failed',
          });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: 'Error updating task',
          error: error.message,
      });
  }
});
  
router.delete('/:id/delete', async (req, res)=>{
  const {id} = req.params;

  try{
    const result = await Task.deleteOne({ _id: id})
    if(result.deletedCount === 1){
      res.send("Task deleted successfully")
    }else{
      res.status(400).send("Task was not deleted successfully")
    }
  } catch(error){
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
})
  
router.get('/:id', async (req, res)=>{
  const { id } = req.params;
  try{
    let task = await Task.findById(id)
    if(!task){
      return res.status(404).json({message: "Task not found"})
    }
    res.status(200).json(task)
  } catch (error){
    res.status(500).json({ error: `Failed to find the task: ${error}`});
  }
  
})
  
router.post('/:id/completion', async (req, res)=>{
  const {id} = req.params;
  const completion = req.body.completion;
  console.log(completion)
  try{
    const result = await Task.findOneAndUpdate(
      {_id: id},
      {$set: {isCompleted: completion}},
      {new: true}
    )
    if (result) {
      console.log('Task updated successfully:', result);
    } else {
        console.log('Task not found or update failed.');
    }
  } catch(error){
    console.error(error)
  }
  

})
  
  
router.get('/userTasks/:id',async (req, res)=>{
  const {id} = req.params;
  
    try {
        
        const user = await User.findById(id).populate('assignedTasks');
        const tasks = user.assignedTasks;
        console.log(tasks)
        res.status(200).json(tasks); 
      } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
      }
})
  











module.exports = router;