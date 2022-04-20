import realtime from 'firebase/admin';

// get reference to /chat path from realtime database
const database = realtime.ref('chat');

export default async (request, response) => {
  //receive data from our body
  const { text, user } = request.body;

  // if the user does not have an id, create a new id for the user
  if (!user.id) {
    //how we get a unique id from firebase
    user.id = database.push().getKey();
  }
  // push message with user to database
  await database.push({ text, timestamp: Date.now(), user });
  // respond with user id
  return response.status(200).send(user.id);
};
