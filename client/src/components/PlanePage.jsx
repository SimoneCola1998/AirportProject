"use strict";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdEventSeat } from "react-icons/md";
import UserContext from "./UserContext";
import { useContext } from "react";
import { Container } from "react-bootstrap";
import { Card, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  getPlane,
  getOccupiedSeats,
  deleteReservation,
  updatePlaneAfterDelete,
  createReservation,
  updatePlaneAfterReservation,
  getReservationCount,
} from "../API";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function PlanePage() {
  const [seats, setSeats] = useState([]); //state used to manage the reservated seats
  const [plane, setPlane] = useState({}); //state used to manage the information of the plane selected
  //const [err, setErr] = useState(""); // error state
  const [refresh, setRefresh] = useState(false); //state used to manage the refresh of the page
  const [switchValue, setSwitchValue] = useState(false); //state used to manage the switch button
  const [selectedSeats, setSelectedSeats] = useState([]); // state used during the reservation of the seats
  const [seats_number, setSeats_number] = useState(0); //state used to manage the number of seats to reserve when I choose the second method of booking
  const [show, setShow] = useState(false); //internal state used to manage the modal
  const [requestOccupied, setRequestOccupied] = useState([]); //
  const { id } = useParams(); //planeId
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const array = generateArray(plane.rows, plane.seat_pr); // Array to generate all the seats for the plane
  const seat_array = seats.map((seat) => seat.seatId); // Array that contains all the seatId of the occupied seats
  const seatCheck = seats.map((s) => s.userId); // Array to the if the user has made yet a reservation for this type of plane

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSwitchChange = (event) => {
    setSwitchValue(event.target.checked);
  };

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      // Seat already selected, remove it
      setSelectedSeats((prevSeats) =>
        prevSeats.filter((selectedSeat) => selectedSeat !== seat)
      );
    } else {
      // Seat not selected, add it
      if (!seat_array.includes(seat))
        setSelectedSeats((prevSeats) => [...prevSeats, seat]);
    }
  };

  const handleInputChange = (event) => {
    setSeats_number(event.target.value);
  };

  useEffect(() => {
    getPlane(id).then((plane) => {
      setPlane(plane);
    });
    getOccupiedSeats(id).then((seats) => {
      setSeats(seats);
    });
  }, [id, refresh]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRequestOccupied([]);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [requestOccupied]);

  function generateArray(rows, cols) {
    const array = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 65; c < cols + 65; c++) {
        let code = r + String.fromCharCode(c);
        array.push(code);
      }
    }
    return array;
  }

  function shouldChangeColor(code) {
    if (requestOccupied.includes(code)) {
      return "yellow";
    }
    if (seat_array.includes(code)) {
      return "red";
    }
    if (selectedSeats.includes(code)) {
      return "grey";
    }
  }

  async function Reservation(seats_array) {
    if (requestOccupied.length === 0) {
      seats_array.forEach((s) => {
        createReservation(s, plane.id);
      });
      setSelectedSeats([]);
      await updatePlaneAfterReservation(seats_array.length, plane.id)
        .then(() => toast.success("You have successfully made a reservation"))
        .catch((err) => {
          toast.error(err.message);
        });
      setRefresh(!refresh);
    }
  }

  function ServerChoosingReservation(seats_number) {
    let tmpSeats = [];
    for (let i = 0; i < array.length && tmpSeats.length != seats_number; i++) {
      let seat = array[i];
      if (!seat_array.includes(seat)) {
        tmpSeats.push(seat);
      }
    }
    return tmpSeats;
  }

  async function HandleReservation() {
    if (seatCheck.includes(user.id)) {
      toast.error("You have already made a reservation for this plane");
    } else {
      const tmpArray = await getOccupiedSeats(plane.id);
      if (switchValue) {
        if (tmpArray.length === seat_array.length) {
          if (seats_number <= 0)
            toast.error("You have to choose a positive number of seats");
          else if (plane.seat_available < seats_number) {
            toast.error("Not enough seats available");
          } else {
            const serverSeat = ServerChoosingReservation(seats_number);
            Reservation(serverSeat);
          }
        } else {
          toast.error("One or more seats are not available anymore");
          setRequestOccupied(
            tmpArray
              .map((s) => s.seatId)
              .filter((s) => selectedSeats.includes(s))
          );
          setSelectedSeats([]);
        }
      } else {
        if (tmpArray.length === seat_array.length) {
          Reservation(selectedSeats);
        } else {
          toast.error("One or more seats are not available anymore");
          setRequestOccupied(
            tmpArray
              .map((s) => s.seatId)
              .filter((s) => selectedSeats.includes(s))
          );
          setSelectedSeats([]);
        }
      }
    }
    handleClose();
  }

  async function delReservation() {
    const seats_count = await getReservationCount();
    await deleteReservation();
    await updatePlaneAfterDelete(seats_count, plane.id).then(() => {
      toast.success("You have successfully deleted the reservation");
    });
    setRefresh(!refresh);
  }

  return (
    <Container style={{ padding: "20px" }}>
      <Toaster position="top-center" reverseOrder={false} />
      <Row>
        <Col style={{ padding: "5px" }}>
          <Card
            border="dark"
            style={{
              padding: "5px",
            }}
          >
            <Card.Body>
              <Card.Title>
                Plane {plane.id} Type {plane.type}
              </Card.Title>
              <Row xs={plane.seat_pr}>
                {array.map((a) => (
                  <Col
                    key={a}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Col
                      style={{
                        textAlign: "center",
                        cursor: user.id ? "pointer" : "default",
                        maxWidth: "4rem",
                      }}
                      onClick={
                        user.id && switchValue == false
                          ? () => handleSeatClick(a)
                          : null
                      }
                    >
                      <MdEventSeat
                        style={{
                          marginRight: "0.5rem",
                          color: shouldChangeColor(a),
                        }}
                      />
                      {a}
                    </Col>
                  </Col>
                ))}
              </Row>
              <Row md={4} style={{ marginTop: "0.75rem" }}>
                <Col md="auto">
                  <MdEventSeat
                    style={{
                      marginRight: "0.25rem",
                      color: "green",
                    }}
                  />
                  {plane.seat_available} Available
                </Col>
                <Col md="auto">
                  <MdEventSeat
                    style={{
                      marginRight: "0.25rem",
                      color: "red",
                    }}
                  />
                  {plane.seat_occupied} Occupied
                </Col>
                <Col md="auto">
                  <MdEventSeat
                    style={{
                      marginRight: "0.25rem",
                      color: "orange",
                    }}
                  />
                  {plane.seat_available + plane.seat_occupied} Total
                </Col>
                <Col md="auto">
                  {user.id && (
                    <>
                      <MdEventSeat
                        style={{
                          marginRight: "0.25rem",
                          color: "blue",
                        }}
                      />
                      {selectedSeats.length} Requested
                    </>
                  )}
                </Col>
              </Row>
              <Row style={{ marginTop: "0.25rem" }}>
                <Col>
                  <Form>
                    {user.id && (
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="I don't want to choose the seat"
                        checked={switchValue}
                        onChange={(event) => {
                          handleSwitchChange(event);
                          if (event.target.checked) setSelectedSeats([]);
                        }}
                        style={{ marginBottom: "0.5rem" }}
                      />
                    )}
                  </Form>
                  <Form>
                    {switchValue && (
                      <Form.Control
                        type="number"
                        placeholder="Insert the number of seats"
                        style={{
                          width: "200px",
                          height: "30px",
                          fontSize: "12px",
                        }}
                        onChange={handleInputChange}
                      />
                    )}
                  </Form>
                </Col>
              </Row>
              <Stack
                gap={2}
                style={{ marginTop: "0.5rem" }}
                className="col-md-2 ms-auto "
              >
                {user.id && (
                  <>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => {
                        handleShow();
                      }}
                    >
                      Book the seats
                    </Button>
                    <Modal
                      show={show}
                      onHide={handleClose}
                      backdrop="static"
                      keyboard={false}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Do you want to book the selected seats?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="outline-danger" onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          variant="dark"
                          onClick={() => {
                            HandleReservation();
                          }}
                        >
                          Confirm
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                )}
                {user.id && (
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => {
                      delReservation();
                    }}
                  >
                    Remove reservation
                  </Button>
                )}
              </Stack>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export { PlanePage };
