import React from 'react';
import { Link } from 'react-router-dom'; 
import './style.css';

const Header = () => {
  return (
    <header>
      <h1>GitHub Explorer</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Procure por alguém no GitHub</Link>
          </li>
          <li>
            <Link to="/repos">Meus Repositórios</Link>
          </li>
          <li>
            <Link to="/favoritos">Meus Favoritos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export { Header }
