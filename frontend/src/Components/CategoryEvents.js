import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CategoryEvents.css";

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
        description:
          "Практична сесија за креирање силно CV и портфолио за ИТ и креативни индустрии.",
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
        description:
          "Разговор со студенти и HR претставници за тоа како најлесно да дојдеш до прва пракса.",
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

  const goToSearchForm = () => {
    navigate("/search", { state: { scrollToForm: true } });
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
          <span className="current">{categoryName}</span>
        </div>

        <h1 className="category-title">Категорија: {categoryName}</h1>

        <button type="button" className="go-search-btn" onClick={goToSearchForm}>
          Пребарај настани
        </button>

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

                  <button type="button" className="event-details-btn" onClick={() => goToEventDetails(event.id)}>
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
