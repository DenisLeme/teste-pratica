
import './styles.css';

import React from 'react';

interface ItemListProps {
  title: string;
  description: string;
  languages?: string; // Opcional, caso algumas entradas não tenham linguagens
}

const ItemList: React.FC<ItemListProps> = ({ title, description, languages }) => {
  return (
    <div className="item-list">
      <h2>{title}</h2>
      <p>{description}</p>
      {languages && <p><strong>Linguagens:</strong> {languages}</p>}
      <hr/>
    </div>
  );
};

export default ItemList;
