import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoryEvents.css";

export default function CategoryEvents() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryAndEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const [catRes, eventsRes] = await Promise.all([
          axios.get(`http://localhost:9091/api/category/public/get-category/${categoryId}`),
          axios.get(`http://localhost:9091/api/event/public/get-events/category/${categoryId}`),
        ]);

        setCategoryName(catRes.data?.name || "");
        setEvents(eventsRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Не може да се вчитаат настаните за оваа категорија.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndEvents();
  }, [categoryId]);

  const goToSearchPage = () => {
    navigate(`/search?categoryId=${categoryId}#filters`);
  };

  const goToEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="category-events-page">
      <div className="category-events-inner">
        <div className="breadcrumb">
          <Link to="/choose-category" className="crumb-link">
            Категории
          </Link>
          <span className="sep">›</span>
          <span className="current">{categoryName ? categoryName : `Категорија ${categoryId}`}</span>
        </div>

        <h1 className="category-title">
          Настани во категорија: {categoryName ? categoryName : `#${categoryId}`}
        </h1>

        <button type="button" className="go-search-btn" onClick={goToSearchPage}>
          Пребарај настани
        </button>

        {loading && <p className="no-events">Се вчитува...</p>}

        {error && (
          <p className="no-events" style={{ color: "red" }}>
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 ? (
          <p className="no-events">Нема настани во оваа категорија.</p>
        ) : (
          <section className="events-grid">
            {events.map((event) => (
              <article key={event.id} className="event-card">
                <div className="event-image">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title} />
                  ) : (
                    <img
    src="/logo.png"
    alt="UniVibe logo"
    style={{ width: "70px", height: "70px", objectFit: "contain", opacity: 0.85 }}
  />
                  )}
                </div>

                <div className="event-body">
                  <h3 className="event-title">{event.title}</h3>

                  {event.eventType?.name && (
                    <div className="event-type-chip">{event.eventType.name}</div>
                  )}

                  {event.startDate && (
                    <p className="event-date">
                      {new Date(event.startDate).toLocaleString("mk-MK")}
                    </p>
                  )}

                  <button
                    type="button"
                    className="event-details-btn"
                    onClick={() => goToEventDetails(event.id)}
                  >
                    Детали
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
