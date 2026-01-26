import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import "./ChooseCategory.css";

export default function ChooseCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          "http://localhost:9091/api/category/public/get-categories"
        );

        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Не може да се вчитаат категориите.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className="categories-page"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/category_images/bg.jpg)`,
      }}
    >
      <div className="categories-inner">
        <div className="categories-content">
          <h2 className="cat-title" style={{ marginBottom: "12px" }}>
            ИЗБЕРИ КАТЕГОРИЈА
          </h2>

          {loading && <p>Се вчитува...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className="cat-card"
              >
                <img
                  src={cat.icon_url}
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
