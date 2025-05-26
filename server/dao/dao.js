"use strict";

const sqlite = require("sqlite3");
const db = require("../db");

function getAllPlanes() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM planes";
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else {
        resolve(rows);
      }
    });
  });
}

function getPlane(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM planes WHERE id = ?";
    db.get(sql, [id], (err, rows) => {
      if (err) reject(err);
      else {
        resolve(rows);
      }
    });
  });
}

function getOccupiedSeats(planeId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM occupied_seat WHERE planeId = ?";
    db.all(sql, [planeId], (err, rows) => {
      if (err) reject(err);
      else {
        resolve(rows);
      }
    });
  });
}

function createReservation(reservation) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO occupied_seat(seatId, planeId, userId) VALUES(?,?,?)";
    // NOTE: reservation.id is ignored because the database will generate an auto-incremental ID
    db.run(
      sql,
      [reservation.seatId, reservation.planeId, reservation.userId],
      (err) => {
        if (err) reject(err.message);
        else resolve(true);
      }
    );
  });
}

function updatePlaneAfterReservation(seats_value, id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE planes
    SET seat_occupied=seat_occupied+?, seat_available=seat_available-?
    WHERE id=?`;

    db.run(sql, [seats_value, seats_value, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function updatePlaneAfterDelete(seats_value, id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE planes
    SET seat_occupied=seat_occupied-?, seat_available=seat_available+?
    WHERE id=?`;

    db.run(sql, [seats_value, seats_value, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function deleteReservation(userId) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM occupied_seat WHERE userId=?";
    db.run(sql, [userId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function getReservationCount(userId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT (*) AS count FROM occupied_seat WHERE userId=?";
    db.get(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.count);
      }
    });
  });
}

exports.getAllPlanes = getAllPlanes;
exports.getPlane = getPlane;
exports.getOccupiedSeats = getOccupiedSeats;
exports.createReservation = createReservation;
exports.deleteReservation = deleteReservation;
exports.updatePlaneAfterReservation = updatePlaneAfterReservation;
exports.updatePlaneAfterDelete = updatePlaneAfterDelete;
exports.getReservationCount = getReservationCount;
