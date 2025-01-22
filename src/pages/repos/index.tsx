import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/index.tsx';
import './styles.css';
import ItemList from '../../components/ItemList/index.tsx';

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

const Repos: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Dados do usuário
  const [repos, setRepos] = useState<Repo[] | null>(null); // Repositórios
  const [currentPage, setCurrentPage] = useState<number>(1); // Página atual
  const itemsPerPage = 10; // Itens por página

  const navigate = useNavigate();

  // Função que busca os dados do usuário e repositórios
  const handleGetData = async () => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;

    try {
      const userData = await fetch(`https://api.github.com/users/DenisLeme`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const newUser = await userData.json();

      if (newUser.name) {
        const { avatar_url, name, bio } = newUser;
        setCurrentUser({ avatar_url, name, bio });

        const reposData = await fetch(`https://api.github.com/users/DenisLeme/repos`, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        const newRepos = await reposData.json();

        const reposWithDetails = await Promise.all(
          newRepos.map(async (repo) => {
            const languagesData = await fetch(
              `https://api.github.com/repos/DenisLeme/${repo.name}/languages`,
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
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  // Calcula o total de páginas com base na quantidade de repositórios
  const totalPages = repos ? Math.ceil(repos.length / itemsPerPage) : 1;

  // Pega os repositórios para a página atual
  const currentRepos = repos
    ? repos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  // Carrega os dados assim que o componente é montado
  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className="Home">
      <Header />
      <div>
        <div className="info">
          {/* Exibindo informações do usuário */}
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
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          )}

          {/* Exibindo os repositórios */}
          {repos?.length && (
            <>
              <h1 className="repositorio">Repositórios</h1>
              <div className="conteudo">
                {currentRepos.map((repo, index) => (
                  <ItemList
                    key={index}
                    title={repo.name}
                    onClick={() => navigate(`/repo/${repo.name}`, { state: { repo } })}
                  />
                ))}
              </div>
              {/* Paginação */}
              <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
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

export default Repos;
