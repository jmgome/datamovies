// const sqlite3 = require("sqlite3").verbose();
// const path = require("path");

// // Conectar a la base de datos
// const dbPath = path.resolve(__dirname, "mydatabase.db");
// const db = new sqlite3.Database(dbPath, (err) => {
//   if (err) {
//     console.error("Error al conectar a la base de datos:", err);
//   } else {
//     console.log("Conectado a la base de datos SQLite");

//     // Comprobar si hay registros con image = NULL
//     db.all("SELECT * FROM movies WHERE image IS NULL", (err, rows) => {
//       if (err) {
//         console.error("Error al buscar registros nulos:", err.message);
//       } else if (rows.length > 0) {
//         console.log("Se encontraron registros con 'image' nulo:", rows);

//         // Eliminar registros con image = NULL
//         db.run("DELETE FROM movies WHERE image IS NULL", (err) => {
//           if (err) {
//             console.error(
//               "Error al eliminar registros con image nulo:",
//               err.message
//             );
//           } else {
//             console.log("Registros con 'image' nulo eliminados");

//             // Continuar con la creación de la nueva tabla y copiado de datos
//             continuarProceso();
//           }
//         });
//       } else {
//         console.log("No se encontraron registros con 'image' nulo");

//         // Continuar con la creación de la nueva tabla y copiado de datos
//         continuarProceso();
//       }
//     });
//   }
// });

// // Función para continuar con la creación de la nueva tabla y copiado de datos
// function continuarProceso() {
//   db.serialize(() => {
//     // Crear la nueva tabla
//     db.run(
//       `CREATE TABLE IF NOT EXISTS movies_new (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         image TEXT UNIQUE NOT NULL,
//         video TEXT UNIQUE NOT NULL,
//         description TEXT
//       )`,
//       (err) => {
//         if (err) {
//           console.error("Error al crear la nueva tabla:", err.message);
//         } else {
//           console.log("Nueva tabla 'movies_new' creada");

//           // Copiar los datos de la tabla antigua a la nueva
//           db.run(
//             `INSERT INTO movies_new (id, name, image, description)
//              SELECT id, name, image, description FROM movies
//              WHERE image IS NOT NULL`, // Omitir registros con 'image' nulo
//             (err) => {
//               if (err) {
//                 console.error("Error al copiar datos:", err.message);
//               } else {
//                 console.log("Datos copiados a la nueva tabla");

//                 // Eliminar la tabla antigua
//                 db.run(`DROP TABLE movies`, (err) => {
//                   if (err) {
//                     console.error(
//                       "Error al eliminar la tabla antigua:",
//                       err.message
//                     );
//                   } else {
//                     console.log("Tabla antigua eliminada");

//                     // Renombrar la nueva tabla a 'movies'
//                     db.run(`ALTER TABLE movies_new RENAME TO movies`, (err) => {
//                       if (err) {
//                         console.error(
//                           "Error al renombrar la tabla:",
//                           err.message
//                         );
//                       } else {
//                         console.log("Tabla renombrada a 'movies'");

//                         // Insertar los datos como antes
//                         insertarPeliculas();
//                       }
//                     });
//                   }
//                 });
//               }
//             }
//           );
//         }
//       }
//     );
//   });
// }

// // Función para insertar películas
// function insertarPeliculas() {
//   const insertStmt = db.prepare(
//     "INSERT INTO movies (name, image, video, description) VALUES (?, ?, ?, ?)"
//   );
//   const movies = [
//     [
//       "John Wick 2 (2017)",
//       "https://es.digitaltrends.com/wp-content/uploads/2024/11/John-Wick-2.jpeg?fit=1243%2C810&p=1",
//       "https://youtu.be/d8SAMcYR_xQ?si=uE_alPeIf2ElvAWL",
//       "John Wick regresa para enfrentar a nuevos enemigos en esta secuela llena de acción.",
//     ],
//     [
//       "Inception",
//       "https://images.adsttc.com/media/images/53b5/d563/c07a/80a3/4300/016c/medium_jpg/inception_ver12_xlg.jpg?1404425564",
//       "https://youtu.be/fBFgg_OYcR4?si=_jrged0QwDk05NhH",
//       "Una película sobre el poder de los sueños y la mente humana dirigida por Christopher Nolan.",
//     ],
//     [
//       "Interstellar",
//       "https://storage.googleapis.com/pod_public/1300/184493.jpg",
//       "https://youtu.be/xkxnYxfrz4M?si=nt3-yQHVjk1Dgmkp",
//       "Un viaje épico para salvar a la humanidad a través del espacio y el tiempo.",
//     ],
//     [
//       "The Dark Knight",
//       "https://i.pinimg.com/736x/54/f5/70/54f570a467f5561fad17caeedc395dc4.jpg",
//       "https://youtu.be/18UERYTgDVA?si=LFrZKztk83kio41M",
//       "Batman enfrenta a su mayor enemigo, el Joker, en esta icónica película de superhéroes.",
//     ],
//     [
//       "Pulp Fiction",
//       "https://www.shutterstock.com/image-photo/bright-colored-grafitti-replica-pulp-260nw-2503446477.jpg",
//       "https://youtu.be/6P4eT5gtbfc?si=YoCOwHBstVvG60x0",
//       "Una de las obras maestras de Quentin Tarantino con una narrativa no lineal y personajes icónicos.",
//     ],
//   ];

//   movies.forEach((movie) => {
//     insertStmt.run(movie[0], movie[1], movie[2], movie[3], (err) => {
//       if (err) {
//         console.error("Error al insertar datos:", err.message);
//       } else {
//         console.log(`Datos insertados: ${movie[0]}`);
//       }
//     });
//   });

//   insertStmt.finalize(() => {
//     db.close((err) => {
//       if (err) {
//         console.error("Error al cerrar la base de datos:", err.message);
//       } else {
//         console.log("Base de datos cerrada");
//       }
//     });
//   });
// }

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs"); // Importa el módulo fs para leer archivos

// Conectar a la base de datos
const dbPath = path.resolve(__dirname, "mydatabase.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos SQLite");

    // Comprobar si hay registros con image o video = NULL
    db.all(
      "SELECT * FROM movies WHERE image IS NULL OR video IS NULL",
      (err, rows) => {
        if (err) {
          console.error("Error al buscar registros nulos:", err.message);
        } else if (rows.length > 0) {
          console.log(
            "Se encontraron registros con 'image' o 'video' nulo:",
            rows
          );

          // Eliminar registros con image o video = NULL
          db.run(
            "DELETE FROM movies WHERE image IS NULL OR video IS NULL",
            (err) => {
              if (err) {
                console.error(
                  "Error al eliminar registros con image o video nulo:",
                  err.message
                );
              } else {
                console.log("Registros con 'image' o 'video' nulo eliminados");

                // Continuar con la creación de la nueva tabla y copiado de datos
                continuarProceso();
              }
            }
          );
        } else {
          console.log("No se encontraron registros con 'image' o 'video' nulo");

          // Continuar con la creación de la nueva tabla y copiado de datos
          continuarProceso();
        }
      }
    );
  }
});

// Función para continuar con la creación de la nueva tabla y copiado de datos
function continuarProceso() {
  db.serialize(() => {
    // Crear la nueva tabla
    db.run(
      `CREATE TABLE IF NOT EXISTS movies_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT UNIQUE NOT NULL,
        video TEXT UNIQUE NOT NULL,
        description TEXT
      )`,
      (err) => {
        if (err) {
          console.error("Error al crear la nueva tabla:", err.message);
        } else {
          console.log("Nueva tabla 'movies_new' creada");

          // Copiar los datos de la tabla antigua a la nueva, omitiendo registros con 'image' o 'video' nulo
          db.run(
            `INSERT INTO movies_new (id, name, image, video, description)
             SELECT id, name, image, video, description FROM movies
             WHERE image IS NOT NULL AND video IS NOT NULL`, // Omitir registros con 'image' o 'video' nulo
            (err) => {
              if (err) {
                console.error("Error al copiar datos:", err.message);
              } else {
                console.log("Datos copiados a la nueva tabla");

                // Eliminar la tabla antigua
                db.run(`DROP TABLE movies`, (err) => {
                  if (err) {
                    console.error(
                      "Error al eliminar la tabla antigua:",
                      err.message
                    );
                  } else {
                    console.log("Tabla antigua eliminada");

                    // Renombrar la nueva tabla a 'movies'
                    db.run(`ALTER TABLE movies_new RENAME TO movies`, (err) => {
                      if (err) {
                        console.error(
                          "Error al renombrar la tabla:",
                          err.message
                        );
                      } else {
                        console.log("Tabla renombrada a 'movies'");

                        // Insertar los datos desde el archivo JSON
                        insertarPeliculas();
                      }
                    });
                  }
                });
              }
            }
          );
        }
      }
    );
  });
}

// Función para insertar películas desde el archivo JSON
function insertarPeliculas() {
  const insertStmt = db.prepare(
    "INSERT INTO movies (name, image, video, description) VALUES (?, ?, ?, ?)"
  );

  // Leer el archivo JSON
  fs.readFile(path.resolve(__dirname, "movies.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON:", err.message);
      return;
    }

    // Parsear el JSON y obtener las películas
    const movies = JSON.parse(data);

    // Insertar cada película en la base de datos
    movies.forEach((movie) => {
      insertStmt.run(
        movie.name,
        movie.image,
        movie.video,
        movie.description,
        (err) => {
          if (err) {
            console.error("Error al insertar datos:", err.message);
          } else {
            console.log(`Datos insertados: ${movie.name}`);
          }
        }
      );
    });

    insertStmt.finalize(() => {
      db.close((err) => {
        if (err) {
          console.error("Error al cerrar la base de datos:", err.message);
        } else {
          console.log("Base de datos cerrada");
        }
      });
    });
  });
}
