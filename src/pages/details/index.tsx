import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css';

const RepoDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const repo = location.state?.repo;

  if (!repo) {
    return <div>Repositório não encontrado.</div>;
  }

  return (
    <div className="repo-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>Voltar</button>
      <div className="repo-details">
        <h1>{repo.name}</h1>
        <p><strong>Descrição:</strong> {repo.description || 'Nenhuma descrição disponível.'}</p>
        <p><strong>Linguagens:</strong> {Object.keys(repo.languages).join(', ') || 'Nenhuma linguagem detectada.'}</p>
        <p><strong>Última atualização:</strong> {new Date(repo.updated_at).toLocaleString()}</p>
        <p><strong>Dono do repositório:</strong> {repo.owner}</p>
      </div>
    </div>
  );
};

export default RepoDetails;
