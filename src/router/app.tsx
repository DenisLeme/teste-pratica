import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/index.tsx';
import RepoDetails from '../pages/details/index.tsx';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/repo/:repoName" element={<RepoDetails />} />
    </Routes>
  );
};

export default App;
