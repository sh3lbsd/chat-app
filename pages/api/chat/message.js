import realtime from 'firebase/admin';

const db = realtime.ref('chat');

export default async (req, res) => {
  const { text, user } = req.body;

  if (!user.id) {
    user.id = db.push().getKey();
  }

  await db.push({ text, timestamp: Date.now(), user });
  return res.status(200).send(user.id);
};
