import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

function SiteNavbar() {
  return (
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
          {/* Home */}
          <Nav.Link
            as={NavLink}
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link text-white fw-semibold" : "nav-link text-dark"
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#EBC042" : "transparent",
              color:isActive ? "#ffffff" : "black",
              fontWeight: isActive ? "bold" : "normal",
              borderRadius: "10px",
              padding: "6px 30px",
            })}
          >
            Дома
          </Nav.Link>

          {/* Events */}
          <Nav.Link
            as={NavLink}
            to="/choose-category"
            className={({ isActive }) =>
              isActive ? "nav-link text-white fw-semibold" : "nav-link text-dark"
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#EBC042" : "transparent",
              color:isActive ? "#ffffff" : "black",
              fontWeight: isActive ? "bold" : "normal",
              borderRadius: "10px",
              padding: "6px 30px",
            })}
          >
            Настани
          </Nav.Link>

          {/* About Us */}
          <Nav.Link
            as={NavLink}
            to="/about-us"
            className={({ isActive }) =>
              isActive ? "nav-link text-white fw-semibold" : "nav-link text-dark"
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#EBC042" : "transparent",
              color:isActive ? "#ffffff" : "black",
              fontWeight: isActive ? "bold" : "normal",
              borderRadius: "10px",
              padding: "6px 30px",
            })}
          >
            За нас
          </Nav.Link>
        </Nav>
          <button
            className="btn"
            style={{
              backgroundColor: "#EBC042",
              color: "black",
              borderRadius: "10px",
              padding: "6px 20px",
              fontWeight: "600",
              marginLeft: '-10vh'
            }}
          >
            Најави се
          </button>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default SiteNavbar;
