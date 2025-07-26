import { dbConnect } from '@/utils/dbConnect';
import Song from '@/models/Song';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'GET') {
    const song = await Song.findById(id);
    return res.status(200).json(song);
  }

  if (req.method === 'PUT') {
    const updated = await Song.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    await Song.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).json({ message: "Method not allowed" });
}
