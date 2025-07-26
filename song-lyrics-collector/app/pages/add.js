import { useState } from 'react';
import { useRouter } from 'next/router';

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
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2>Add a New Song</h2>
      <input name="title" placeholder="Title" onChange={handleChange} required /><br/>
      <input name="artist" placeholder="Artist" onChange={handleChange} required /><br/>
      <input name="album" placeholder="Album" onChange={handleChange} /><br/>
      <input name="genre" placeholder="Genre" onChange={handleChange} /><br/>
      <textarea name="lyrics" placeholder="Lyrics..." onChange={handleChange} required /><br/>
      <button type="submit">Add Song</button>
    </form>
  );
}
