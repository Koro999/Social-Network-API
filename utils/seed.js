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

  //push username and email into object, create 10 instances
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
    const user = await User.findById(userId)

    const numFriends = Math.floor(Math.random() * insertedUserIds.length - 1) + 1; // Random number of friends (at least 1 friend)
    const potentialFriendIds = insertedUserIds.filter(id => id.toString !== userId.toString());// Exclude the user itself, so user can't friend self
    
    //console.log(potentialFriendIds);
    //console.log('numFriends:', numFriends);
    //console.log('generatedUsers.length:', insertedUserIds.length);

    user.friends = potentialFriendIds
      .sort(() => Math.random() - 0.5) //(sort) shuffle friends, to assure randomness
      .slice(0, numFriends) //select subset of friends, make sure each user has a random and varied set of friends
      .map(id => id.toString()); //extract _id property, to create an array of references

    await user.save(); // Save user object with updated friend references
  }

  //insert thoughts into the Thoughts collection
  await Thought.collection.insertMany(thoughts);

  // Retrieve all thoughts from the database
  const allThoughts = await Thought.find();

  // Loop through each user and assign random thoughts to them
  for (const userId of insertedUserIds) {
    const user = await User.findById(userId);

    const numThoughts = Math.floor(Math.random() * allThoughts.length - 1) + 1; // Random number of thoughts

    user.thoughts = allThoughts
      .sort(() => Math.random() - 0.5) // Shuffle thoughts for randomness
      .slice(0, numThoughts) // Select a subset of thoughts
      .map(thought => thought._id.toString()); // Extract _id property for references

    await user.save(); // Save user object with updated thoughts references
  }

  // loop through the saved videos, for each video we need to generate a video response and insert the video responses
  console.table(users);
  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
