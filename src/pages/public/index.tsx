import React, { useState, useEffect, useCallback } from 'react'; // useCallback foi importado
import { Header } from '../../components/Header/index.tsx';
import { useNavigate } from 'react-router-dom';
import ItemList from '../../components/ItemList/index.tsx';

interface Repo { 
    owner: {
      login: string;
    };
    name: string;
    description: string;
    languages: Record<string, number>;
    updated_at: string;
  }
const Public: React.FC = () => {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRepos, setTotalRepos] = useState<number>(0);
  const itemsPerPage = 30;
  const navigate = useNavigate();

  const handleGetData = useCallback(async () => { 
    const token = process.env.REACT_APP_GITHUB_TOKEN;

    try {
      const reposData = await fetch(
        `https://api.github.com/repositories?per_page=${itemsPerPage}&page=${currentPage}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      const newRepos = await reposData.json();

      const reposWithDetails = await Promise.all(
        newRepos.map(async (repo) => {
          const languagesData = await fetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`,
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

      const linkHeader = reposData.headers.get('Link');
      if (linkHeader) {
        const matches = linkHeader.match(/&page=(\d+)>; rel="last"/);
        if (matches && matches[1]) {
          setTotalRepos(Number(matches[1]) * itemsPerPage);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  }, [currentPage]); 

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const totalPages = Math.ceil(totalRepos / itemsPerPage);
  const currentRepos = repos
    ? repos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  return (
    <div className="Home">
      <Header />
      <div>
        <div className="info">
          {repos?.length && (
            <>
              <h1 className="repositorio">Repositórios Públicos</h1>
              <div className="conteudo">
                {currentRepos.map((repo, index) => (
                  <ItemList
                    key={index}
                    title={repo.name}
                    onClick={() => navigate(`/repo/${repo.name}`, { state: { repo } })}
                  />
                ))}
              </div>

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

export default Public;
