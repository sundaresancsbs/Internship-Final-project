// lib/musixmatch.js
const BASE = 'https://api.musixmatch.com/ws/1.1';

async function trackSearch(title, artist = '') {
  const params = new URLSearchParams({
    apikey: process.env.MUSIXMATCH_API_KEY,
    q_track: title,
    ...(artist && { q_artist: artist }),
    format: 'json',
    page_size: 1,
  });

  const res = await fetch(`${BASE}/track.search?${params}`);
  const data = await res.json();
  const track = data.message.body.track_list?.[0]?.track;
  return track?.track_id;
}

async function getLyrics(track_id) {
  const params = new URLSearchParams({
    apikey: process.env.MUSIXMATCH_API_KEY,
    track_id,
    format: 'json',
  });

  const res = await fetch(`${BASE}/track.lyrics.get?${params}`);
  const data = await res.json();
  return data.message.body.lyrics.lyrics_body;
}

async function getArtwork(track_id) {
  const params = new URLSearchParams({
    apikey: process.env.MUSIXMATCH_API_KEY,
    track_id,
    format: 'json',
  });

  const res = await fetch(`${BASE}/track.get?${params}`);
  const data = await res.json();
  return data.message.body.track.album_coverart_350x350;
}

export async function fetchSongLyrics(title, artist = '') {
  const track_id = await trackSearch(title, artist);
  if (!track_id) return null;
  const [lyrics, artwork_url] = await Promise.all([
    getLyrics(track_id),
    getArtwork(track_id),
  ]);
  return { lyrics, artwork_url };
}
