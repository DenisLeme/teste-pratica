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
  owner: string;
  name: string;
  description: string;
  languages: Record<string, number>;
  updated_at: string;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const handleGetData = async () => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;

    try {
      const userData = await fetch(`https://api.github.com/users/${user}`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const newUser = await userData.json();

      if (newUser.name) {
        const { avatar_url, name, bio } = newUser;
        setCurrentUser({ avatar_url, name, bio });

        const reposData = await fetch(`https://api.github.com/users/${user}/repos`, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        const newRepos = await reposData.json();

        if (newRepos.length) {
          const reposWithDetails = await Promise.all(
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
                languages,
                updated_at: repo.updated_at,
                owner: repo.owner.login,
              };
            })
          );

          setRepos(reposWithDetails);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  const totalPages = repos ? Math.ceil(repos.length / itemsPerPage) : 1;

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentRepos = repos
    ? repos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

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
          {currentUser?.name && (
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
          )}

          {repos?.length && (
            <>
              <h1 className="repositorio">Repositórios</h1>
              <div className="conteudo">
                {currentRepos.map((repo, index) => (
                  <ItemList
                    key={index}
                    title={repo.name}
                    onClick={() => setSelectedRepo(repo)}
                  />
                ))}

                {selectedRepo && (
                  <div className="repo-details">
                    <h2>{selectedRepo.name}</h2>
                    <p><strong>Descrição:</strong> {selectedRepo.description}</p>
                    <p><strong>Linguagens:</strong> {Object.keys(selectedRepo.languages).join(', ')}</p>
                    <p><strong>Última atualização:</strong> {new Date(selectedRepo.updated_at).toLocaleString()}</p>
                    <p><strong>Dono do repositório:</strong> {selectedRepo.owner}</p>
                    <button onClick={() => setSelectedRepo(null)}>Fechar</button>
                  </div>
                )}
              </div>

              <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClick(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
