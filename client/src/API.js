const APIURL = "http://localhost:3000/api";

async function checkLogin(username, password) {
  try {
    const response = await fetch(APIURL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

async function doLogout() {
  try {
    const response = await fetch(APIURL + "/logout", {
      method: "POST",
    });
    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

async function getAllPlanes() {
  try {
    const response = await fetch(APIURL + "/planes");
    if (response.ok) {
      const plane = await response.json();
      return plane;
    } else {
      // if response is not OK
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

async function getPlane(id) {
  try {
    const response = await fetch(APIURL + `/planes/${id}`);
    if (response.ok) {
      const plane = await response.json();
      return plane;
    } else {
      // if response is not OK
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

async function getOccupiedSeats(planeId) {
  try {
    const response = await fetch(APIURL + `/seats/${planeId}`);
    if (response.ok) {
      const seats = await response.json();
      return seats;
    } else {
      // if response is not OK
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

/**
 * Add a new reservation
 * @param {string} seatId
 * @param {int}  planeId
 * @param {int} userId
 */
async function createReservation(seatId, planeId) {
  try {
    const response = await fetch(APIURL + `/reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seatId: seatId,
        planeId: planeId,
      }),
      credentials: "include",
    });
    if (response.ok) {
      const id = Number(await response.text());
      return id;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

async function updatePlaneAfterReservation(seat_update, id) {
  try {
    const response = await fetch(APIURL + `/planes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seat_update: seat_update,
      }),
      credentials: "include",
    });
    if (response.ok) {
      return true;
    } else {
      const message = response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

async function updatePlaneAfterDelete(seat_update, id) {
  try {
    const response = await fetch(APIURL + `/planes/delete/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seat_update: seat_update,
      }),
      credentials: "include",
    });
    if (response.ok) {
      return true;
    } else {
      const message = response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}
/**
 * Delete a given reservation
 * @param {int} userId
 * @returns true if ok
 */
async function deleteReservation() {
  try {
    const response = await fetch(APIURL + `/reservation/delete`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      return true;
    } else {
      // if response is not OK
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

async function getReservationCount() {
  try {
    const response = await fetch(APIURL + `/reservations/count`, {
      credentials: "include",
    });
    if (response.ok) {
      const seats_count = await response.json();
      return seats_count;
    } else {
      // if response is not OK
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

export {
  checkLogin,
  doLogout,
  getAllPlanes,
  getPlane,
  getOccupiedSeats,
  createReservation,
  updatePlaneAfterReservation,
  updatePlaneAfterDelete,
  deleteReservation,
  getReservationCount,
};
