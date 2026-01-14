import { Buffer } from 'buffer';

// Polyfill Buffer for gray-matter
window.Buffer = Buffer;
window.global = window;
window.process = { env: {} };

import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import matter from 'gray-matter';
import { Book, Menu, Search, ChevronRight, ExternalLink, Github, MessageCircle, Shield, Repeat, Landmark, Home as HomeIcon, Flower, Sun, Leaf, Snowflake, Sparkles, Wand2 } from 'lucide-react';
import SeasonalEffects from './components/SeasonalEffects';
import PRGenerator from './components/PRGenerator';

// Wikipedia Infobox Component
const Infobox = ({ data }) => {
  if (!data) return null;
  const { title, image, ...details } = data;

  return (
    <aside className="infobox">
      <div className="infobox-title">{title}</div>
      {image && (
        <div className="infobox-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="infobox-content">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="infobox-row">
            <div className="infobox-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div className="infobox-data">
              {typeof value === 'string' && value.startsWith('http') ? (
                <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
              ) : (
                String(value)
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

// Search Component
const SidebarSearch = ({ allPages, currentLang }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLucky, setIsLucky] = useState(false);
  const [isDisco, setIsDisco] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [isCreeper, setIsCreeper] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);

    // Playful triggers
    if (val.toLowerCase() === 'tnt') setIsShake(true);
    else setIsShake(false);

    if (val.toLowerCase() === 'disco') setIsDisco(true);
    else setIsDisco(false);

    if (val.toLowerCase() === 'creeper') setIsCreeper(true);
    else setIsCreeper(false);

    if (val.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = Object.keys(allPages)
      .filter(path => path.includes(`/${currentLang}/`))
      .map(path => {
        const id = path.split('/').pop().replace('.md', '');
        const { data, content } = matter(allPages[path]);
        const title = data.title || id;
        return { id, title, content };
      })
      .filter(page =>
        page.title.toLowerCase().includes(val.toLowerCase()) ||
        page.content.toLowerCase().includes(val.toLowerCase())
      )
      .slice(0, 5);

    setResults(filtered);
  };

  const handleLucky = () => {
    const pages = Object.keys(allPages)
      .filter(path => path.includes(`/${currentLang}/`))
      .map(path => path.split('/').pop().replace('.md', ''));

    if (pages.length > 0) {
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      navigate(`/${currentLang}/${randomPage}`);
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div className={`sidebar-search ${isShake ? 'shake' : ''}`}>
      <div className="search-input-container">
        {isCreeper ? (
          <div className="search-icon" style={{ color: '#00ff00', fontWeight: 'bold' }}>Sss...</div>
        ) : (
          <Search className="search-icon" size={16} />
        )}
        <input
          type="text"
          className={`search-input ${isDisco ? 'disco-text' : ''}`}
          style={isCreeper ? { border: '2px solid #00ff00' } : {}}
          placeholder={currentLang === 'ja' ? '検索...' : 'Search...'}
          value={query}
          onChange={handleSearch}
          onBlur={() => setTimeout(() => setResults([]), 200)}
        />
      </div>

      {query.trim() !== '' && (
        <div className="search-results-dropdown">
          {results.length > 0 ? (
            results.map(res => (
              <Link
                key={res.id}
                to={`/${currentLang}/${res.id}`}
                className="search-result-item"
                onClick={() => { setQuery(''); setResults([]); }}
              >
                <strong>{res.title}</strong>
                <span className="search-result-category">{res.id}</span>
              </Link>
            ))
          ) : (
            <div className="search-result-item" style={{ color: '#999', fontStyle: 'italic' }}>
              {currentLang === 'ja' ? '見つかりませんでした...' : 'No results found...'}
            </div>
          )}
        </div>
      )}

      <button className="lucky-btn" onClick={handleLucky}>
        <Sparkles size={14} />
        <span>{currentLang === 'ja' ? 'おまかせ表示' : "I'm Feeling Lucky"}</span>
      </button>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ pages, currentLang, season, setSeason, allPages }) => {
  const seasons = [
    { id: 'spring', icon: Flower, label_ja: '春', label_en: 'Spring' },
    { id: 'summer', icon: Sun, label_ja: '夏', label_en: 'Summer' },
    { id: 'autumn', icon: Leaf, label_ja: '秋', label_en: 'Autumn' },
    { id: 'winter', icon: Snowflake, label_ja: '冬', label_en: 'Winter' },
  ];

  return (
    <nav className="sidebar">
      <div className="wiki-logo">
        <Link to={`/${currentLang}/Home`}>
          <Book size={48} strokeWidth={1} color="#3366cc" />
          <div style={{ marginTop: '5px', fontWeight: 'bold', fontSize: '1.4rem' }}>
            <span>Marv</span><span style={{ fontWeight: 'normal' }}>Wiki</span>
          </div>
        </Link>
      </div>

      <SidebarSearch allPages={allPages} currentLang={currentLang} />

      <div className="nav-section">
        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Language
        </h3>
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', marginBottom: '10px' }}>
          <Link to={`/ja/Home`} style={{ fontWeight: currentLang === 'ja' ? 'bold' : 'normal' }}>日本語</Link>
          <span>|</span>
          <Link to={`/en/Home`} style={{ fontWeight: currentLang === 'en' ? 'bold' : 'normal' }}>English</Link>
        </div>
      </div>

      <div className="nav-section">
        <h3>{currentLang === 'ja' ? '案内' : 'Navigation'}</h3>
        <ul className="nav-links">
          <li>
            <Link to={`/${currentLang}/Home`}><HomeIcon size={14} style={{ marginRight: '5px' }} /> {currentLang === 'ja' ? 'メインページ' : 'Main page'}</Link>
          </li>
          <li>
            <Link to={`/${currentLang}/Getting-Started`}>{currentLang === 'ja' ? 'スタートガイド' : 'Getting Started'}</Link>
          </li>
          <li>
            <Link to={`/${currentLang}/Rules`}>{currentLang === 'ja' ? 'サーバー基本ルール' : 'Server Rules'}</Link>
          </li>
          <li>
            <Link to={`/${currentLang}/Plugin`}>{currentLang === 'ja' ? 'プラグイン・コマンド' : 'Plugins & Commands'}</Link>
          </li>
          <li>
            <Link to={`/${currentLang}/Terms-of-Service`}>{currentLang === 'ja' ? '利用規約' : 'Terms of Service'}</Link>
          </li>
          <li>
            <Link to={`/${currentLang}/Promotion`}>{currentLang === 'ja' ? '国街宣伝 (Wiki版)' : 'Nation & Town Promotion'}</Link>
          </li>
        </ul>
      </div>

      <div className="nav-section">
        <h3>{currentLang === 'ja' ? 'コンテンツ' : 'Contents'}</h3>
        <ul className="nav-links">
          {pages.map(page => (
            <li key={page.id}>
              <Link to={`/${currentLang}/${page.id}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-section">
        <h3>{currentLang === 'ja' ? 'Web連携サービス' : 'Web Services'}</h3>
        <ul className="nav-links">
          <li><a href="https://auth.marvgame.com/" target="_blank" rel="noopener noreferrer"><Shield size={14} style={{ marginRight: '5px' }} /> Account Center</a></li>
          <li><a href="https://cryper.marvgame.com/" target="_blank" rel="noopener noreferrer"><Repeat size={14} style={{ marginRight: '5px' }} /> Cryper Exchange</a></li>
          <li><a href="https://bank.marvgame.com/" target="_blank" rel="noopener noreferrer"><Landmark size={14} style={{ marginRight: '5px' }} /> Central Bank</a></li>
        </ul>
      </div>

      <div className="nav-section">
        <h3>{currentLang === 'ja' ? '外部リンク' : 'External Links'}</h3>
        <ul className="nav-links">
          <li><a href="https://discord.gg/NfYyMnTfj3" target="_blank" rel="noopener noreferrer"><MessageCircle size={14} style={{ marginRight: '5px' }} /> {currentLang === 'ja' ? 'Discord' : 'Discord'}</a></li>
          <li><a href="https://discord.com/channels/1245921816959127673/1443877434561663058" target="_blank" rel="noopener noreferrer"><MessageCircle size={14} style={{ marginRight: '5px' }} /> {currentLang === 'ja' ? '国街宣伝' : 'Nation & Town Promotion'}</a></li>
          <li><a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github size={14} style={{ marginRight: '5px' }} /> GitHub Source</a></li>
        </ul>
      </div>

      <div className="nav-section">
        <h3>{currentLang === 'ja' ? '季節のエフェクト' : 'Seasonal Effects'}</h3>
        <div className="season-selector">
          {seasons.map(s => (
            <button
              key={s.id}
              className={`season-btn ${s.id} ${season === s.id ? 'active' : ''}`}
              onClick={() => setSeason(season === s.id ? null : s.id)}
              title={currentLang === 'ja' ? s.label_ja : s.label_en}
            >
              <s.icon size={20} />
              <span>{currentLang === 'ja' ? s.label_ja : s.label_en}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Table of Contents Component
const TOC = ({ content }) => {
  // Simple regex to find h2 headers
  const headers = content.match(/^##\s+(.*)/gm) || [];
  if (headers.length === 0) return null;

  return (
    <nav className="toc">
      <div className="toc-title">Contents</div>
      <ul className="toc-links">
        {headers.map((h, i) => {
          const title = h.replace(/^##\s+/, '');
          const id = title.toLowerCase().replace(/\s+/g, '-');
          return (
            <li key={i} className="toc-item">
              <span className="toc-number">{i + 1}</span>
              <a href={`#${id}`}>{title}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// Main Page Component
const WikiPage = ({ allPages }) => {
  const { lang = 'ja', id = 'Home' } = useParams();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = () => {
      setLoading(true);
      try {
        // Find the page in the globbed contents for the current language
        const pageKey = Object.keys(allPages).find(key => key.includes(`/${lang}/`) && key.endsWith(`${id}.md`));
        if (pageKey) {
          const text = allPages[pageKey];
          const { data, content: mdContent } = matter(text);
          setMetadata(data);

          // Custom renderer to add IDs to headers for TOC
          const renderer = new marked.Renderer();
          renderer.heading = ({ text, depth: level }) => {
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            if (level === 2) {
              return `<h${level} id="${id}">${text}</h${level}>`;
            }
            return `<h${level}>${text}</h${level}>`;
          };

          const rawHtml = marked.parse(mdContent, { renderer });
          setContent(DOMPurify.sanitize(rawHtml));
        } else {
          setContent('<h1>Page not found</h1><p>The page you are looking for does not exist.</p>');
        }
      } catch (err) {
        console.error(err);
        setContent('<h1>Error</h1><p>Failed to load the page content.</p>');
      }
      setLoading(false);
    };

    loadPage();
  }, [id, allPages, lang]);

  if (loading) return <div className="main-content">Loading...</div>;

  return (
    <main className="main-content">
      <div className="article-header">
        <h1>{metadata?.title || id.replace(/-/g, ' ')}</h1>
        <div style={{ fontSize: '0.8rem', color: '#54595d', borderBottom: '1px solid #a2a9b1', paddingBottom: '2px', marginBottom: '1rem' }}>
          From MarvWiki, the free Minecraft server encyclopedia
        </div>
      </div>

      <Infobox data={metadata} />

      {content && <TOC content={content} />}

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {metadata?.categories && (
        <div style={{ marginTop: '2rem', border: '1px solid #a2a9b1', background: '#f8f9fa', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <strong>{lang === 'ja' ? 'カテゴリ' : 'Categories'}</strong>: {metadata.categories.map((cat, i) => (
            <React.Fragment key={cat}>
              {i > 0 && ' | '}
              <Link to={`/${lang}/category/${cat}`}>{cat}</Link>
            </React.Fragment>
          ))}
        </div>
      )}

      {id === 'Promotion' && <PRGenerator lang={lang} />}
    </main>
  );
};

// Category Page Component
const CategoryPage = ({ allPages }) => {
  const { lang = 'ja', catName } = useParams();

  const pages = useMemo(() => {
    return Object.keys(allPages).filter(key => key.includes(`/${lang}/`)).filter(key => {
      const { data } = matter(allPages[key]);
      return data.categories && data.categories.includes(catName);
    }).map(key => {
      const id = key.split('/').pop().replace('.md', '');
      const { data } = matter(allPages[key]);
      return { id, title: data.title || id };
    });
  }, [catName, allPages, lang]);

  return (
    <main className="main-content">
      <div className="article-header">
        <h1>Category: {catName}</h1>
        <div style={{ fontSize: '0.8rem', color: '#54595d', borderBottom: '1px solid #a2a9b1', paddingBottom: '2px', marginBottom: '1rem' }}>
          Articles in this category
        </div>
      </div>

      <p>This category contains the following {pages.length} pages.</p>

      <ul style={{ marginTop: '1rem', listStyle: 'square', marginLeft: '2rem' }}>
        {pages.map(page => (
          <li key={page.id} style={{ marginBottom: '5px' }}>
            <Link to={`/${lang}/${page.id}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

// Component to handle redirection from root
const RootRedirect = () => {
  const userLang = navigator.language.startsWith('ja') ? 'ja' : 'en';
  return <Navigate to={`/${userLang}/Home`} replace />;
};

function App() {
  // Use Vite's glob import to get all md files as RAW text recursively
  const contentFiles = import.meta.glob('./content/**/*.md', { query: '?raw', import: 'default', eager: true });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:lang/*" element={<AppLayout allPages={contentFiles} />} />
      </Routes>
    </Router>
  );
}

const AppLayout = ({ allPages }) => {
  const { lang = 'ja' } = useParams();
  const [season, setSeason] = useState(null);

  const pages = useMemo(() => {
    return Object.keys(allPages).filter(key => key.includes(`/${lang}/`)).map(path => {
      const id = path.split('/').pop().replace('.md', '');
      const { data } = matter(allPages[path]);
      return { id, title: data.title || id };
    });
  }, [lang, allPages]);

  return (
    <div className="app-container">
      <SeasonalEffects season={season} />
      <Sidebar pages={pages} currentLang={lang} season={season} setSeason={setSeason} allPages={allPages} />
      <Routes>
        <Route path="category/:catName" element={<CategoryPage allPages={allPages} />} />
        <Route path=":id" element={<WikiPage allPages={allPages} />} />
        <Route path="" element={<WikiPage allPages={allPages} />} />
      </Routes>
    </div>
  );
};

export default App;
