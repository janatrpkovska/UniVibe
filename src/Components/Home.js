import { Link } from "react-router-dom";
import { Container, Image, Button } from "react-bootstrap";

function EventCard (){
    const events = [
        {
            image: "finki.png",
            title: "Finki event",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            date: "12.01.2026",
            location: "Finki"
        },
        {
            image: "gf.png",
            title: "Gradezen fakultet event",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            date: "12.01.2026",
            location: "Gradezen"
        },
        {
            image: "pmf.png",
            title: "Pmf event",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            date: "12.01.2026",
            location: "Pmf"
        }
    ]

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
            {events.map((event, index) => (
                <div 
                key={index}
                className="my-4"
                style={{
                    width: '30vh',
                    height: '60vh',
                    border: 'solid 2px black',
                    textAlign: 'left',
                    borderRadius: '4px'
                }}
                >
                <Image
                    src={`event_images/${event.image}`}
                    style={{
                    width: '100%',
                    height: '30%'
                    }}
                />
                <div style={{ backgroundColor: '#ffffff', height: '70%', position: 'relative', borderTop: '1px solid black'}}>
                    <p className="mx-1 fw-bold" style={{ fontSize: '16px' }}>{event.title}</p>
                    <p
                        className="mx-1"
                        style={{
                            fontSize: '13px',
                            display: '-webkit-box',
                            WebkitLineClamp: 11,        // number of lines before cutting
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        >
                        {event.description}
                    </p>
                    <div className="mx-1" style={{ position: 'absolute', bottom: '1px', fontSize: "12px" }}>
                    Датум: {event.date}
                    <br />
                    Место: {event.location}
                    </div>
                </div>
                </div>
            ))}
            </div>

    )
}

export default function Home(){
    return(
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
                    WebkitTextStroke: '1px black',
                    }}
                >   
                    <div
                        style={{
                            color: '#EBC042',
                            textShadow: '0 0 2px black',
                            fontSize: '60px',
                            WebkitTextStroke: '0px',
                        }}>
                        UniVibe
                    </div>
                    Добредојдовте во светот на универзитетските настани — место каде што идеите оживуваат, студентите се поврзуваат, а секој ден носи ново искуство!
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
          position: "relative"
        }}
      >
        <div style={{ flex: "1", minWidth: "350px", maxWidth: "550px" }}>
          <h2
            style={{
              fontSize: "56px",
              fontWeight: "900",
              color: "black",
              marginBottom: "20px",
              textAlign: "left"
            }}
          >
            Зошто<br />UniVibe?
          </h2>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "28px",
              color: "#111",
              textAlign: "left"
            }}
          >
            UniVibe е твоето место за сите универзитетски настани!
            Без разлика дали сакаш да присуствуваш на интересно предавање,
            работилница или журка – тука ќе најдеш се.<br /><br />
            Ние веруваме дека студентскиот живот треба да биде комбинација од
            учење, дружба и добар провод.<br />
            Со UniVibe никогаш нема да пропуштиш што се случува на твојот факултет!
          </p>
        </div>

        <div
          style={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            minWidth: "350px",
            marginTop: "40px"
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
              lineHeight: "90px"
            }}
          >
            UniVibe<br />UniVibe<br />UniVibe<br />UniVibe<br />UniVibe
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
              zIndex: 2
            }}
          />
        </div>
      </section>
            <Container fluid style={{backgroundColor: '#f0f8ffff', 
                textAlign: 'center', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', }}>
                <Button
                    type="button"
                    as={Link}
                    to="/search"
                    style={{
                        backgroundColor: '#EBC042',
                        color: 'black',
                        border: '0px solid',
                        boxShadow: 'none'
                    }}
                    className="focus-outline my-4"
                >
                    Пребарај настан
                </Button>
                <h2>
                    НАЈНОВИ НАСТАНИ
                </h2>
                <EventCard/>
            </Container>
        </>
    )
}