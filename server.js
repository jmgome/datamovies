// const express = require("express");
// const sqlite3 = require("sqlite3").verbose();
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs"); // Asegúrate de importar 'fs' para leer el archivo JSON

// const app = express();
// const PORT = 4000;

// // Permitir CORS
// app.use(cors());
// app.use(express.json()); // Esto permite que el servidor analice JSON

// // Conectar a la base de datos SQLite
// const dbPath = path.resolve(__dirname, "mydatabase.db");
// const db = new sqlite3.Database(dbPath, (err) => {
//   if (err) {
//     console.error("Error al conectar a la base de datos:", err.message);
//   } else {
//     console.log("Conectado a la base de datos SQLite");
//   }
// });

// // Endpoint para obtener datos de la tabla 'movies'
// app.get("/api/movies", (req, res) => {
//   const sql = "SELECT * FROM movies";
//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       console.error("Error al ejecutar la consulta SQL:", err.message);
//       res
//         .status(500)
//         .json({ error: "Error en el servidor al consultar la base de datos" });
//       return;
//     }
//     if (rows.length === 0) {
//       res.json({
//         message: "No hay datos disponibles",
//         data: [],
//       });
//     } else {
//       res.json({
//         message: "success",
//         data: rows,
//       });
//     }
//   });
// });

// // Endpoint para login
// app.post("/api/login", (req, res) => {
//   const { email, password } = req.body;

//   // Leer credenciales desde el archivo credentials.json
//   fs.readFile(
//     path.resolve(__dirname, "credentials.json"),
//     "utf8",
//     (err, data) => {
//       if (err) {
//         console.error("Error al leer el archivo de credenciales:", err.message);
//         return res
//           .status(500)
//           .json({ success: false, message: "Error en el servidor." });
//       }

//       const credentials = JSON.parse(data);

//       // Buscar usuario que coincida con las credenciales
//       const user = credentials.users.find(
//         (user) => user.email === email && user.password === password
//       );

//       if (user) {
//         res.json({
//           success: true,
//           message: "Login exitoso.",
//           user: {
//             firstName: user.firstName, // Añade el nombre del usuario en la respuesta
//             lastName: user.lastName, // También puedes incluir más datos si lo deseas
//             email: user.email,
//           },
//         });
//       } else {
//         res
//           .status(401)
//           .json({ success: false, message: "Credenciales incorrectas." });
//       }
//     }
//   );
// });

// // Endpoint para registro de usuarios
// app.post("/api/register", (req, res) => {
//   const { firstName, lastName, email, password, dob } = req.body;

//   // Leer el archivo credentials.json
//   fs.readFile(
//     path.resolve(__dirname, "credentials.json"),
//     "utf8",
//     (err, data) => {
//       if (err) {
//         console.error("Error al leer el archivo de credenciales:", err.message);
//         return res
//           .status(500)
//           .json({ success: false, message: "Error en el servidor." });
//       }

//       const credentials = JSON.parse(data);

//       // Verificar si el usuario ya existe
//       const userExists = credentials.users.find((user) => user.email === email);

//       if (userExists) {
//         return res
//           .status(400)
//           .json({ success: false, message: "El usuario ya está registrado." });
//       }

//       // Añadir nuevo usuario a las credenciales
//       credentials.users.push({ firstName, lastName, email, password, dob });

//       // Guardar las credenciales actualizadas en el archivo
//       fs.writeFile(
//         path.resolve(__dirname, "credentials.json"),
//         JSON.stringify(credentials, null, 2),
//         (err) => {
//           if (err) {
//             console.error(
//               "Error al escribir en el archivo de credenciales:",
//               err.message
//             );
//             return res
//               .status(500)
//               .json({ success: false, message: "Error en el servidor." });
//           }

//           res.json({
//             success: true,
//             message: "Usuario registrado exitosamente.",
//           });
//         }
//       );
//     }
//   );
// });

// // Iniciar el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

require("dotenv").config(); // Para cargar variables de entorno desde el archivo .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

// Permitir CORS y configurar el servidor para procesar JSON
app.use(cors());
app.use(express.json());

// Conectar a la base de datos MongoDB
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err.message));

// Crear un esquema para las películas (movies)
const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  year: Number,
});

// Modelo de película basado en el esquema
const Movie = mongoose.model("Movie", movieSchema);

// Endpoint para obtener todas las películas
app.get("/api/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ message: "success", data: movies });
  } catch (error) {
    console.error("Error al obtener películas:", error.message);
    res
      .status(500)
      .json({ error: "Error en el servidor al consultar MongoDB" });
  }
});

// Endpoint para login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Leer credenciales desde el archivo credentials.json
  fs.readFile(
    path.resolve(__dirname, "credentials.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error al leer el archivo de credenciales:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Error en el servidor." });
      }

      const credentials = JSON.parse(data);

      // Buscar usuario que coincida con las credenciales
      const user = credentials.users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        res.json({
          success: true,
          message: "Login exitoso.",
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Credenciales incorrectas." });
      }
    }
  );
});

// Endpoint para registro de usuarios
app.post("/api/register", (req, res) => {
  const { firstName, lastName, email, password, dob } = req.body;

  // Leer el archivo credentials.json
  fs.readFile(
    path.resolve(__dirname, "credentials.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error al leer el archivo de credenciales:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Error en el servidor." });
      }

      const credentials = JSON.parse(data);

      // Verificar si el usuario ya existe
      const userExists = credentials.users.find((user) => user.email === email);

      if (userExists) {
        return res
          .status(400)
          .json({ success: false, message: "El usuario ya está registrado." });
      }

      // Añadir nuevo usuario a las credenciales
      credentials.users.push({ firstName, lastName, email, password, dob });

      // Guardar las credenciales actualizadas en el archivo
      fs.writeFile(
        path.resolve(__dirname, "credentials.json"),
        JSON.stringify(credentials, null, 2),
        (err) => {
          if (err) {
            console.error(
              "Error al escribir en el archivo de credenciales:",
              err.message
            );
            return res
              .status(500)
              .json({ success: false, message: "Error en el servidor." });
          }

          res.json({
            success: true,
            message: "Usuario registrado exitosamente.",
          });
        }
      );
    }
  );
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
