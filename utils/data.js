//list of random usernames
const randomUsernames = [
    'sunny123',
    'mysteriousUser',
    'pandaLover',
    'guitarHero42',
    'coffeeAddict',
    'codingNinja',
    'moonwalker',
    'starGazer89',
    'travelBug',
    'bookworm99',
    'happyFeet',
    'chocolateFanatic',
    'adventureSeeker',
    'pizzaLover',
    'creativeMind',
    'musicJunkie',
    'skyDiver',
    'natureLover',
    'beachBum',
    'yogaGuru',
    'movieBuff',
    'techWhiz',
    'foodieAdventures',
    'gamerChamp',
    'artisticSoul'
  ];
//list of random emails
  const randomEmails = [
    'user123@example.com',
    'mysterious.user@email.net',
    'panda_lover42@gmail.com',
    'guitar.hero@example.org',
    'coffee.addict@email.com',
    'coding.ninja@hotmail.com',
    'moonwalker123@gmail.com',
    'stargazer89@example.net',
    'travel.bug@yahoo.com',
    'bookworm99@example.org',
    'happy.feet@email.com',
    'chocolate.fanatic@example.net',
    'adventure.seeker@gmail.com',
    'pizza.lover@example.org',
    'creative.mind@hotmail.com',
    'music.junkie@email.com',
    'sky.diver@example.net',
    'nature.lover@yahoo.com',
    'beach.bum@example.org',
    'yoga.guru@gmail.com',
    'movie.buff@example.net',
    'tech.whiz@hotmail.com',
    'foodie.adventures@email.com',
    'gamer.champ@example.org',
    'artistic.soul@gmail.com'
  ];
//list of random thoughts
  const randomThoughts = [
    'Just enjoying a quiet moment with a book.',
    'Life is a journey, not a destination.',
    'Coding is my form of creative expression.',
    'Sunsets always leave me in awe.',
    'Traveling to new places broadens my perspective.',
    'Learning something new every day!',
    'Coffee and contemplation - perfect combo.',
    'Laughter is the best medicine.',
    'Chasing dreams and setting goals.',
    'Appreciating the little things in life.',
    'Music has the power to uplift my mood.',
    'Nature walks help me clear my mind.',
    'Embracing change with an open heart.',
    'Finding beauty in unexpected places.',
    'Cooking up a storm in the kitchen!',
    'Inspiration can be found everywhere.',
    'Kindness costs nothing - spread it.',
    'Adventure awaits just around the corner.',
    'Staying curious and asking questions.',
    'Creating memories with loved ones.',
    'Silence can be a wonderful companion.',
    'Pushing my limits and breaking boundaries.',
    'Dancing like nobody\'s watching.',
    'Mindfulness brings peace to my day.',
    'Dreaming big and working hard.'
  ];
//list of random reactions
  const randomReactions = [
    'Absolutely love this!',
    'So inspiring!',
    'Made me smile!',
    'This is awesome!',
    'I can relate!',
    'Incredible work!',
    'You nailed it!',
    'This touched my heart.',
    'Impressive!',
    'So much creativity!',
    'This made my day.',
    'You have a gift!',
    'This is gold!',
    'Wow, just wow!',
    'Keep shining!',
    'Brilliant!',
    'You inspire me.',
    'This speaks to me.',
    'You deserve applause!',
    'Pure magic!',
    'Incredible talent!',
    'You bring joy!',
    'You make a difference.',
    'I admire your work.',
    'This is pure gold!'
  ];

//randomUsername, randomEmail, randomThought, randomReaction

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random username
const getRandomUsername = () =>
  `${getRandomArrItem(randomUsernames)}`;

// Gets a random email
const getRandomEmail = () =>
  `${getRandomArrItem(randomEmails)}`

// Function to generate random thoughts that we can add to the database. Includes reactions.
const getRandomThoughts = (int) => {
    //create empty array to hold object information
    let results = [];
    //loop through the designated amount of times (int)
    for (let i = 0; i < int; i++) {
      results.push({
        thoughtText: getRandomArrItem(randomThoughts), //random thought
        username: getRandomUsername(), //random username
        reactions: [...getThoughtReaction(3)], //grab 3 thought reactions
      });
    }
    return results;
  };

// Create the reactions for thoughts
const getThoughtReaction = (int) => {
    //if the int value is one just run getRandomArrItem() and return that
    if (int === 1) {
      return getRandomArrItem(randomReactions);
    }
    //create empty array to hold object information
    let results = [];
    //loop through the designated amount of times (int)
    for (let i = 0; i < int; i++) {
      results.push({
        reactionBody: getRandomArrItem(randomReactions), // random reaction
        username: getRandomUsername(), //random username
      });
    }
    return results;
  };

  //export functions for use in seed.js
  module.exports = {getRandomUsername, getRandomThoughts, getThoughtReaction, getRandomEmail}