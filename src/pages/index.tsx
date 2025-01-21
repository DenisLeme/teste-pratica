import React, { useState } from 'react';
import { Header } from '../components/Header/index.tsx';
import './styles.css';
import ItemList from '../components/ItemList/index.tsx';

interface User {
  avatar_url: string;
  name: string;
  bio: string;
}

interface Repo {
  languages(languages: any): unknown;
  name: string;
  description: string;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[] | null>(null);

  const handleGetData = async () => {
    const token = process.env.REACT_APP_GITHUB_TOKEN; // Substitua pelo seu token
  
    try {
      // Busca informações do usuário
      const userData = await fetch(`https://api.github.com/users/${user}`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const newUser = await userData.json();
  
      if (newUser.name) {
        const { avatar_url, name, bio } = newUser;
        setCurrentUser({ avatar_url, name, bio });
  
        // Busca os repositórios do usuário
        const reposData = await fetch(
          `https://api.github.com/users/${user}/repos`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          }
        );
        const newRepos: Repo[] = await reposData.json();
  
        if (newRepos.length) {
          // Busca as linguagens para cada repositório
          const reposWithLanguages = await Promise.all(
            newRepos.map(async (repo) => {
              const languagesData = await fetch(
                `https://api.github.com/repos/${user}/${repo.name}/languages`,
                {
                  headers: {
                    Authorization: `token ${token}`,
                  },
                }
              );
              const languages = await languagesData.json();
  
              return {
                ...repo,
                languages, // Adiciona as linguagens ao repositório
              };
            })
          );
  
          setRepos(reposWithLanguages);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };
  


  return (
    <div className="Home">
      <Header />
      <div>
        <div className="info">
          <div>
            <input
              name="usuario"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              placeholder="@username"
            />
            <button onClick={handleGetData}>Procurar</button>
          </div>
          {currentUser?.name ? (
            <>
              <div className="perfil">
                <img
                  src={currentUser.avatar_url}
                  className="profile"
                  alt="imagem de perfil"
                />
                <div>
                  <h3>{currentUser.name}</h3>
                  <span>@{user}</span>
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          ) : null}

          {repos?.length ? (
            <div>
              <h1 className="repositorio">Repositórios</h1>
              {repos.map((repo, index) => (
                <ItemList
                  key={index}
                  title={repo.name}
                  description={repo.description}
                  languages={Object.keys(repo.languages).join(', ')} // Converte as linguagens para string
                />
              ))}
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
};

export default Home;
