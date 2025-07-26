'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './SongList.module.css';

export default function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      const res = await fetch('/api/songs', { cache: 'no-store' });
      const data = await res.json();
      setSongs(data);
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this song?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/songs/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setSongs(prevSongs => prevSongs.filter(song => song._id !== id));
    } catch (err) {
      console.error('Error deleting song:', err);
      alert('Failed to delete song');
    }
  };

  if (loading) return <p className={styles.loading}>Loading songs...</p>;

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <h1 className={styles.heading}>🎵 All Songs</h1>
        <ul className={styles.songList}>
          {songs.map((song, index) => (
            <li key={song._id} style={{ '--i': index }}>
              <Link href={`/songs/${song._id}`}>
                {song.title} - {song.artist}
              </Link>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(song._id)}
                aria-label="Delete song"
                title="Delete this song"
              >
                ⋮
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
