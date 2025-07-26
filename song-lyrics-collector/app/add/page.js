'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AddSong.module.css'; // ✅ Import your CSS module

export default function AddSong() {
  const [form, setForm] = useState({ title: '', artist: '', album: '', genre: '', lyrics: '' });
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) router.push('/songs');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <h2>Add a New Song</h2>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="artist" placeholder="Artist" onChange={handleChange} required />
        <input name="album" placeholder="Album" onChange={handleChange} />
        <input name="genre" placeholder="Genre" onChange={handleChange} />
        <textarea name="lyrics" placeholder="Lyrics..." onChange={handleChange} required />
        <button type="submit">Add Song</button>
      </form>
    </div>
  );
}
