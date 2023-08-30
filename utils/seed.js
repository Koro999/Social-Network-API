//import needed files
const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomUsername, getRandomThoughts, getRandomEmail } = require('./data');

//if error return error
connection.on('error', (err) => err);

//once connection established
connection.once('open', async () => {
  console.log('connected');
  // Delete the thoughts collections if it exists
  let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection('thoughts');
  }

  // Delete the users collection if it exists
  let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  const users = [];
  const thoughts = getRandomThoughts(10);

  //push username and email into object, create 20 instances
  for (let i = 0; i < 10; i++) {

  // Generate a unique username
  // keep grabbing a username until it is not a previously grabbed username
  do {
    username = getRandomUsername(); 
  } while (users.some(user => user.username === username));

  // Generate a unique email
   // keep grabbing a email until it is not a previously grabbed email
  do {
    email = getRandomEmail();
  } while (users.some(user => user.email === email));
    users.push({
      username,
      email
    });
  }

  //insert the generatedUser data into the 'users' collection
  //also saved as a variable for reference
  const generatedUsers = await User.collection.insertMany(users);
  const insertedUserIds = Object.values(generatedUsers.insertedIds);
  
  for (const userId of insertedUserIds) {
    const user = await User.findById(userId);

    const numFriends = Math.floor(Math.random() * generatedUsers.length - 1) + 1; // Random number of friends (at least 1 friend)
    const potentialFriendIds = insertedUserIds.filter(id => id !== userId);// Exclude the user itself, so user can't friend self
    
    user.friends = potentialFriendIds
      .sort(() => Math.random() - 0.5) //(sort) shuffle friends, to assure randomness
      .slice(0, numFriends) //select subset of friends, make sure each user has a random and varied set of friends
      //.map(friend => friend._id); //extract _id property, to create an array of references

    await user.save(); // Save user object with updated friend references
  }

  //insert thoughts into the Thoughts collection
  await Thought.collection.insertMany(thoughts);

  // loop through the saved videos, for each video we need to generate a video response and insert the video responses
  console.table(users);
  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
