import React, { useMemo, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoryEvents.css";
import { resolveEventImageUrl } from "../util/eventImageUrl";

const API_BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/event`
  : "http://localhost:9091/api/event";

function formatEventDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = [
    "јан", "фев", "мар", "апр", "мај", "јун",
    "јул", "авг", "сеп", "окт", "ное", "дек",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const EVENTS_PER_PAGE = 20;

const paginationBtn = {
  padding: "8px 16px",
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

function CategoryPagination({ page, setPage, totalPages, size, totalResults }) {
  return (
      <div
          style={{
            width: "100%",
            paddingBottom: "30px",
            display: "flex",
            justifyContent: "center",
          }}
      >
        <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={paginationBtn} disabled={page === 0} onClick={() => setPage(0)}>
              First
            </button>

            <button style={paginationBtn} disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index;

                return (
                    <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        style={{
                          ...paginationBtn,
                          backgroundColor: pageNumber === page ? "#013C58" : "#fff",
                          color: pageNumber === page ? "#fff" : "#000",
                          borderColor: "#013C58",
                        }}
                    >
                      {pageNumber + 1}
                    </button>
                );
              })}
            </div>

            <button style={paginationBtn} disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>

            <button
                style={paginationBtn}
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(totalPages - 1)}
            >
              Last
            </button>
          </div>

          <div style={{ fontSize: "14px", color: "#333" }}>
            Резултати по страна: <b>{size}</b> | Вкупно: <b>{totalResults}</b>
          </div>
        </div>
      </div>
  );
}

const getLocalEventsForCategory = (categoryId) => {
  const all = JSON.parse(localStorage.getItem("events") || "[]");
  return all
    .filter((e) => e.categoryId === categoryId)
    .map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date || "Датум во подготовка",
      time: e.time || "",
      location: e.location || "",
      mode: e.mode || "",
      eventType: e.eventType || "",
      icon: e.icon || "✨",
      description: e.description || "",
      image: e.imageUrl || "",
    }));
};

export default function CategoryEvents() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [apiEvents, setApiEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [categoryName, setCategoryName] = useState("Категорија");

  
  const isNumericId = /^\d+$/.test(categoryId);

  useEffect(() => {
    setPage(0);
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId || !isNumericId) {
      if (!categoryId) {
        setLoading(false);
        setApiEvents([]);
        setTotalPages(0);
        setTotalResults(0);
      }
      return;
    }
    setLoading(true);
    setApiError(null);
    const url = `${API_BASE}/public/filtered-events?categoryId=${categoryId}&size=${EVENTS_PER_PAGE}&page=${page}`;
    axios
      .get(url)
      .then((res) => {
        const list = res.data?.content ?? res.data ?? [];
        setApiEvents(Array.isArray(list) ? list : []);
        setTotalPages(res.data?.totalPages ?? 0);
        setTotalResults(res.data?.totalElements ?? list.length);
      })
      .catch((err) => {
        setApiError(err?.message || "Грешка при вчитување.");
        setApiEvents([]);
        setTotalPages(0);
        setTotalResults(0);
      })
      .finally(() => setLoading(false));
  }, [categoryId, page, isNumericId]);

  useEffect(() => {
    if (!categoryId || isNumericId || categoryName === "Категорија") return;
    setLoading(true);
    setApiError(null);
    const url = `${API_BASE}/public/get-events/category?category=${encodeURIComponent(categoryName)}`;
    axios
      .get(url)
      .then((res) => {
        const list = res.data ?? [];
        setApiEvents(Array.isArray(list) ? list : []);
        setTotalPages(Math.ceil((list.length || 0) / EVENTS_PER_PAGE) || 1);
        setTotalResults(list.length || 0);
      })
      .catch((err) => {
        setApiError(err?.message || "Грешка при вчитување.");
        setApiEvents([]);
        setTotalPages(0);
        setTotalResults(0);
      })
      .finally(() => setLoading(false));
  }, [categoryId, categoryName, isNumericId]);

  const localEvents = useMemo(() => getLocalEventsForCategory(categoryId), [categoryId]);
  const fallbackEvents = useMemo(() => [...localEvents], [localEvents]);

  const fullApiList = useMemo(
    () =>
      apiEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: formatEventDate(e.startDate),
        eventType: e.eventType?.name ?? "",
        image: e.image_url ? resolveEventImageUrl(e.image_url) : null,
      })),
    [apiEvents]
  );

  const eventsToShow =
    fullApiList.length > 0
      ? isNumericId
        ? fullApiList
        : fullApiList.slice(page * EVENTS_PER_PAGE, (page + 1) * EVENTS_PER_PAGE)
      : fallbackEvents;

  const showPagination = fullApiList.length > 0;
  const paginationTotalPages = isNumericId ? Math.max(1, totalPages) : Math.ceil(totalResults / EVENTS_PER_PAGE) || 1;

  const goToSearchForm = () => {
    navigate("/search", { state: { scrollToForm: true } });
  };

  const goToEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

 useEffect(() => {
  if (!categoryId || !isNumericId) return;

  axios
    .get(`http://localhost:9091/api/category/public/get-category/${categoryId}`)
    .then((res) => {
      setCategoryName(res.data.name);
    })
    .catch(() => {
      setCategoryName("Категорија");
    });
}, [categoryId, isNumericId]);

  return (
    <div className="category-events-page">
      <div className="category-events-inner">
        <div className="breadcrumb">
          <Link to="/choose-category" className="crumb-link">
            Категории
          </Link>
          <span className="sep">›</span>
          <span className="current">{categoryName}</span>
        </div>

        <h1 className="category-title">Категорија: {categoryName}</h1>

        <button type="button" className="go-search-btn" onClick={goToSearchForm}>
          Пребарај настани
        </button>

        {loading ? (
          <p className="no-events">Се вчитува...</p>
        ) : apiError && apiEvents.length === 0 && fallbackEvents.length === 0 ? (
          <p className="no-events">{apiError}</p>
        ) : eventsToShow.length === 0 ? (
          <p className="no-events">
            Моментално нема пронајдени настани за оваа категорија. Следи нѐ, наскоро ќе додадеме нешто интересно. ✨
          </p>
        ) : (
          <>
            <section className="events-view">
              {eventsToShow.map((event) => (
                <article key={event.id} className="event-card">
                  <div className="event-image">
                      {event.image ? (
                          <img src={event.image} alt={event.title} />
                      ) : (
                          <img src="/logo.png" alt="default" />
                      )}
                  </div>

                  <div className="event-body">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-date">{event.date}</p>

                    <button type="button" className="event-details-btn" onClick={() => goToEventDetails(event.id)}>
                      Детали
                    </button>
                  </div>
                </article>
              ))}
            </section>
            {showPagination && (
              <CategoryPagination
                page={page}
                setPage={setPage}
                totalPages={paginationTotalPages}
                size={EVENTS_PER_PAGE}
                totalResults={totalResults}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
