const mongoose = require('mongoose');

// Reaction Schema
const reactionSchema = new mongoose.Schema({
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
      required: true
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

// Thought Schema
const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true
  },
  reactions: [reactionSchema] // Insert reaction schema 
});

// Define the virtual property
thoughtSchema.virtual('reactionCount').get(function() {
  //return reactions length  
  return this.reactions.length;
});

// Create models (collections)
const Thought = mongoose.model('thoughts', thoughtSchema);


module.exports = Thought;
