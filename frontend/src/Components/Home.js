import { Link } from "react-router-dom";
import { Container, Image, Button } from "react-bootstrap";
import { useEffect, useRef } from "react";
import "./CategoryEvents.css";
import "../style/animation.css"

function EventCard() {
  const events = [
    {
      id: 1,
      image: "finki.png",
      title: "Finki event",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      date: "12.01.2026",
      location: "Finki",
    },
    {
      id: 2,
      image: "gf.png",
      title: "Gradezen fakultet event",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      date: "12.01.2026",
      location: "Gradezen",
    },
    {
      id: 3,
      image: "pmf.png",
      title: "Pmf event",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      date: "12.01.2026",
      location: "Pmf",
    },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem" }}>
      {events.map((event, index) => (
        <section className="events-grid">
          <article key={event.id} className="event-card">
            <div className="event-image" style={{ objectFit: "cover" }}>
              {event.image ? (
                <Image
                  src={`event_images/${event.image}`}
                  alt={event.title}
                  fluid
                />
              ) : (
                <span>{event.icon}</span>
              )}
            </div>

            <div className="event-body">
              <h3 className="event-title">{event.title}</h3>
              <p
                style={{
                  WebkitLineClamp: 7,
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {event.description}
              </p>
              <p className="event-date">{event.date}</p>
              <Link to={`/event/${event.id}`}>
                <button type="button" className="event-details-btn">
                  Детали
                </button>
              </Link>
            </div>
          </article>
        </section>
      ))}
    </div>
  );
}

export default function Home() {
  const statsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div style={{ position: "relative", textAlign: "center" }}>
        <Image
          src="background.png"
          fluid
          className="w-100"
          style={{ height: "70vh", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "2rem",
            fontWeight: "bold",
            WebkitTextStroke: "1px black",
          }}
        >
          <div
            style={{
              color: "#EBC042",
              textShadow: "0 0 2px black",
              fontSize: "60px",
              WebkitTextStroke: "0px",
            }}
          >
            UniVibe
          </div>
          Добредојдовте во светот на универзитетските настани — место каде што
          идеите оживуваат, студентите се поврзуваат, а секој ден носи ново
          искуство!
        </div>
      </div>
      {/* SECTION 2 */}
      <section
        style={{
          background: "#D3D3D3",
          padding: "50px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        <div style={{ flex: "1", minWidth: "350px", maxWidth: "550px" }}>
          <h2
            style={{
              fontSize: "56px",
              fontWeight: "900",
              color: "black",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            Зошто
            <br />
            UniVibe?
          </h2>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "28px",
              color: "#111",
              textAlign: "left",
            }}
          >
            UniVibe е твоето место за сите универзитетски настани! Без разлика
            дали сакаш да присуствуваш на интересно предавање, работилница или
            журка – тука ќе најдеш се.
            <br />
            <br />
            Ние веруваме дека студентскиот живот треба да биде комбинација од
            учење, дружба и добар провод.
            <br />
            Со UniVibe никогаш нема да пропуштиш што се случува на твојот
            факултет!
          </p>
        </div>

        <div
          style={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            minWidth: "350px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              position: "absolute",
              fontSize: "100px",
              fontWeight: "900",
              color: "rgba(0,0,0,0.1)",
              top: "50px",
              left: "-40px",
              zIndex: 0,
              pointerEvents: "none",
              lineHeight: "90px",
            }}
          >
            UniVibe
            <br />
            UniVibe
            <br />
            UniVibe
            <br />
            UniVibe
            <br />
            UniVibe
          </div>

          <img
            src="/Screenshot_1.png"
            alt="Instagram post"
            style={{
              width: "48%",
              height: "500px",
              maxWidth: "100%",
              borderRadius: "16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              zIndex: 2,
            }}
          />
        </div>
      </section>
      <Container
        id="latest-events"
        fluid
        style={{
          backgroundColor: "#f0f8ffff",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 className="my-4">НАЈНОВИ НАСТАНИ</h2>
        <EventCard />
        <Button
          type="button"
          as={Link}
          to="/search"
          style={{
            backgroundColor: "#ffcc33",
            color: "black",
            border: "0px solid",
            boxShadow: "none",
            borderRadius: "10px",
            paddingLeft: "3vh",
            paddingRight: "3vh",
          }}
          className="focus-outline my-4"
        >
          Пребарај настан
        </Button>
      </Container>
      <section
        style={{
          background: "#c7e3ffff",
          padding: "60px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "4rem",
          textAlign: "center",
        }}
      >
        {[
          { number: "12+", text: "Факултети" },
          { number: "200+", text: "Организирани настани" },
          { number: "1,100+", text: "Студенти" },
        ].map((item, index) => (
          <div
            key={index}
            ref={(el) => (statsRef.current[index] = el)}
            className="fade-in-up"
            style={{
              background: "#f9f9f9",
              padding: "30px 40px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              minWidth: "220px",
            }}
          >
            <h2 style={{ fontSize: "48px", color: "#EBC042", margin: 0 }}>
              {item.number}
            </h2>
            <p style={{ fontSize: "18px", marginTop: "10px" }}>{item.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
