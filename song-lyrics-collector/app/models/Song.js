import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  genre: String,
  lyrics: String,
  createdAt: { type: Date, default: Date.now }
  
});

export default mongoose.models.Song || mongoose.model("Song", SongSchema);
