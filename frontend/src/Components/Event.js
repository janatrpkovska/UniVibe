import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventExpandedCard from "./EventExpandedCard";

export default function Event() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://localhost:9091/api/event/public/get-event/${id}`
        );

        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setError("Настанот не постои или не може да се вчита.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p style={{ padding: "30px" }}>Се вчитува...</p>;
  if (error) return <p style={{ padding: "30px", color: "red" }}>{error}</p>;
  if (!event) return <p style={{ padding: "30px" }}>Нема податоци за настанот.</p>;

  // формат за датум/време
  const startDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString("mk-MK")
    : "Датум во подготовка";

  const startTime = event.startDate
    ? new Date(event.startDate).toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <EventExpandedCard
      title={event.title}
      date={startDate}
      time={startTime}
      location={event.location || "Нема локација"}
      hostName={event.faculty?.name || "УниВајб"}
      hostTitle={event.category?.name || ""}
      description={event.description || "Нема опис."}
      eventImage={event.image_url || "/students.png"}
      hostImage={"/fsslogo.png"}
      tag={event.status || "SCHEDULED"}
    />
  );
}
