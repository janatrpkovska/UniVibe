import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import Home from "./Components/Home";
import About from "./Components/AboutUs";
import ChooseCategory from "./Components/ChooseCategory";
import CategoryEvents from "./Components/CategoryEvents";
import Search from "./Components/Search";
import SiteNavbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AddEventForm from "./Components/AddEventForm";

import "./App.css";

function FloatingAddEventButton() {
  const location = useLocation();
  if (location.pathname === "/events/new") return null;

  return (
    <Link to="/events/new" className="fab-add-event" aria-label="Додај настан">
      + Додај настан
    </Link>
  );
}

function AppRoutes() {
  return (
    <>
      <SiteNavbar />
      <FloatingAddEventButton />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/choose-category" element={<ChooseCategory />} />
        <Route path="/categories/:categoryId" element={<CategoryEvents />} />
        <Route path="/search" element={<Search />} />
        <Route path="/events/new" element={<AddEventForm />} />
      </Routes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
