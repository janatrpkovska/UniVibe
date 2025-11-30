import React from "react";
import { useParams } from "react-router-dom";
import EventExpandedCard from "./EventExpandedCard";


const eventsDatabase = [
  {
    id: 1,
    title: "UniVibe",
    date: "10 Декември 2025",
    time: "14:00 – 16:00",
    location: "ФИНКИ",
    hostName: "ФСС ФИНКИ",
    hostTitle: "Факултетско студентско собрание",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    eventImage: "/students.png",
    hostImage: "/fsslogo.png",
    tag: "SCHEDULED"
  },
  {
    id: 2,
    title: "UniVibe",
    date: "10 Декември 2025",
    time: "14:00 – 16:00",
    location: "ФИНКИ",
    hostName: "ФСС ФИНКИ",
    hostTitle: "Факултетско студентско собрание",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    eventImage: "/students.png",
    hostImage: "/fsslogo.png",
    tag: "SCHEDULED"
  },
  {
    id: 3,
    title: "UniVibe",
    date: "10 Декември 2025",
    time: "14:00 – 16:00",
    location: "ФИНКИ",
    hostName: "ФСС ФИНКИ",
    hostTitle: "Факултетско студентско собрание",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    eventImage: "/students.png",
    hostImage: "/fsslogo.png",
    tag: "SCHEDULED"
  },
  {
    id: 4,
    title: "UniVibe",
    date: "10 Декември 2025",
    time: "14:00 – 16:00",
    location: "ФИНКИ",
    hostName: "ФСС ФИНКИ",
    hostTitle: "Факултетско студентско собрание",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    eventImage: "/students.png",
    hostImage: "/fsslogo.png",
    tag: "SCHEDULED"
  },
  {
    id: 5,
    title: "UniVibe",
    date: "10 Декември 2025",
    time: "14:00 – 16:00",
    location: "ФИНКИ",
    hostName: "ФСС ФИНКИ",
    hostTitle: "Факултетско студентско собрание",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    eventImage: "/students.png",
    hostImage: "/fsslogo.png",
    tag: "SCHEDULED"
  },
  
];

export default function Event() {
  const { id } = useParams();
  const event = eventsDatabase.find(e => e.id === Number(id));

  if (!event) {
    return (
      <div style={{ textAlign: "center", padding: "100px", fontSize: "2rem" }}>
        Настанот не е пронајден
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", padding: "20px 0" }}>
      <EventExpandedCard
        title={event.title}
        date={event.date}
        time={event.time}
        location={event.location}
        hostName={event.hostName}
        hostTitle={event.hostTitle}
        hostImage={event.hostImage}
        eventImage={event.eventImage}
        tag={event.tag}
        description={event.description}
      />
    </div>
  );
}