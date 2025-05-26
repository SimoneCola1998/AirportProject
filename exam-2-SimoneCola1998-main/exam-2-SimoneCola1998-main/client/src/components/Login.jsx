import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function LoginForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsgEmail, setErrMsgEmail] = useState("");
  const [errMsgPass, setErrMsgPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email === "") {
      setErrMsgEmail("Email must not be empty");
    } else {
      setErrMsgEmail("");
    }
    if (password === "") {
      setErrMsgPass("Password must not be empty");
    } else {
      setErrMsgPass("");
    }
    if (!errMsgEmail && !errMsgPass) {
      await props
        .validateLogin(email, password)
        .then(() => {
          toast.success("Logged in successfully");
          navigate("/");
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };
  return (
    <Container
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
      fluid
    >
      <Toaster position="top-center" reverseOrder={false} />
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-mail"
            value={email}
            isInvalid={errMsgEmail !== ""}
            onChange={(ev) => {
              setEmail(ev.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Invalid email address
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            isInvalid={errMsgPass !== ""}
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Password must not be empty
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="outline-dark"
          type="submit"
          style={{ marginRight: "0.25rem" }}
        >
          Submit
        </Button>
        <Button
          variant="outline-danger"
          type="button"
          onClick={() => {
            navigate("/");
          }}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
}

export { LoginForm };
