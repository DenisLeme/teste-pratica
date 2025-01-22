import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header/index.tsx';
import ItemList from '../../components/ItemList/index.tsx';
import './styles.css';

interface Repo {
  owner: string;
  name: string;
  description: string;
  languages: Record<string, number>;
  updated_at: string;
}

const Favoritos: React.FC = () => {
  const [favorites, setFavorites] = useState<Repo[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  return (
    <div className="Favorites">
      <Header />
      <div className="info">
        <h1 className="repositorio">Repositórios Favoritos</h1>
        <div className="conteudo">
          {favorites.length > 0 ? (
            favorites.map((repo, index) => (
              <ItemList
                key={index}
                title={repo.name}
                onClick={() => console.log('Navegar para o repositório', repo)}
              />
            ))
          ) : (
            <p>Você ainda não favoritou nenhum repositório.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favoritos;
