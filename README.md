Лабораторная работа: React Router
Входные файлы
Вам выдаётся приложение «MovieBox» — каталог фильмов:

Часть 1. Настройка проекта
Создайте новое React-приложение (Vite+React+JS+ESLint).
Установите react-router-dom.
Важно:

маршрут <Route path="*"> должен идти в дереве последним — React Router проверяет роуты по порядку, и более широкий маршрут, объявленный раньше, перехватит на себя всё, что должно было попасть в 404;
фильтр каталога и поисковый запрос должны жить только в URL — не заводите под них useState, если уже читаете значение через useSearchParams() (иначе получите два источника истины, которые могут разойтись);
ссылки на внутренние страницы приложения — всегда через <Link> / <NavLink>, обычный <a href="..."> вызовет полную перезагрузку страницы.
Требования к оформлению кода
Никакой навигации через window.location.href = ... — переходы только через <Link>, <NavLink> или useNavigate().
У каждого элемента списка есть key, построенный на основе id товара, а не на основе индекса массива.
Значения useParams() и useSearchParams() нигде не копируются в useState «на всякий случай» — читаются напрямую там, где нужны.
Как сдавать
Создайте форк репозитория в вашей организации с названием-этого-репозитория-вашафамилия
Используя ветку wip сделайте задание
Зафиксируйте изменения в вашем репозитории
Захостите работу
Когда документ будет готов - создайте пул реквест из ветки wip (вашей) на ветку main (тоже вашу) и укажите меня (ktkv419) как reviewer
Не мержите сами коммит, это сделаю я после проверки задания

Памятка
react-router-dom
Установка и <BrowserRouter>
npm install react-router-dom
Всё приложение оборачивается в <BrowserRouter> один раз, в точке входа — это то, что вообще даёт компонентам доступ к текущему URL и позволяет его менять без перезагрузки страницы.

// main.jsx
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
<Routes> и <Route>
Внутри <Routes> каждый <Route> сопоставляет путь (path) с компонентом (element). React Router сам решает, какой из них показать, основываясь на текущем URL — вручную сравнивать currentPage === 'catalog' через if или switch больше не нужно.

// App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactsPage from './pages/ContactsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:id" element={<ProductPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
Вложенные роуты и <Outlet />
Роут <Route path="/" element={<Layout />}> с вложенными роутами внутри — это способ сказать «у всех этих страниц общий каркас» (шапка сайта, навигация). Layout рендерит этот каркас один раз, а на месте <Outlet /> React Router сам подставляет ту вложенную страницу, которая сейчас соответствует URL.

// components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-area">
        <Outlet />
      </main>
    </>
  );
}
Index route
<Route index element={<HomePage />} /> — это то, что показывается по умолчанию для родительского пути (/), когда после него ничего не указано. Без index пришлось бы отдельно прописывать path="".

<Link> и <NavLink>
<Link> — это <a>, который не перезагружает страницу при клике, а меняет URL через историю браузера. <NavLink> — то же самое, но умеет сам подсвечивать себя, если его to совпадает с текущим путём — раньше это приходилось делать вручную через сравнение currentPage === page.

// components/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/catalog/${product.id}`} className="product-card">
      <div className="product-swatch" style={{ background: product.color }}>
        {product.name[0]}
      </div>
      <div className="product-body">
        <p className="product-name">{product.name}</p>
        <div className="product-price">{product.price} ₽</div>
      </div>
    </Link>
  );
}
// components/Header.jsx (фрагмент)
import { NavLink } from 'react-router-dom';

<nav className="main-nav">
  <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
    Главная
  </NavLink>
  <NavLink to="/catalog" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
    Каталог
  </NavLink>
</nav>
className здесь — функция, а не строка: React Router сам вызывает её и передаёт { isActive }, зная, активен сейчас этот пункт меню или нет. Проп end у NavLink to="/" нужен, чтобы главная не подсвечивалась заодно на всех остальных страницах (без него React Router считает совпадением любой путь, который просто начинается с /).

Динамический сегмент и useParams()
Часть пути можно объявить переменной через двоеточие: catalog/:id. Тогда внутри компонента, который рендерится на этом маршруте, useParams() вернёт объект с этим значением, взятым прямо из текущего URL.

// pages/ProductPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { products, labelForCategory } from '../data/products.js';

export default function ProductPage() {
  const { id } = useParams(); // например, "monstera" из /catalog/monstera
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="not-found-inline">Такого растения нет в каталоге.</div>;
  }

  return (
    <section className="page-shell">
      <div className="product-detail">
        <div className="detail-swatch" style={{ background: product.color }}>
          {product.name[0]}
        </div>
        <div className="detail-body">
          <p className="detail-name">{product.name}</p>
          <p className="detail-cat">{labelForCategory(product.category)}</p>
          <div className="detail-price">{product.price} ₽</div>
          <p className="detail-desc">{product.description}</p>
          <button type="button" className="btn ghost" onClick={() => navigate(-1)}>
            ← Назад
          </button>
        </div>
      </div>
    </section>
  );
}
useNavigate()
Нужен, когда переход должен произойти не по клику на конкретную ссылку, а по какому-то событию: после нажатия Enter в поиске, после успешной отправки формы, для кнопки «Назад» (navigate(-1) — на один шаг назад в истории, как кнопка браузера).

// components/Header.jsx (фрагмент)
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate('/search?q=' + encodeURIComponent(e.target.value.trim()));
      e.target.value = '';
    }
  }

  return (
    <div className="header-search">
      <input type="text" placeholder="Найти растение..." onKeyDown={handleSearchKeyDown} />
    </div>
  );
}
<Route path="*"> — страница 404
Роут с путём * совпадает с абсолютно любым URL, который не подошёл ни одному из предыдущих <Route>. Порядок объявления важен: React Router проверяет маршруты по порядку и * почти всегда должен идти последним.

// pages/NotFoundPage.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import StatusBlock from '../components/StatusBlock.jsx';

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <StatusBlock
      emoji="🍂"
      title="Такой страницы нет"
      subtitle={`Путь "${location.pathname}" не совпал ни с одним маршрутом.`}
      actionLabel="Вернуться на главную"
      onAction={() => navigate('/')}
    />
  );
}
useLocation() возвращает объект с текущим адресом (pathname, search, hash) — здесь он нужен только для того, чтобы показать пользователю, по какому именно пути он попал на 404.

Пример: фильтр и поиск через URL (useSearchParams)
В отличие от обычного useState, значение из useSearchParams() живёт прямо в адресной строке (?category=succulents, ?q=монстера). Это значит: обновление страницы не сбрасывает фильтр, а ссылку с результатами поиска можно скопировать и отправить кому-то — она откроется в том же состоянии.

Общая логика та же, что и с обычным state контролируемой формы, просто источник значения — не useState, а сам URL:

Читаем текущее значение параметра через useSearchParams().
При изменении (клик по чипу, ввод в поле) вызываем setSearchParams(...) — React Router сам обновит адресную строку.
Список отфильтровывается на основе этого значения при каждом рендере, как обычный .filter().
Кнопки-фильтры и сам фильтр значения — в одном компоненте, у него есть доступ и на чтение, и на запись:

// components/CategoryFilter.jsx
import { useSearchParams } from 'react-router-dom';

export default function CategoryFilter({ categories }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  function handleSelect(categoryId) {
    setSearchParams(categoryId ? { category: categoryId } : {});
  }

  return (
    <div className="filter-row">
      {categories.map(cat => (
        <button
          key={cat.id || 'all'}
          type="button"
          className={'filter-chip' + (cat.id === activeCategory ? ' active' : '')}
          onClick={() => handleSelect(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
Страница каталога только читает параметр — фильтрует массив и рендерит результат, ничего не зная о том, откуда взялось значение category:

// pages/CatalogPage.jsx
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import { products, categories } from '../data/products.js';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  const visibleProducts = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products;

  return (
    <section className="page-shell">
      <CategoryFilter categories={categories} />
      <div className="product-grid">
        {visibleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
Страница поиска устроена так же, только параметр называется q и приходит не от чипов, а из поля в шапке (Header.jsx выше, через navigate):

// pages/SearchPage.jsx
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { products } from '../data/products.js';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  const results = query
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <section className="page-shell">
      <p className="page-sub">
        {query ? `Запрос из URL: "?q=${query}"` : 'Введите запрос в поиске сверху'}
      </p>
      <div className="product-grid">
        {results.length > 0 ? (
          results.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="empty-note">{query ? 'Ничего не найдено' : 'Начните вводить название растения'}</div>
        )}
      </div>
    </section>
  );
}