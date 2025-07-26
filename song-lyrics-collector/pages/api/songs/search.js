import { dbConnect } from '../../../app/utils/dbConnect';
import Song from '../../../app/models/Song';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q: searchQuery } = req.query;
  
  if (!searchQuery) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    await dbConnect();
    
    // Search in title and artist fields (case-insensitive)
    const searchResults = await Song.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { artist: { $regex: searchQuery, $options: 'i' } }
      ]
    }).limit(5); // Limit to 5 results

    return res.status(200).json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      message: 'Error performing search',
      error: error.message
    });
  }
}
