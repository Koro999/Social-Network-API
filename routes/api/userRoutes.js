const router = require('express').Router();
const { User, Thought } = require('../../models');

router.get('/test', (req, res) => {
  res.json({ message: 'Test route is working.' });
});

// GET all users (works)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

// GET a single user by _id and populated thought and friend data (works)
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    //having populate was causing issues (.populate('thoughts').populate('friends'))
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  
  }
});


// POST a new user (works)
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user.' });
  }
});

// PUT to update a user by _id (works)
router.put('/:id', async (req, res) => {
  try {

    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate({_id: userId}, req.body, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user.' });
  }
});

//BONUS
// DELETE to remove a user's associated thoughts when deleted (works)
router.delete('/:id', async (req, res) => {
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

// POST to add a new friend to a user's friend list (works)
router.post('/:userId/friends/:friendId', async (req, res) => {
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

// DELETE to remove a friend from a user's friend list (works)
router.delete('/:userId/friends/:friendId', async (req, res) => {
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