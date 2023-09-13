const express = require('express');
const router = express.Router();
const { Thought, User } = require('../../models');

// GET to get all thoughts (works)
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching thoughts.' });
  }
});

// GET to get a single thought by its _id (works)
router.get('/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const thought = await Thought.findById(thoughtId);
    
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found.' });
    }
    
    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the thought.' });
  }
});

// POST to create a new thought and update associated user's thoughts array (works)
router.post('/', async (req, res) => {
  try {
    //extract text,username and userID from the request body.
    const { thoughtText, username, userId } = req.body;

    //creates new thought document using inserted object
    const thought = await Thought.create({ thoughtText, username });
    
    //find the user with the matching id, if user nor gound return 404
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    //
    user.thoughts.push(thought._id);
    await user.save();

    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create thought.' });
  }
});

// PUT to update a thought by its _id
router.put('/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const updatedThought = await Thought.findByIdAndUpdate(thoughtId, req.body, { new: true });
    
    if (!updatedThought) {
      return res.status(404).json({ error: 'Thought not found.' });
    }
    
    res.json(updatedThought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update thought.' });
  }
});

// DELETE to remove a thought by its _id
router.delete('/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const deletedThought = await Thought.findByIdAndDelete(thoughtId);

    if (!deletedThought) {
      return res.status(404).json({ error: 'Thought not found.' });
    }

    res.json({ message: 'Thought deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete thought.' });
  }
});

// POST to create a reaction in a thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    //get thought Id, and reaction information from object passed
    const thoughtId = req.params.thoughtId;
    const reactionData = req.body;

    //find thought by Id (url), if not found return error
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found.' });
    }

    //push the reaction data into the thought reaction's array
    thought.reactions.push(reactionData);
    //update
    await thought.save();

    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add reaction.' });
  }
});

// DELETE to remove a reaction by reactionId from a thought's reactions reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    //save thoughtId and reaction id
    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    //find the appropriate thought
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found.' });
    }

    //find the index of the matching reaction, 
    const indexToRemove = thought.reactions.findIndex(reaction => reaction.reactionId.toString() === reactionId);
    //if index is truthy remove it from the array
    if (indexToRemove !== -1) {
      thought.reactions.splice(indexToRemove, 1);
    }

    await thought.save();

    //return updated thought object
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to remove reaction.' });
  }
});

module.exports = router;