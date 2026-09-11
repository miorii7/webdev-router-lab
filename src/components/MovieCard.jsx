import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="poster" style={{ background: movie.color }}>
        <span className="poster-mark">{movie.title[0]}</span>
        <span className="poster-year">{movie.year}</span>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.genreLabel} · {movie.year}</p>
        <div className="rating">
          <span>★</span> {movie.rating}
        </div>
      </div>
    </Link>
  );
}
