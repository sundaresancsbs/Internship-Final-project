'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from "./Home.module.css";

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isMounted = useRef(true);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a song title');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to find the song in our database
      const searchRes = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
      
      if (!isMounted.current) return;
      
      if (searchRes.ok) {
        const data = await searchRes.json();
        if (data.length > 0) {
          // If found in database, redirect to the song page
          router.push(`/songs/${data[0]._id}`);
          return;
        }
      }
      
      // If not found in database, search Musixmatch
      const lyricsRes = await fetch(`/api/lyrics?title=${encodeURIComponent(query)}`);
      
      if (!isMounted.current) return;
      
      const data = await lyricsRes.json();
      
      if (!lyricsRes.ok) {
        // Handle API error response
        throw new Error(data.message || 'Failed to fetch lyrics');
      }
      
      if (!data.success) {
        // Handle business logic error (e.g., no lyrics found)
        throw new Error(data.message || 'No lyrics found for this song');
      }
      
      // Create a new song entry with the lyrics
      const newSongRes = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title || query,
          lyrics: data.lyrics,
          artist: data.artist || '',
          album: data.album || '',
          coverUrl: data.artwork_url || '/logo.png',
        }),
      });
      
      if (!isMounted.current) return;
      
      if (!newSongRes.ok) {
        const errorData = await newSongRes.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save song');
      }
      
      const newSong = await newSongRes.json();
      
      if (!isMounted.current) return;
      
      router.push(`/songs/${newSong._id}`);
      
    } catch (error) {
      if (isMounted.current) {
        console.error('Search error:', error);
        // Show user-friendly error message
        setError(error.message || 'An error occurred while searching for lyrics. Please try again.');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎵 Song Lyrics Collector</h1>
      <p className={styles.subtitle}>
        Search, collect, and explore your favorite song lyrics.
      </p>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError(null);
            }}
            placeholder="Search for a song..."
            className={`${styles.searchInput} ${error ? styles.error : ''}`}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={`${styles.searchButton} ${isLoading ? styles.searchButtonLoading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </form>

      <div className={styles.buttonContainer}>
        <Link href="/songs" className={styles.link}>
          <button className={styles.button}>📜 View All Lyrics</button>
        </Link>
        <Link href="/add" className={styles.link}>
          <button className={`${styles.button} ${styles.buttonGreen}`}>➕ Add New Lyrics</button>
        </Link>
      </div>

      <footer className={styles.footer}>
        <p>Search for any song to find its lyrics instantly!</p>
      </footer>
    </div>
  );
}
