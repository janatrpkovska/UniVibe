import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../util/AuthProvider";
import "./CategoryEvents.css";

const SAVED_API_BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/saved-events`
  : "http://localhost:9091/api/saved-events";

function formatEventDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = [
    "јан", "фев", "мар", "апр", "мај", "јун",
    "јул", "авг", "сеп", "окт", "ное", "дек",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function SavedEvents() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchSavedEvents = useCallback(() => {
    if (!token) return;
    setFetchError(null);
    setLoading(true);
    axios
      .get(SAVED_API_BASE, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = res.data;
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setEvents([]);
        setFetchError(err?.response?.status === 401 ? "Сесијата истече. Најавете се повторно." : "Грешка при вчитување.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      setEvents([]);
      setFetchError(null);
      return;
    }
    fetchSavedEvents();
  }, [isAuthenticated, token, fetchSavedEvents]);

  const goToEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const goToSearchForm = () => {
    navigate("/search", { state: { scrollToForm: true } });
  };

  if (!isAuthenticated) {
    return (
      <div className="category-events-page">
        <div className="category-events-inner">
          <h1 className="category-title">Зачувани настани</h1>
          <p className="no-events">
            Мора да бидете најавени за да ги видите вашите зачувани настани.{" "}
            <Link to="/login" style={{ color: "#013C58", fontWeight: 600 }}>Најавете се</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-events-page">
      <div className="category-events-inner">
        <div className="breadcrumb">
          <Link to="/" className="crumb-link">Дома</Link>
          <span className="sep">›</span>
          <span className="current">Зачувани настани</span>
        </div>

        <h1 className="category-title">Зачувани настани</h1>

        {loading ? (
          <p className="no-events">Се вчитува...</p>
        ) : fetchError ? (
          <p className="no-events" style={{ color: "#c53030" }}>
            {fetchError}{" "}
            {fetchError.includes("Сесијата") && (
              <Link to="/login" style={{ color: "#013C58", fontWeight: 600 }}>Најавете се</Link>
            )}
            {" "}
            <button type="button" className="event-details-btn" onClick={fetchSavedEvents} style={{ marginLeft: "8px" }}>
              Обиди се повторно
            </button>
          </p>
        ) : events.length === 0 ? (
          <p className="no-events">
            Немате зачувани настани. Отворете настан и кликнете на иконата за зачувување за да го додадете тука. ✨
          </p>
        ) : (
          <section className="events-grid">
            {events.map((event) => (
              <article key={event.id} className="event-card">
                <div className="event-image">
                  {event.image_url ? (
                    <img src={`/event_images/${event.image_url}`} alt={event.title} />
                  ) : (
                    <span>✨</span>
                  )}
                </div>

                <div className="event-body">
                  <h3 className="event-title">{event.title}</h3>
                  {event.eventType?.name && (
                    <div className="event-type-chip">{event.eventType.name}</div>
                  )}
                  <p className="event-date">{formatEventDate(event.startDate)}</p>

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

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "32px", justifyContent: "center" }}>
          <button type="button" className="go-search-btn" onClick={goToSearchForm}>
            Пребарај настани
          </button>
          <button
            type="button"
            className="go-search-btn"
            onClick={fetchSavedEvents}
            disabled={loading}
            style={{ background: "#ffcc33", color: "#1b2559" }}
          >
            Освежи листа
          </button>
        </div>
      </div>
    </div>
  );
}
