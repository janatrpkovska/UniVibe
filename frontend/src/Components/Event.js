import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventExpandedCard from "./EventExpandedCard";
import RightBottomToast from "./RightBottomToast";
import { useAuth } from "../util/AuthProvider";
import { eventImageSrc } from "../util/eventImageUrl";

const API_BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/event`
  : "http://localhost:9091/api/event";
const SAVED_API_BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/saved-events`
  : "http://localhost:9091/api/saved-events";

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
  const { token, isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveToast, setSaveToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showSaveToast = (message, variant = "success") => {
    setSaveToast({ show: true, message, variant });
  };

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

  useEffect(() => {
    if (!id || !isAuthenticated || !token) {
      setIsSaved(false);
      return;
    }
    axios
      .get(`${SAVED_API_BASE}/check/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setIsSaved(res.data === true))
      .catch(() => setIsSaved(false));
  }, [id, isAuthenticated, token]);

  const handleDelete = () => {
    if (!token || !id) return;

    if (!window.confirm("Дали сте сигурни?")) return;

    axios.delete(`${API_BASE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
        .then(() => {
          alert("Настанот е избришан");
          window.location.href = "/";
        })
        .catch(() => {
          alert("Грешка при бришење");
        });
  };
  const handleEdit = () => {
    window.location.href = `/edit-event/${id}`;
  };

  const handleSaveToggle = () => {
    if (!token || !id) return;
    if (isSaved) {
      axios
        .delete(`${SAVED_API_BASE}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setIsSaved(false);
          showSaveToast("Настанот е отстранет од зачувани.");
        })
        .catch(() => {
          showSaveToast("Не можевме да го отстраниме од зачувани. Обидете се повторно.", "error");
        });
    } else {
      axios
        .post(`${SAVED_API_BASE}/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setIsSaved(true);
          showSaveToast("Настанот е зачуван.");
        })
        .catch(() => {
          showSaveToast("Не можевме да го зачуваме настанот. Обидете се повторно.", "error");
        });
    }
  };

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

  const eventImage = eventImageSrc(event.image_url);
  const hostName = event.faculty?.name || event.eventType?.name || "UniVibe";
  const hostTitle = event.eventType?.name || event.faculty?.name || "";
  const hostImage = "/fsslogo.png";

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", padding: "20px 0" }}>
      <RightBottomToast
        show={saveToast.show}
        message={saveToast.message}
        variant={saveToast.variant}
        onClose={() => setSaveToast((t) => ({ ...t, show: false }))}
      />

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
        eventId={event.id}
        isSaved={isSaved}
        onSaveToggle={handleSaveToggle}
        isAuthenticated={isAuthenticated}
        user={user}
        onDelete={handleDelete}
        onEdit={handleEdit}
        showOnline={event.mode === "ONLINE" || event.mode === "HYBRID"}
      />
    </div>
  );
}
