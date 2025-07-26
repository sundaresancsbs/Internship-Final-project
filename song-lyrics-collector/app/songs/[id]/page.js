'use client';

import { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Lyrics.module.css';

export default function SongPage(props) {
  const params = use(props.params);
  const { id } = params;

  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const songRes = await fetch(`/api/songs/${id}`);
        if (!songRes.ok) throw new Error('Failed to fetch song details');

        const songData = await songRes.json();
        if (!isMounted.current) return;
        setSong(songData);

        const lyricsUrl = `/api/lyrics?title=${encodeURIComponent(songData.title)}&artist=${encodeURIComponent(songData.artist || '')}`;
        const lyricsRes = await fetch(lyricsUrl);
        const responseText = await lyricsRes.text();

        let lyricsData;
        try {
          lyricsData = JSON.parse(responseText);
        } catch (e) {
          lyricsData = {};
        }

        if (lyricsData.lyrics) {
          setLyrics(lyricsData.lyrics);
        } else if (songData.lyrics) {
          setLyrics(songData.lyrics);
        } else {
          setLyrics('Lyrics not available.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load song data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [id]);

  if (isLoading) return <div className={styles.loading}>Loading song...</div>;

if (error) {
  return (
    <div className={styles.errorContainer}>
      <p>{error}</p>
    </div>
  );
}

if (!isLoading && !song) {
  return (
    <div>
    
    </div>
  );
}

// ✅ Only render the full UI when song is guaranteed to exist
return (
  <div className={styles.spotifyContainer}>
    <div className={styles.albumArt}>
      <img
        src={song.coverUrl || '/logo.png'}
        alt={`${song.title} cover`}
        className={styles.albumImage}
      />
    </div>

    <div className={styles.songInfo}>
      <h1 className={styles.songTitle}>{song.title}</h1>
      {song.artist && <h2 className={styles.songArtist}>{song.artist}</h2>}
      {song.album && <p className={styles.songAlbum}>{song.album}</p>}

      <div className={styles.lyricsContainer}>
        <h3>Lyrics</h3>
        <div className={styles.lyricsContent}>
          {lyrics
            ? lyrics.split('\n').map((line, i) => (
                <p key={i} className={styles.lyricLine}>{line}</p>
              ))
            : <p className={styles.noLyrics}>No lyrics available for this song.</p>}
        </div>
      </div>
    </div>
  </div>
);
}
