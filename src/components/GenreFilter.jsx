import { Link } from 'react-router-dom';

export default function GenreFilter({ genres }) {
  return (
    <div className="genres">
      {genres.map((genre) => (
        <Link
          key={genre.id || 'all'}
          to={genre.id ? `/movies?genre=${genre.id}` : '/movies'}
          className="genre-btn"
        >
          {genre.label}
        </Link>
      ))}
    </div>
  );
}
