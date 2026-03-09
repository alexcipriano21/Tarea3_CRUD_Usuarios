const db = require("../config/database").getConnection();

class UserRepository {
  getAll(search) {
    return new Promise((resolve, reject) => {
      if (search) {
        db.query(
          "SELECT * FROM users WHERE nombre LIKE ? OR apellidos LIKE ? OR dni LIKE ?",
          [`%${search}%`, `%${search}%`, `%${search}%`],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      } else {
        db.query("CALL GetUsers()", (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        });
      }
    });
  }

  create(user) {
    return new Promise((resolve, reject) => {
      db.query(
        "CALL InsertUser(?, ?, ?, ?, ?, ?)",
        [
          user.nombre,
          user.apellidos,
          user.dni,
          user.direccion,
          user.telefono,
          user.correo,
        ],
        (err) => {
          if (err) reject(err);
          else resolve({ message: "Usuario creado" });
        }
      );
    });
  }

  update(id, user) {
    return new Promise((resolve, reject) => {
      db.query(
        "CALL UpdateUser(?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          user.nombre,
          user.apellidos,
          user.dni,
          user.direccion,
          user.telefono,
          user.correo,
        ],
        (err) => {
          if (err) reject(err);
          else resolve({ message: "Usuario actualizado" });
        }
      );
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.query("CALL DeleteUser(?)", [id], (err) => {
        if (err) reject(err);
        else resolve({ message: "Usuario eliminado" });
      });
    });
  }
}

module.exports = new UserRepository();