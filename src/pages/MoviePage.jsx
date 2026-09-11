import { useNavigate, useParams } from 'react-router-dom';
import { getMovieById } from '../data/movies.js';

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id);

  if (!movie) {
    return <div className="inline-error">Фильм не найден.</div>;
  }

  return (
    <section className="page-shell">
      <div className="movie-detail">
        <div className="detail-poster" style={{ background: movie.color }}>
          <span>{movie.title[0]}</span>
          <small>{movie.year}</small>
        </div>

        <div className="detail-content">
          <span className="eyebrow">{movie.genreLabel.toUpperCase()}</span>
          <h1>{movie.title}</h1>
          <p className="original-title">{movie.originalTitle}</p>

          <div className="movie-meta">
            <span>★ {movie.rating}</span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
          </div>

          <p className="description">{movie.description}</p>

          <div className="director">
            <span>Режиссёр</span>
            <strong>{movie.director}</strong>
          </div>

          <button className="secondary-btn" type="button" onClick={() => navigate(-1)}>
            ← Назад
          </button>
        </div>
      </div>
    </section>
  );
}
