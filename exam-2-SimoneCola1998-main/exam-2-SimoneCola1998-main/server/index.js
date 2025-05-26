"use strict";

const PORT = 3000;

const express = require("express");

// middleware modules
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");

// passport
const passport = require("passport");
const LocalStrategy = require("passport-local");

// import Dao and Data Model
const dao = require("./dao/dao");
const userdao = require("./dao/user-dao");

// Create App
const app = express();

// Configure and register middlewares
app.use(morgan("combined"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// see: https://expressjs.com/en/resources/middleware/session.html
app.use(
  session({
    secret: "xxxxyyyyzzz",
    saveUninitialized: false,
    resave: false,
  })
);

// Configure and register Passport

passport.use(
  new LocalStrategy((email, password, callback) => {
    // verify function
    userdao
      .getUser(email, password)
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(null, false, err);
      });
  })
);

passport.serializeUser((user, callback) => {
  callback(null, { id: user.id, email: user.email });
});
passport.deserializeUser((user, callback) => {
  callback(null, user);
});

app.use(passport.authenticate("session"));

// Custom middleware: check login status
const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("NOT AUTHENTICATED - GO AWAY");
  }
};

/******* LOGIN - LOGOUT OPERATIONS *******/

// POST /api/login
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      } else {
        res.status(201).json(req.user);
      }
    });
  })(req, res, next);
});

// POST /api/logout
app.post("/api/logout", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/******* PUBLIC APIs (NO AUTHENTICATION) *******/

//GET /api/planes - GET ALL PLANES
app.get("/api/planes", (req, res) => {
  dao
    .getAllPlanes()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

//GET /api/planes/:id - GET ALL INFORMATION OF A PLANE
app.get("/api/planes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const plane = await dao.getPlane(id);
    res.json(plane);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//GET /api/seats/:planeId - GET ALL INFORMATION OF THE OCCUPIED SEATS
app.get("/api/seats/:planeId", async (req, res) => {
  const planeId = req.params.planeId;
  try {
    const seats = await dao.getOccupiedSeats(planeId);
    res.json(seats);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/******* PRIVATE APIs (REQUIRE AUTHENTICATION) *******/

app.use(isLogged);

//POST /api/seats - CREATE A RESERVATION
app.post("/api/reservation", (req, res) => {
  const reservation = {
    id: null,
    seatId: req.body.seatId,
    planeId: req.body.planeId,
    userId: req.user.id,
  };
  dao
    .createReservation(reservation)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.set("Content-Type: text/plain");
      res.status(500).send(error.message);
    });
});

//PUT /api/planes/:id - UPDATE THE PLANE DATABASE AFTER A RESERVATION
app.put("/api/planes/:id", async (req, res) => {
  const id = req.params.id;

  const seat_update = req.body.seat_update;

  try {
    await dao.updatePlaneAfterReservation(seat_update, id);
    res.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//PUT /api/planes/delete/:id - UPDATE THE PLANE DATABASE AFTER A CANCELLATION
app.put("/api/planes/delete/:id", async (req, res) => {
  const id = req.params.id;

  const seat_update = req.body.seat_update;

  try {
    await dao.updatePlaneAfterDelete(seat_update, id);
    res.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE /api/reservation/ - DELETE A RESERVATION
app.delete("/api/reservation/delete", async (req, res) => {
  const userId = req.user.id;
  try {
    await dao.deleteReservation(userId);
    res.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//GET /api/reservations/count - GET THE NUMBER OF RESERVATIONS OF A USER
app.get("/api/reservations/count", async (req, res) => {
  const userId = req.user.id;
  try {
    const count = await dao.getReservationCount(userId);
    res.json(count);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
/******* APPLICATION STARTUP *******/

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
