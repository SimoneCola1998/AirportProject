import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Outlet, useNavigate } from "react-router-dom";
import { ImAirplane } from "react-icons/im";
import UserContext from "./UserContext";
import { useContext } from "react";

function Header(props) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      <Container>
        <Navbar>
          <Container>
            <Navbar.Brand
              href="/"
              onClick={(event) => {
                event.preventDefault();
                navigate("/");
              }}
            >
              <ImAirplane style={{ marginRight: "0.25rem" }} />
              Booking Planes
            </Navbar.Brand>
            {user.id ? (
              <Button variant="outline-dark" onClick={props.handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="outline-dark" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Container>
        </Navbar>
      </Container>
      <Outlet />
    </>
  );
}

export { Header };
