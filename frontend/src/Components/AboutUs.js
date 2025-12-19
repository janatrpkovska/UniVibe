import { Link } from "react-router-dom";
import { Container, Image, Button } from "react-bootstrap";
export default function AboutUs() {

  const bgBlue = "#00537A";
  const bgGray = "#D3D3D3";

  const overlayText = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    fontWeight: "bold",
    lineHeight: "55px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    pointerEvents: "none"
  };

  const sectionStyle = (bg) => ({
    position: "relative",
    background: bg,
    padding: "60px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    overflow: "hidden"
  });

  const subtitle = {
    fontSize: "36px",
    fontWeight: "800",
    color: "black",
    marginBottom: "20px",
    textAlign: "left",
    width: "100%",
    maxWidth: "900px"
  };

  const paragraph = {
    maxWidth: "900px",
    fontSize: "18px",
    lineHeight: "28px",
    color: "#111",
    textAlign: "left",
    marginBottom: "20px"
  };

  return (
    <div style={{ overflow: "hidden"}}>
        {/* === SECTION 1  === */}
    <div
        style={{
            backgroundColor: "#2a6d89",
            position: "relative",
            padding: "80px 40px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start", 
            gap: "40px",                  
        }}
    >
        {/* Left Image with Diagonal Mask */}
        <div
            style={{
                width: "48%",
                height: "420px",
                backgroundImage: "url('/yourImage1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        />

        {/* ABOUT US Title */}
        <h1
            style={{
                position: "absolute",
                top: "60px",
                left: "52%",
                transform: "translateX(-50%)",
                fontSize: "100px",
                fontWeight: "900",
                color: "black",
                margin: 0,
                zIndex: 3,
            }}
        >
            ABOUT US
        </h1>

        {/* Repeating UniVibe Background Text */}
        <div
            style={{
                position: "absolute",
                right: "0",
                top: "0",
                width: "60%",
                height: "100%",
                opacity: 0.15,
                fontSize: "60px",
                fontWeight: "bold",
                color: "black",
                lineHeight: "70px",
                padding: "40px",
                zIndex: 1,
            }}
        >
            UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe
        </div>

        {/* Paragraph Box */}
        <div
            style={{
                width: "40%",
                backgroundColor: "rgba(255,255,255,0.3)",
                backdropFilter: "blur(4px)",
                padding: "40px",
                borderRadius: "10px",
                color: "black",
                fontSize: "20px",
                fontWeight: "500",
                zIndex: 5,
                marginLeft: "0",   
            }}
        >
            „Зад UniVibe стои мала, но посветена група студенти кои веруваат дека
            универзитетскиот живот е повеќе од само книги и испити.“
        </div>
    </div>


            {/* ========== SECTION 3 ========== */}
      <section
        style={{
          background: "#82C6D9",
          padding: "100px 60px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Repeating UniVibe background text on the RIGHT */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "0",
            width: "55%",
            fontSize: "60px",
            fontWeight: "300",
            lineHeight: "55px",
            color: "rgba(0,0,0,0.25)",
            transform: "rotate(-3deg)",
            pointerEvents: "none",
            textAlign: "right",
            whiteSpace: "normal",
          }}
        >
          UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe UniVibe
        </div>

        {/* TITLE + BUTTON ROW */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "25px",
            marginBottom: "40px",
            zIndex: 2,
          }}
        >
          <h2
            style={{
              fontSize: "70px",
              fontWeight: "900",
              color: "black",
              margin: 0,
              lineHeight: "1.1",
            }}
          >
            Што нуди <br /> UniVibe
          </h2>

            <Button
                as={Link}
                to="/choose-category"
                style={{
                    backgroundColor: "#EBC042",
                    color: "black",
                    border: "none",
                    padding: "12px 22px",
                    fontSize: "18px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginLeft: "-50px"
                }}
            >
                Пребарај
            </Button>
        </div>

        {/* BULLET LIST */}
        <p
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "20px",
            fontWeight: "500",
            color: "black",
            zIndex: 2,
            lineHeight: "32px",
            width: "1000px",
          }}
        >
            UniVibe служи како твој централен простор за откривање на најразлични студентски активности. На платформата можеш брзо да пребаруваш настани според интерес, било да се академски, културни или забавни. Од најнови работилници и научни предавања, па сѐ до концерти, фестивали и дружења, UniVibe ги обединува сите информации на едно место. Дополнително, апликацијата ти овозможува да се поврзеш со студенти од различни факултети и да ја прошириш својата заедница. Избери категорија – Технологија, Кариера, Истражување, Култура, Здравје, Едукација или Забава – и откриј ги сите можности што ги нуди UniVibe.        </p>
      </section>


        {/* ========== SECTION 4 ========== */}
        
        <section
        style={{
            background: "#D3D3D3",
            padding: "80px 60px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            
        }}
        >
        {/* LEFT BOTTOM CORNER SILHOUETTES */}
        <div
            style={{
            position: "absolute",
            left: "0",                   
            top:"-10em",                
            width: "130%",
            height: "130%",
            backgroundImage: "url('/silhouettes2.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left bottom",
            transform: "rotate(8deg)",  
            zIndex: 1,
            marginTop:"13px",
            }}
        ></div>

        {/* RIGHT TEXT */}
        <div
            style={{
            width: "55%",
            marginLeft: "auto",
            marginRight: "-10em",
            zIndex: 3
            }}
        >
            <h2
            style={{
                fontSize: "70px",
                fontWeight: "900",
                color: "black",
                marginBottom: "20px",
                lineHeight: "1.1",
                marginLeft:"20px"
            }}
            >
            Која е нашата<br />мисија
            </h2>

            <p
            style={{
                fontSize: "22px",
                fontWeight: "400",
                color: "black",
                lineHeight: "32px",
                maxWidth: "600px",
            }}
            >
            „Идејата за UniVibe се роди кога сфативме дека студентите често дознаваат
            за настаните – предоцна. Сакаме тоа да го смениме.“
            </p>
            <Button
                as={Link}
                to="/"
                style={{
                    backgroundColor: "#EBC042",
                    color: "black",
                    border: "none",
                    padding: "12px 22px",
                    fontSize: "18px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginLeft: "-10px"
                }}
            >
                Актуелни настани
            </Button>
        </div>
        </section>



    </div>
  );
}