import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import matter from 'gray-matter';
import { Book, Menu, Search, ChevronRight, ExternalLink, Github, MessageCircle, Shield, Repeat, Landmark, Home as HomeIcon } from 'lucide-react';
import { Buffer } from 'buffer';

// Polyfill Buffer for gray-matter
window.Buffer = Buffer;

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

// Sidebar Component
const Sidebar = ({ pages, currentLang }) => {
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
          <li><a href="https://discord.gg/NfYyMnTfj3" target="_blank" rel="noopener noreferrer"><MessageCircle size={14} style={{ marginRight: '5px' }} /> Discord</a></li>
          <li><a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github size={14} style={{ marginRight: '5px' }} /> GitHub Source</a></li>
        </ul>
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
    <Router basename="/marv-wiki">
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:lang/*" element={<AppLayout allPages={contentFiles} />} />
      </Routes>
    </Router>
  );
}

const AppLayout = ({ allPages }) => {
  const { lang = 'ja' } = useParams();

  const pages = useMemo(() => {
    return Object.keys(allPages).filter(key => key.includes(`/${lang}/`)).map(path => {
      const id = path.split('/').pop().replace('.md', '');
      const { data } = matter(allPages[path]);
      return { id, title: data.title || id };
    });
  }, [lang, allPages]);

  return (
    <div className="app-container">
      <Sidebar pages={pages} currentLang={lang} />
      <Routes>
        <Route path="category/:catName" element={<CategoryPage allPages={allPages} />} />
        <Route path=":id" element={<WikiPage allPages={allPages} />} />
        <Route path="" element={<WikiPage allPages={allPages} />} />
      </Routes>
    </div>
  );
};

export default App;