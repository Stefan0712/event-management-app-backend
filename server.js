require('dotenv').config();


const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

//importing routes
const eventRoutes = require('./routes/eventRoutes');
const postRoutes = require('./routes/postRoutes');
const taskRoutes = require('./routes/taskRoutes');
const listRoutes = require('./routes/listRoutes');
const commentRoutes = require('./routes/commentRoute');



const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userSchema');
const session = require("express-session");


const app = express();
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: 'tacos-doritos-tacos-doritos-chupakabra',
    resave: false,
    saveUninitialized: false,
  })
);


//auth middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


connectDB();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//using routes
app.use('/', eventRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/task', taskRoutes);
app.use('/list', listRoutes);




//auth related routes


//handles signups
app.post('/register', async (req, res)=>{
  const { email, username, password} = req.body;
  const user = new User({email, username});
  const registeredUser = await User.register(user, password);
  console.log(registeredUser);
  
})
//handles login
app.post('/login',passport.authenticate('local', { failureRedirect: '/failed-login'}), async (req, res)=>{
  console.log(req.user)
  try{
    const populatedUser = await User.findById(req.user._id).populate('joinedEvents').populate('createdEvents');
    res.send({user: populatedUser})

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
})


//shows error when user can't login
app.get('/failed-login', (req, res)=>{
  console.log("Failed to login")
  res.redirect('/auth')
})

//handles logout
app.get('/logout', (req, res, next)=>{
  req.logout(function (err){
    if(err){
      return next(err);
    }
    req.send({isLoggedIn: false})
  })
})


//route for updating user profile
app.post('/edit-profile/:id', async(req,res)=>{
  const {id} = req.params;
  const profileData = req.body;

  try{
    await User.findOneAndUpdate(
      {_id: id},
      profileData,
      {new: true}
    )
    if (profileData) {
      console.log('User updated successfully:', profileData);
      res.status(200).json(profileData)
    } else {
        console.log('User not found or update failed.');
        return res.status(404).json({message: "Event not found"})
    }
  }catch(error){
    res.status(500).json({ error: `Failed to update the user: ${error}`});
  }


})




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
