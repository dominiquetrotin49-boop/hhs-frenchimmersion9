import { NavLink } from 'react-router-dom';
import { chapters } from '../data/chapters';

function ChapterTabs() {
  return (
    <nav className="chapter-tabs">
      {chapters.map((chapter) => (
        <NavLink 
          key={chapter.id} 
          to={`/chapter/${chapter.id}`}
          className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}
        >
          <span>📘</span>
          <span>{chapter.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default ChapterTabs;
