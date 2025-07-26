// pages/songs/[id].js
import Image from 'next/image';
export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/songs/${params.id}`);
  const song = await res.json();

  return { props: { song } };
}

export default function SongDetail({ song }) {
  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: 'auto' }}>
      <h2>{song.title} — {song.artist}</h2>
      {song.artwork_url && (
        <Image
          src={song.artwork_url}
          alt="Album cover"
          width={350}
          height={350}
          style={{ borderRadius: 12 }}
        />
      )}
      <p><strong>Album:</strong> {song.album || '—'}</p>
      <p><strong>Genre:</strong> {song.genre || '—'}</p>
      <pre style={{
        background: '#f9f9f9',
        padding: '1rem',
        borderRadius: '8px',
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap'
      }}>
        {song.lyrics || 'Lyrics not found'}
      </pre>
    </div>
  );
}
