import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./ChooseCategory.css";

const categories = [
  {
    id: "tech",
    name: "Технологија",
    icon: "/category_images/tech.png",
  },
  {
    id: "career",
    name: "Кариeра",
    icon: "/category_images/career-path.png",
  },
  {
    id: "research",
    name: "Истражување",
    icon: "/category_images/innovation.png",
  },
  {
    id: "culture",
    name: "Култура",
    icon: "/category_images/workshop.png",
  },
  {
    id: "health",
    name: "Здравје",
    icon: "/category_images/medical.png",
  },
  {
    id: "sport",
    name: "Спорт",
    icon: "/category_images/sport.png",
  },
  {
    id: "edu",
    name: "Едукација",
    icon: "/category_images/education.png",
  },
  {
    id: "workshops",
    name: "Работилници",
    icon: "/category_images/art.png",
  },
];

export default function ChooseCategory() {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <div className="categories-page">
      <div className="categories-inner">
        <div className="categories-content">
          <h2 className="cat-title">ИЗБЕРИ КАТЕГОРИЈА</h2>

          {/* Search bar што само пренасочува на /search */}
          <div className="search-bar" onClick={handleSearchClick}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Пребарај.."
              readOnly
            />
          </div>

          {/* Грид со категории */}
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className="cat-card"
              >
                <img
                  src={cat.icon}
                  className="cat-icon"
                  alt={cat.name}
                />
                <p>{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
