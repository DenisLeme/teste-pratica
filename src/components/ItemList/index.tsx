
import './styles.css';

import React from 'react';

interface ItemListProps {
  title: string;
  description: string;
  languages?: string;
  updatedAt: string;
  owner: string;
}

const ItemList: React.FC<ItemListProps> = ({ title, description, languages, updatedAt , owner}) => {
  return (
    <div className="item-list">
      <h2>{title}</h2>
      <p>{description}</p>
      {languages && <p><strong>Linguagens:</strong> {languages}</p>}
      <p><strong>Ultima Atualização:</strong> {updatedAt}</p>
      <p><strong>Dono do repositorio:</strong> {owner}</p> 

      <hr />
    </div>
  );
};

export default ItemList;
