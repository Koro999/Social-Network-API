const express = require('express');
const router = express.Router();
const { Thought, User } = require('../../models');

// GET to get all thoughts
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching thoughts.' });
  }
});

// GET to get a single thought by its _id
router.get('/thoughts/:id', async (req, res) => {
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

// POST to create a new thought and update associated user's thoughts array
router.post('/thoughts', async (req, res) => {
  try {
    const { thoughtText, username, userId } = req.body;

    const thought = await Thought.create({ thoughtText, username });
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.thoughts.push(thought._id);
    await user.save();

    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create thought.' });
  }
});

// PUT to update a thought by its _id
router.put('/thoughts/:id', async (req, res) => {
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
router.delete('/thoughts/:id', async (req, res) => {
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
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const reactionData = req.body;
    
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found.' });
    }

    thought.reactions.push(reactionData);
    await thought.save();

    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add reaction.' });
  }
});

// DELETE to remove a reaction by reactionId from a thought's reactions reactionId value
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found.' });
    }

    thought.reactions = thought.reactions.filter(reaction => reaction.reactionId.toString() !== reactionId);
    await thought.save();

    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to remove reaction.' });
  }
});

module.exports = router;