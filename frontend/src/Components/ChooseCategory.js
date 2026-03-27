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
          "http://localhost:9091/api/category/public/get-all"
        );

        const uniqueCategories = (res.data || []).filter(
  (cat, index, self) =>
    index ===
    self.findIndex(
      (c) =>
        c.name.toLowerCase().includes(cat.name.toLowerCase()) ||
        cat.name.toLowerCase().includes(c.name.toLowerCase())
    )
);

setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
        setError("Не може да се вчитаат категориите.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p style={{ padding: "40px" }}>Се вчитува...</p>;
  }

  if (error) {
    return (
      <p style={{ padding: "40px", color: "red" }}>
        {error}
      </p>
    );
  }

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
                  onError={(e) => {
                    e.target.src = "/logo.png";
                  }}
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
