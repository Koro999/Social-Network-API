const express = require('express');
const router = express.Router();
const { User, Thoughts } = require('../../models');

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

// GET a single user by _id and populated thought and friend data
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate('thoughts')
      .populate('friends');
      
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
});

// POST a new user
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user.' });
  }
});

// PUT to update a user by _id
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user.' });
  }
});

// DELETE to remove user by _id
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.json({ message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

//BONUS
// DELETE to remove a user's associated thoughts when deleted
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Remove associated thoughts
    await Thought.deleteMany({ username: deletedUser.username });

    res.json({ message: 'User deleted along with associated thoughts.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user and associated thoughts.' });
  }
});

// POST to add a new friend to a user's friend list
router.post('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: 'User(s) not found.' });
    }

    user.friends.push(friendId);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add friend.' });
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.friends.pull(friendId);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to remove friend.' });
  }
});

module.exports = router;