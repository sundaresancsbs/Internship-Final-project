// app/songs/[id]/page.js
import styles from "./Lyrics.module.css";

export default async function SongPage({ params }) {
  const res = await fetch(`http://localhost:3000/api/songs/${params.id}`);
  const song = await res.json();

  return (
    <div>
      {/* Render your song details here */}
      <h1>{song.title}</h1>
      <p>{song.lyrics}</p>
    </div>
  );
}
