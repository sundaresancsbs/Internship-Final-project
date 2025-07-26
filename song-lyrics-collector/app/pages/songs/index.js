// pages/songs/index.js
import { useState } from 'react';
import Link from 'next/link';

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/songs');
  const songs = await res.json();
  return { props: { songs } };
}

export default function SongList({ songs: initialSongs }) {
  const [songs, setSongs] = useState(initialSongs);

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this song?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/songs/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setSongs(songs.filter(song => song._id !== id));
    } else {
      alert('Failed to delete the song.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎵 All Songs</h1>
      <ul>
        {songs.map(song => (
          <li key={song._id} style={{ marginBottom: '10px' }}>
            <Link href={`/songs/${song._id}`}>
              {song.title} - {song.artist}
            </Link>
            <button
              onClick={() => handleDelete(song._id)}
              style={{
                marginLeft: '1rem',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
