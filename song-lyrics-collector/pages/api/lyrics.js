import { fetchSongLyrics } from '../../app/lib/musixmatch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  const { title, artist = '' } = req.query;

  if (!title) {
    return res.status(400).json({ 
      success: false,
      message: 'Title is required' 
    });
  }

  try {
    console.log(`Fetching lyrics for: ${title} by ${artist || 'unknown artist'}`);
    const result = await fetchSongLyrics(title, artist);
    
    if (!result.success) {
      console.log('No lyrics found:', result.message);
      return res.status(404).json({
        success: false,
        message: result.message || 'Lyrics not found'
      });
    }
    
    console.log('Successfully retrieved lyrics');
    return res.status(200).json({
      success: true,
      lyrics: result.lyrics,
      artwork_url: result.artwork_url,
      title: result.title,
      artist: result.artist
    });
    
  } catch (error) {
    console.error('Error in lyrics API:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}
