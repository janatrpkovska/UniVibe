
import React from "react";

export default function EventExpandedCard({
  title= "Студентска платформа за информации",
    date= "2 Декември 2025",
    time= "14:00 – 16:00",
    location= "ФИНКИ",
    hostName= "ФСС ФИНКИ",
    hostTitle= "Факултетско студентско собрание",
    description= "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    eventImage= "/students.png",
    hostImage= "/fsslogo.png",
    tag= "SCHEDULED"
}) {
  return (
    <div className="container" style={{ maxWidth: "900px", margin: "50px auto" }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        
        <img src={eventImage} className="w-100" style={{ height: "400px", objectFit: "cover" }} alt={title} />

        <div className="card-body p-5">
          <span className="badge rounded-pill px-3 py-2 mb-4" style={{ backgroundColor: "#ffe0e0", color: "#e91e63" }}>
            {tag}
          </span>

          <h1 className="display-5 fw-bold mb-4">{title}</h1>

          
          <div className="row g-4 mb-5 text-secondary">
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-calendar3 fs-4 " style={{ color: "#91ABDA" }}></i>
                <span className="fs-5">{date}</span>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-clock fs-4 " style={{ color: "#91ABDA" }}></i>
                <span className="fs-5">{time}</span>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-geo-alt fs-4 " style={{ color: "#91ABDA" }}></i>
                <span className="fs-5">{location}</span>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center gap-3 text-success">
                <i className="bi bi-globe fs-4"></i>
                <span className="fs-5 fw-semibold">Online</span>
              </div>
            </div>
          </div>

          
          <div className="d-flex flex-wrap gap-3 mb-5">
            <button className="btn btn-outline-primary btn-lg px-4" 
              style={{borderColor: "#91ABDA", color: "#91ABDA" }}
              onMouseEnter={e => { e.target.style.color = "white"; e.target.style.backgroundColor = "#91ABDA"; }}
              onMouseLeave={e => { e.target.style.color = "#91ABDA"; e.target.style.backgroundColor = "transparent"; }}>
                <i className="bi bi-calendar-plus"> </i>
                Add to Calendar
                </button>
            <button className="btn btn-primary btn-lg px-5" style={{backgroundColor: "#91ABDA",borderColor: "#91ABDA",color: "white"}}>
              Register</button>
          </div>

          <hr className="my-5" />

          
          <div className="row align-items-center mb-5">
            <div className="col-auto">
              <img src={hostImage} alt={hostName} className="rounded-circle" width="80" height="80" />
            </div>
            <div className="col">
              <h4 className="mb-1">Host</h4>
              <p className="mb-1 fw-bold">{hostName}</p>
              <p className="text-muted">{hostTitle}</p>
            </div>
          </div>

          
          <div>
            <h3 className="h4 fw-bold mb-4">Опис</h3>
            <p className="lead text-secondary" style={{ lineHeight: "1.8" }}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
