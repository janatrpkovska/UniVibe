
import React from "react";

function hasValue(str) {
  return str != null && String(str).trim() !== "";
}

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
    tag= "SCHEDULED",
    eventId,
    isSaved = false,
    onSaveToggle,
    isAuthenticated,
    user,
    onDelete,
    onEdit,
    showOnline = false
}) {
  return (
    <div className="container" style={{ maxWidth: "720px", margin: "36px auto" }}>
      <div className="card border-0 shadow rounded-3 overflow-hidden">
        
        <img src={eventImage} className="w-100" style={{ height: "280px", objectFit: "cover" }} alt={title} />

        <div className="card-body p-4 px-md-5">
          <div className="mb-3">
            <span className="badge rounded-pill px-2 py-1" style={{ fontSize: "0.75rem", backgroundColor: "#ffe0e0", color: "#e91e63" }}>
              {tag}
            </span>
          </div>

          <h2 className="h4 fw-bold mb-4" style={{ fontSize: "1.35rem" }}>{title}</h2>

          
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="row g-3 text-secondary" style={{ fontSize: "1rem" }}>
              {hasValue(date) && (
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-calendar3" style={{ color: "#91ABDA", fontSize: "1.1rem" }}></i>
                    <span>{date}</span>
                  </div>
                </div>
              )}
              {hasValue(time) && (
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-clock" style={{ color: "#91ABDA", fontSize: "1.1rem" }}></i>
                    <span>{time}</span>
                  </div>
                </div>
              )}
              {hasValue(location) && (
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-geo-alt" style={{ color: "#91ABDA", fontSize: "1.1rem" }}></i>
                    <span>{location}</span>
                  </div>
                </div>
              )}
              {showOnline && (
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-2 text-success">
                    <i className="bi bi-globe" style={{ fontSize: "1.1rem" }}></i>
                    <span className="fw-semibold">Online</span>
                  </div>
                </div>
              )}
            </div>
            {user?.role === "ROLE_ADMIN" && (
                <>
                  <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={onEdit}
                  >
                    Edit
                  </button>

                  <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={onDelete}
                  >
                    Delete
                  </button>
                </>
            )}
            {isAuthenticated && eventId && (
              <button
                type="button"
                onClick={() => onSaveToggle && onSaveToggle()}
                className="border-0 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#f4f6ff",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
                aria-label={isSaved ? "Откажи зачувување" : "Зачувај"}
              >
                <i
                  className={isSaved ? "bi bi-bookmark-fill" : "bi bi-bookmark"}
                  style={{ fontSize: "18px", color: isSaved ? "#EBC042" : "#1b2559" }}
                />
              </button>
            )}
          </div>

          <hr className="my-4" />

          
          <div className="row align-items-center mb-4">
            <div className="col-auto d-flex align-items-center">
              <img
                  src={hostImage && hostImage.trim() !== "" ? hostImage : "/ukim-logo.png"}
                  alt={hostName}
                  className="rounded-circle"
                  width="56"
                  height="56"
                  onError={(e) => {
                    e.target.src = "/ukim-logo.png";
                  }}
              />
              <div className="ms-3">
                <h5 className="mb-0 small text-muted">Host</h5>
                <p className="mb-0 fw-semibold" style={{ fontSize: "1rem" }}>{hostName}</p>
                <p className="mb-0 text-muted small">{hostTitle}</p>
              </div>
            </div>
          </div>

          
          <div>
            <h6 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>Опис</h6>
            <p className="text-secondary mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.65" }}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
