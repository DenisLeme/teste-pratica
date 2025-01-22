import React from "react";
import './styles.css'
interface ItemListProps {
  title: string;
  onClick: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ title, onClick }) => {
  return (
    <div className="item-list">
      <h2 onClick={onClick} >
        {title}
      </h2>
      <hr/>
    </div>
  );
};

export default ItemList;
