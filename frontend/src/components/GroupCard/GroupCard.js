import { useHistory } from "react-router-dom";
import React from "react";
import "./GroupCard.css";


const MyGroupCard = ({ customGroup }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/groups/${customGroup.id}`);
  };

  return (
    <article className="custom-card" onClick={handleClick}>
      <div className="custom-card__image">
        <img src={customGroup.previewImage} alt='basketball'/>
      </div>
      <header className="custom-card__header">
        <h2 className="custom-card__title">{customGroup.name}</h2>
        <p className="custom-card__location">
          {customGroup.city}, {customGroup.state}
        </p>
        <p className="custom-card__about">{customGroup.about}</p>
        <div className="custom-card__footer">

          <span>•</span>
          <p>{customGroup.private ? "Private" : "Public"}</p>
        </div>
      </header>
    </article>
  );
};


export default MyGroupCard;
