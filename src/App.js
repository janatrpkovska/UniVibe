import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import About from "./Components/AboutUs";
import SiteNavbar from "./Components/Navbar";
import ChooseCategory from "./Components/ChooseCategory";
import CategoryEvents from "./Components/CategoryEvents";
import Search from "./Components/Search";
import Footer from "./Components/Footer";
import Event from "./Components/Event";
export default function App() {
  return (
    <Router>
      <SiteNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />

        {}
        <Route path="/choose-category" element={<ChooseCategory />} />

        {}
       <Route path="/categories/:categoryId" element={<CategoryEvents />} />

        {}
        <Route path="/search" element={<Search />} />

        <Route path="/event/:id" element={<Event />} />


      
      </Routes>
      <Footer />
    </Router>
  );
}
