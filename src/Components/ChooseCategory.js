import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./ChooseCategory.css";

const categories = [
  { id: "tech", name: "Технологија", icon: "/category_images/tech.png" },
  { id: "career", name: "Кариeра", icon: "/category_images/career-path.png" },
  { id: "research", name: "Истражување", icon: "/category_images/innovation.png" },
  { id: "culture", name: "Култура", icon: "/category_images/workshop.png" },
  { id: "health", name: "Здравје", icon: "/category_images/medical.png" },
  { id: "sport", name: "Спорт", icon: "/category_images/sport.png" },
  { id: "edu", name: "Едукација", icon: "/category_images/education.png" },
  { id: "workshops", name: "Работилници", icon: "/category_images/art.png" },
];

export default function ChooseCategory() {
  const [search, setSearch] = useState("");
  const [showNoResult, setShowNoResult] = useState(false);
  const navigate = useNavigate();

  const normalized = search.trim().toLowerCase();

  const filteredCategories =
    normalized.length === 0
      ? categories
      : categories.filter((cat) => cat.name.toLowerCase().includes(normalized));

  const handleChange = (e) => {
    setSearch(e.target.value);
    setShowNoResult(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (filteredCategories.length === 1) {
        navigate(`/categories/${filteredCategories[0].id}`);
      } else if (filteredCategories.length === 0) {
        setShowNoResult(true);
      }
    }
  };

  return (
    <div
      className="categories-page"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/category_images/bg.jpg)` }}
    >
      <div className="categories-inner">
        <div className="categories-content">
          <h2 className="cat-title" style={{ marginBottom: "12px" }}>
            ИЗБЕРИ КАТЕГОРИЈА
          </h2>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Пребарај.."
              value={search}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {showNoResult && normalized.length > 0 && (
            <p className="no-results-msg">
              Нема категорија што одговара на „<strong>{search}</strong>“.
              <br />
              Одбери некоја од постоечките категории подолу. ✨
            </p>
          )}

          <div className="categories-grid">
            {filteredCategories.map((cat) => (
              <Link key={cat.id} to={`/categories/${cat.id}`} className="cat-card">
                <img src={cat.icon} className="cat-icon" alt={cat.name} />
                <p>{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
