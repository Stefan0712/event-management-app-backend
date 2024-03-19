const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Event = require('../models/eventSchema');
const User = require('../models/userSchema');


router.post('/create-event', async(req, res)=>{
  const eventData = req.body;
  console.log(eventData)
  try{

      const newEvent = new Event(eventData)
      const eventId = newEvent._id;
      newEvent.participants.push(eventData.author);
      const savedEvent = await newEvent.save();
      
      const response = await User.findOneAndUpdate(
        { _id: eventData.author },
        { $push: { createdEvents: newEvent._id } }, 
        { new: true }
      );
      console.log(response)
      res.status(200).json(response); 
  } catch (error){
      res.status(500).json({message: 'Error creating event', error: error.message})
  }

  
})
router.get('/events',async (req, res)=>{
  try {
      const events = await Event.find();
      res.status(200).json(events); 
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
})

router.get('/:id/events',async (req, res)=>{
const {id} = req.params;

  try {
      
      const user = await User.findById(id).populate('joinedEvents').populate('createdEvents').populate('savedEvents');
      const events = {joinedEvents: user.joinedEvents, createdEvents: user.createdEvents, bookmarkedEvents: user.savedEvents};
      res.status(200).json(events); 
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
})
router.get('/manage-event/:id', async (req,res)=>{
  const {id} = req.params;
  try{
      const event = await Event.findById(id).populate('lists').populate('author').populate('participants');
      if(!event){
          return res.status(404).json({message: 'Event not found'})
      }
      res.status(200).json(event)
  } catch (error){
      res.status(500).json({message: 'Error finding event', error: error.message})
  }
})


router.get('/view-event/:id', async (req,res)=>{
  const {id} = req.params;
  try{
      const event = await Event.findById(id).populate('author');
      if(!event){
        
          return res.status(404).json({message: 'Event not found'})
      }
      res.status(200).json(event)
  } catch (error){
      res.status(500).json({message: 'Error finding event', error: error.message})
  }
})


router.post('/join-event/:id', async (req, res) => {
const { id } = req.params;
const { userId } = req.body;

try {
    const updateEvent = await Event.findOneAndUpdate(
        { _id: id },
        { $push: { participants: userId } },
        { new: true }
    );

    const updateUser = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: {joinedEvents: id}},
      { new: true }
    )

    res.json({
      success: true,
      message: 'User joined event successfully',
      event: updateEvent,
      user: updateUser,
  });
} catch (error) {
  console.error(error);
  res.status(500).json({
      success: false,
      message: 'Error joining event',
      error: error.message,
  });
}
});

router.post('/bookmark-event/:id', async (req,res)=>{
const {id} = req.params;
const {userId} = req.body;

try {
  const response = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { savedEvents: id } },
      { new: true }
  );

  res.status(200).json(response); 
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Error bookmarking event', error: error.message });
}
})

router.post('/unbookmark-event/:id', async (req,res)=>{
const {id} = req.params;
const {userId} = req.body;

try {
  const response = await User.updateOne(
      { _id: userId },
      { $pull: { savedEvents: id } }
      
  );
  console.log(response)
  res.status(200).json(response); 
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Error bookmarking event', error: error.message });
}
})
router.post('/edit-event/:id/', async (req, res)=>{
  const { id } = req.params;
  const eventData = req.body
  console.log(eventData)
  try{
    await Event.findOneAndUpdate(
      {_id: id},
      eventData,
      {new: true}
    )
    if (eventData) {
      console.log('Task updated successfully:', eventData);
      res.status(200).json(eventData)
    } else {
        console.log('Task not found or update failed.');
        return res.status(404).json({message: "Event not found"})
    }
  }catch(error){
    res.status(500).json({ error: `Failed to uodate the event: ${error}`});
  }
})



module.exports = router;