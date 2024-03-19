
const isLoggedIn = (req, res, next) =>{
    console.log(req.user)
    if( !req.isAuthenticated()){
        console.log('could not authenticate')
        return res.send({isLoggedIn: false})
    }else{
        return res.send({isLoggedIn: true})
    }
    next();
    
}




const addUserDataMiddleware = async (req, res, next) => {
    try {

      const { id } = req.user; 
      const { data } = req.body;

    let dataToSend = {msg, url, isRead: false};
      
        switch(type){
            case 'joined-event':
                dataToSend.msg = `You joined event ${data.eventName} successfully!`;
                dataToSend.url = `/view-event/${data.eventId}`;
                break;
            case 'kicked':
                dataToSend.msg = `You were kicked from the event ${data.eventName}!`;
                dataToSend.url = `/view-event/${data.eventId}`;
                break;
            case 'task-assigned':
                dataToSend.msg = `You got assigned a new task in list ${data.listName}!`;
                dataToSend.url = `/view-list/${data.listId}`;
                break;
            case 'event-status':
                dataToSend.msg = `The event ${data.eventName} is now ${data.eventStatus}`;
                dataToSend.url = `/view-event/${data.eventId}`;
                break;
            case 'event-update':
                dataToSend.msg = `The event ${data.eventName} has been updated!`;
                dataToSend.url = `/view-event/${data.eventId}`;
                break;
            case 'new-task':
                dataToSend.msg = `The list ${data.listName} has a new task!`;
                dataToSend.url = `/view-list/${data.listId}`;
                break;
            default:
                break;
        }

        try{
            await User.findOneAndUpdate(
              {_id: id},
              {$push: {dataToSend}},
              {new: true}
            )
            if (notifications) {
              console.log('Notifications updated successfully:', notifications);
              res.status(200).json(notifications)
            } else {
                console.log('User not found or update failed.');
                return res.status(404).json({message: "Event not found"})
            }
          }catch(error){
            res.status(500).json({ error: `Failed to update Notifications: ${error}`});
          }
        
      next(); 
    } catch (error) {
      console.error('Error in addUserDataMiddleware:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };




  module.exports = { addUserDataMiddleware, isLoggedIn };