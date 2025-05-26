"use strict";
import { getAllPlanes } from "../API";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdEventSeat } from "react-icons/md";

function Homepage() {
  const [planes, setPlanes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getAllPlanes().then((planes) => {
      setPlanes(planes);
    });
  }, []);

  return (
    <Container style={{ padding: "5px" }}>
      <Row xs={1} md={2} xl={3}>
        {planes.map((q) => (
          <Col key={q.id} style={{ padding: "15px" }}>
            <Card
              border="dark"
              style={{ cursor: "pointer", padding: "5px" }}
              onClick={() => {
                navigate(`/seats/${q.id}`);
              }}
            >
              <Card.Body>
                <Card.Title>
                  Plane {q.id} Type {q.type}
                </Card.Title>
                <Card.Subtitle style={{ marginTop: "5px" }}>
                  <MdEventSeat
                    style={{
                      marginRight: "0.5rem",
                      color: "green",
                    }}
                  />
                  {q.seat_available} Available
                  <MdEventSeat
                    style={{
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                      color: "red",
                    }}
                  />
                  {q.seat_occupied} Occupied
                  <MdEventSeat
                    style={{
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                      color: "orange",
                    }}
                  />
                  {q.seat_available + q.seat_occupied} Total
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export { Homepage };
