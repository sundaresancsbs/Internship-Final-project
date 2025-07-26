import { dbConnect } from '@/utils/dbConnect';
import Song from '@/models/Song';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const songs = await Song.find();
    return res.status(200).json(songs);
  }

  if (req.method === 'POST') {
    try {
      const newSong = await Song.create(req.body);
      return res.status(201).json(newSong);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
