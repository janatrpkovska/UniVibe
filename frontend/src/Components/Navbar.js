import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useAuth } from "../util/AuthProvider";
import RightBottomToast from "./RightBottomToast";

function SiteNavbar() {
  const { isAuthenticated, logout } = useAuth();
  const [logoutToast, setLogoutToast] = useState({ show: false, message: "" });
  const navStyle = ({ isActive }) => ({
    backgroundColor: isActive ? "#EBC042" : "transparent",
    color: isActive ? "#ffffff" : "black",
    fontWeight: isActive ? "bold" : "normal",
    borderRadius: "10px",
    padding: "6px 30px",
  });

  const handleLogout = () => {
    logout();
    setLogoutToast({ show: true, message: "Успешно се одјавивте." });
  };

  return (
    <>
    <RightBottomToast
      show={logoutToast.show}
      message={logoutToast.message}
      onClose={() => setLogoutToast((t) => ({ ...t, show: false }))}
    />
    <Navbar expand="lg" bg="light" className="shadow-sm px-2 py-0">
      
      <Navbar.Brand className="me-auto">
        <NavLink to="/">
        <img
          src="/logo.png"
          width="60"
          height="60"
          className="d-inline-block align-top"
          alt="Logo"
        />
        </NavLink>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto d-flex gap-3">
          <Nav.Link as={NavLink} to="/" style={navStyle} className="nav-link">
            Дома
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/choose-category"
            style={navStyle}
            className="nav-link"
          >
            Настани
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/about-us"
            style={navStyle}
            className="nav-link"
          >
            За нас
          </Nav.Link>

          <Nav.Link
              as={NavLink}
              to="/search"
              style={navStyle}
              className="nav-link"
          >
            Пребарај
          </Nav.Link>

          {isAuthenticated && (
            <Nav.Link
              as={NavLink}
              to="/saved-events"
              style={navStyle}
              className="nav-link"
            >
              Зачувани настани
            </Nav.Link>
          )}
        </Nav>
        {
          !isAuthenticated ? (<NavLink to="/login" style={{ textDecoration: "none" }}>
            <button
              className="btn"
              style={{
                backgroundColor: "#EBC042",
                color: "black",
                borderRadius: "10px",
                padding: "6px 20px",
                fontWeight: "600",
                marginLeft: "-10vh",
              }}
            >
              Најави се
            </button>
          </NavLink>):<button
              className="btn"
              style={{
                backgroundColor: "#EBC042",
                color: "black",
                borderRadius: "10px",
                padding: "6px 20px",
                fontWeight: "600",
                marginLeft: "-10vh",
              }}
              onClick={handleLogout}
            >
              Одјави се
            </button>
        }
          
      </Navbar.Collapse>
    </Navbar>
    </>
  );
}

export default SiteNavbar;
