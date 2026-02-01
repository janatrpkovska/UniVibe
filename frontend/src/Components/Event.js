import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventExpandedCard from "./EventExpandedCard";

const API_BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/event`
  : "http://localhost:9091/api/event";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = [
    "Јануари", "Февруари", "Март", "Април", "Мај", "Јуни",
    "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDateRange(startStr, endStr) {
  const start = formatDate(startStr);
  const end = endStr ? formatDate(endStr) : null;
  if (!end || start === end) return start;
  return `${start} – ${end}`;
}

export default function Event() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Невалиден ID на настан.");
      return;
    }
    axios
      .get(`${API_BASE}/public/get-event/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => {
        setError(err?.response?.status === 404 ? "Настанот не е пронајден." : err?.message || "Грешка при вчитување.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px", fontSize: "1.25rem" }}>
        Се вчитува...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ textAlign: "center", padding: "100px", fontSize: "2rem" }}>
        {error || "Настанот не е пронајден"}
      </div>
    );
  }

  const eventImage = event.image_url
    ? `/event_images/${event.image_url}`
    : "/logo.png";
  const hostName = event.faculty?.name || event.eventType?.name || "UniVibe";
  const hostTitle = event.eventType?.name || event.faculty?.name || "";
  const hostImage = "/fsslogo.png";

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", padding: "20px 0" }}>
      <EventExpandedCard
        title={event.title}
        date={formatDateRange(event.startDate, event.endDate)}
        time={formatTime(event.startDate)}
        location={event.location || ""}
        hostName={hostName}
        hostTitle={hostTitle}
        hostImage={hostImage}
        eventImage={eventImage}
        tag={event.status || "SCHEDULED"}
        description={event.description || ""}
      />
    </div>
  );
}
