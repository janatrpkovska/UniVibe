import React, { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CategoryEvents.css";

const latinToCyr = (text) => {
  const map = {
    a: "а",
    b: "б",
    v: "в",
    g: "г",
    d: "д",
    e: "е",
    z: "з",
    i: "и",
    j: "ј",
    k: "к",
    l: "л",
    m: "м",
    n: "н",
    o: "о",
    p: "п",
    r: "р",
    s: "с",
    t: "т",
    u: "у",
    f: "ф",
    h: "х",
    c: "ц",
    y: "ј",
  };

  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] || ch)
    .join("");
};

const categoriesConfig = {
  tech: {
    name: "Технологија",
    events: [
      {
        id: 101,
        title: "AI Bootcamp: Практична примена на ChatGPT",
        date: "18 декември 2025",
        time: "18:00 – 20:00",
        location: "ФИНКИ, амфитеатар",
        mode: "во живо",
        icon: "🤖",
        eventType: "Работилница / Workshop",
        description:
          "Интерактивна работилница каде студентите учат како да користат AI алатки во секојдневни проекти и учење.",
      },
      {
        id: 102,
        title: "Cyber Security Essentials",
        date: "20 декември 2025",
        time: "17:00 – 19:00",
        location: "Online (Zoom)",
        mode: "онлајн",
        icon: "🛡️",
        eventType: "Предавање / Lecture",
        description:
          "Основи на сајбер безбедност за студенти: лозинки, фишинг, 2FA и безбедно користење на интернет.",
      },
    ],
  },
  career: {
    name: "Кариeра",
    events: [
      {
        id: 201,
        title: "CV & Portfolio Masterclass",
        date: "12 декември 2025",
        time: "16:00 – 18:00",
        location: "Кариерен центар, УКИМ",
        mode: "во живо",
        icon: "📝",
        eventType: "Предавање / Lecture",
        description: "Практична сесија за креирање силно CV и портфолио за ИТ и креативни индустрии.",
      },
      {
        id: 202,
        title: "Како до прва пракса?",
        date: "18 декември 2025",
        time: "19:00 – 20:30",
        location: "Online (Microsoft Teams)",
        mode: "онлајн",
        icon: "🎯",
        eventType: "Networking / Meetup",
        description: "Разговор со студенти и HR претставници за тоа како најлесно да дојдеш до прва пракса.",
      },
    ],
  },
  research: {
    name: "Истражување",
    events: [
      {
        id: 301,
        title: "Како да напишеш научен труд?",
        date: "28 декември 2025",
        time: "11:00 – 13:00",
        location: "Универзитетска библиотека",
        mode: "во живо",
        icon: "📚",
        eventType: "Работилница / Workshop",
        description: "Водич низ процесот на пишување научен труд: структура, цитирање и избор на списание.",
      },
      {
        id: 302,
        title: "Machine Learning во научни истражувања",
        date: "10 јануари 2026",
        time: "17:30 – 19:30",
        location: "Online (Zoom)",
        mode: "онлајн",
        icon: "📊",
        eventType: "Предавање / Lecture",
        description: "Интро предавање за тоа како ML се користи во медицина, психологија и општествени науки.",
      },
    ],
  },
  culture: {
    name: "Култура",
    events: [
      {
        id: 401,
        title: "Филмска вечер: Европско кино 2025",
        date: "16 декември 2025",
        time: "20:00 – 22:30",
        location: "Студентски културен центар",
        mode: "во живо",
        icon: "🎬",
        eventType: "Друго",
        description: "Проекција на европски филм + кратка дискусија со модератор по завршување.",
      },
    ],
  },
  health: { name: "Здравје", events: [] },
  sport: { name: "Спорт", events: [] },
  edu: { name: "Едукација", events: [] },
  workshops: { name: "Работилници", events: [] },
};

const categorySearchIndex = [
  { id: "tech", name: "Технологија", labels: ["технологија", "tech", "tehnologija", "technology"] },
  { id: "career", name: "Кариeра", labels: ["кариера", "career", "kariera", "работа", "job"] },
  { id: "research", name: "Истражување", labels: ["истражување", "research", "istrazuvanje", "science"] },
  { id: "culture", name: "Култура", labels: ["култура", "culture", "kultura", "arts"] },
  { id: "health", name: "Здравје", labels: ["здравје", "health", "zdravje"] },
  { id: "sport", name: "Спорт", labels: ["спорт", "sport", "sports"] },
  { id: "edu", name: "Едукација", labels: ["едукација", "education", "edu", "obrazovanie"] },
  { id: "workshops", name: "Работилници", labels: ["работилници", "workshops", "workshop", "rabotilnici"] },
];

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

  const category = categoriesConfig[categoryId] || { name: "Категорија", events: [] };
  const categoryName = category.name;

  const localEvents = useMemo(() => getLocalEventsForCategory(categoryId), [categoryId]);
  const mergedEvents = useMemo(() => [...localEvents, ...(category.events || [])], [localEvents, category.events]);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [notFoundTerm, setNotFoundTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const findMatches = (raw) => {
    const query = raw.trim().toLowerCase();
    if (!query) return [];
    const queryCyr = latinToCyr(query);

    return categorySearchIndex.filter((cat) =>
      cat.labels.some((label) => {
        const l = label.toLowerCase();
        return l.includes(query) || l.includes(queryCyr);
      })
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const matches = findMatches(value);
    setSuggestions(matches);
    setNotFoundTerm(matches.length === 0 && value.trim() ? value : "");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const matches = findMatches(searchTerm);

    if (matches.length === 1) {
      setSearchTerm("");
      setSuggestions([]);
      setNotFoundTerm("");
      navigate(`/categories/${matches[0].id}`);
      return;
    }

    if (matches.length === 0) {
      setSuggestions([]);
      setNotFoundTerm(searchTerm);
      return;
    }

    setSuggestions(matches);
    setNotFoundTerm("");
  };

  const goToCategory = (id) => {
    setSearchTerm("");
    setSuggestions([]);
    setNotFoundTerm("");
    navigate(`/categories/${id}`);
  };

  const openEventDetails = (event) => setSelectedEvent({ ...event, categoryName });
  const closeEventDetails = () => setSelectedEvent(null);

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

        <form className="events-search-row" onSubmit={handleSearchSubmit}>
          <div className="events-search-bar">
            <span className="events-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Пребарај категорија..."
              className="events-search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button type="submit" className="events-filter-btn">
            Барај
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="category-suggestions">
            <p className="suggestions-title">Предложени категории:</p>
            <div className="suggestions-pills">
              {suggestions.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="suggestion-pill"
                  onClick={() => goToCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {notFoundTerm && (
          <p className="no-category">
            Нема категорија што одговара на „<strong>{notFoundTerm}</strong>“. Одбери од понудените категории. 🙂
          </p>
        )}

        {mergedEvents.length === 0 ? (
          <p className="no-events">
            Моментално нема пронајдени настани за оваа категорија. Следи нѐ, наскоро ќе додадеме нешто интересно. ✨
          </p>
        ) : (
          <section className="events-grid">
            {mergedEvents.map((event) => (
              <article key={event.id} className="event-card">
                <div className="event-image">
                  {event.image ? <img src={event.image} alt={event.title} /> : <span>{event.icon}</span>}
                </div>

                <div className="event-body">
                  <h3 className="event-title">{event.title}</h3>
                  {event.eventType && <div className="event-type-chip">{event.eventType}</div>}
                  <p className="event-date">{event.date}</p>

                  <button
                    type="button"
                    className="event-details-btn"
                    onClick={() => openEventDetails(event)}
                  >
                    Детали
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {selectedEvent && (
        <div className="event-modal-backdrop" onClick={closeEventDetails}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="event-modal-close" onClick={closeEventDetails}>
              ✕
            </button>

            <div className="event-modal-header">
              <span className="event-modal-category">{selectedEvent.categoryName}</span>
              <h2 className="event-modal-title">{selectedEvent.title}</h2>
            </div>

            <div className="event-modal-meta">
              <span className="event-modal-chip">📅 {selectedEvent.date || "Датум во подготовка"}</span>
              {selectedEvent.time && <span className="event-modal-chip">⏰ {selectedEvent.time}</span>}
              {selectedEvent.location && <span className="event-modal-chip">📍 {selectedEvent.location}</span>}
              {selectedEvent.mode && (
                <span className="event-modal-chip mode-chip">
                  {selectedEvent.mode === "онлајн" ? "🌐 Онлајн" : "🏫 Во живо"}
                </span>
              )}
              {selectedEvent.eventType && <span className="event-modal-chip">🎟️ {selectedEvent.eventType}</span>}
            </div>

            {selectedEvent.description && <p className="event-modal-description">{selectedEvent.description}</p>}

            <button type="button" className="event-modal-cta">
              Пријави се на настанот
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
