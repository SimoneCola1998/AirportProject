const crypto = require("crypto");

const db = require("../db");

/**
 * Query the database and check whether the email exists and the password
 * hashes to the correct value.
 * If so, return an object with full user information.
 * @param {string} email
 * @param {string} password
 * @returns {Promise} a Promise that resolves to the full information about the current user, if the password matches
 * @throws the Promise rejects if any errors are encountered
 */
function getUser(email, password) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email=?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        // database error
        reject(err);
      } else {
        if (!row) {
          // non-existent user
          reject("Invalid email or password");
        } else {
          crypto.scrypt(password, row.salt, 32, (err, computed_hash) => {
            if (err) {
              // key derivation fails
              reject(err);
            } else {
              const equal = crypto.timingSafeEqual(
                computed_hash,
                Buffer.from(row.password, "hex")
              );
              if (equal) {
                // password ok
                resolve(row);
              } else {
                // password doesn't match
                reject("Invalid email or password");
              }
            }
          });
        }
      }
    });
  });
}

exports.getUser = getUser;
