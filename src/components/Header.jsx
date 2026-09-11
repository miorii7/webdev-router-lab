import { NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const query = event.currentTarget.elements.query.value.trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      event.currentTarget.reset();
    }
  }

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          <span className="logo-icon">▶</span>
          <span>MovieBox</span>
        </NavLink>

        <nav className="nav">
          <NavLink end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/">Главная</NavLink>
          <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/movies">Фильмы</NavLink>
          <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/about">О проекте</NavLink>
          <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/contacts">Контакты</NavLink>
        </nav>

        <form className="search" onSubmit={handleSubmit}>
          <span className="search-icon">⌕</span>
          <input name="query" placeholder="Поиск фильмов" />
        </form>
      </div>
    </header>
  );
}
