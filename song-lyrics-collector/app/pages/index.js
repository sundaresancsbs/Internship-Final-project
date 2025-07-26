import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🎵 Song Lyrics Collector</h1>
      <p>Browse, Add, and Explore your favorite lyrics!</p>
      <Link href="/songs">Go to Song List</Link>
    </div>
  );
}
