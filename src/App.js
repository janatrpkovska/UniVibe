import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Events from "./Components/Events";
import About from "./Components/AboutUs";
import SiteNavbar from "./Components/Navbar";
import ChooseCategory from "./Components/ChooseCategory";
import Search from "./Components/Search";
import Event from "./Components/Event";
import Footer from "./Components/Footer";

export default function App() {
  return (
    <Router>
      <SiteNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:category" element={<Events />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/choose-category" element={<ChooseCategory/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/event/:id" element={<Event/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}
