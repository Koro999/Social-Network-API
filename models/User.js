const mongoose = require('mongoose');

// Schema to create User model
//the model has four fields 
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, //required is true
      unique: true, //unique is true
      trim: true //trim is true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //REGEX to match valid email
    },
    thoughts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thought' //reference the Thought model
    }],
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' //reference the User model (self-reference)
    }]
  });

// Define the virtual property
userSchema.virtual('friendCount').get(function() {
  //return friends length, refers to the schema itself 
  return this.friends.length;
});

// Initialize our User model (collections)
const User = mongoose.model('users', userSchema);

module.exports = User;
