import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';
import { movies } from '../data/movies.js';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  const results = query
    ? movies.filter((movie) =>
        `${movie.title} ${movie.originalTitle}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : [];

  return (
    <section className="page-shell">
      <span className="eyebrow">SEARCH</span>
      <h1 className="page-title">Результаты поиска</h1>

      <p className="page-description">
        {query
          ? `По запросу «${query}» найдено: ${results.length}`
          : 'Введите название фильма в поиске сверху.'}
      </p>

      <div className="movie-grid">
        {results.length > 0 ? (
          results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <div className="empty-search">
            {query ? 'Ничего не найдено.' : 'Здесь появятся результаты поиска.'}
          </div>
        )}
      </div>
    </section>
  );
}
