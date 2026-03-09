const express = require("express");
const app = express();
const cors = require("cors"); // Memanggil alat cors
app.use(cors()); // Mengaktifkan cors untuk semua pengunjung
const mysql = require("mysql2");

// // Pengaturan alamat dan kunci kulkas (database)
// const databaseMySQL = mysql.createConnection({
//   host: "mysql-260172d4-putrapandu530-9e8c.a.aivencloud.com",
//   port: "15590",
//   user: "avnadmin",
//   password: "AVNS_ir1bA1cXidrHaJe6nAD", // Bawaan XAMPP memang kosong
//   database: "defaultdb",
//   ssl: { rejectUnauthorized: false },
// });

// // Mengetes apakah koneksi berhasil
// databaseMySQL.connect(function (error) {
//   if (error) {
//     console.log("Gagal terhubung ke database:", error);
//   } else {
//     console.log("Berhasil terhubung ke database MySQL! 🔌");
//   }
// });

// Pengaturan alamat dan kunci kulkas (database) dengan sistem Pool
const databaseMySQL = mysql.createPool({
  host: "mysql-260172d4-putrapandu530-9e8c.a.aivencloud.com",
  port: "15590",
  user: "avnadmin",
  password: "AVNS_ir1bA1cXidrHaJe6nAD",
  database: "defaultdb",
  ssl: { rejectUnauthorized: false },
});

// Mengetes apakah kolam koneksi berhasil
databaseMySQL.getConnection(function (error, connection) {
  if (error) {
    console.log("Gagal terhubung ke kolam database:", error);
  } else {
    console.log("Berhasil terhubung ke database MySQL dengan sistem Pool! 🔌");
    connection.release(); // Menutup telepon tes agar salurannya bisa dipakai oleh rute lain
  }
});

// Pengaturan agar pelayan bisa membaca data JSON (Objek)
app.use(express.json());

// Rute GET: Jika klien berkunjung ke halaman depan ('/')
app.get("/", function (request, response) {
  response.send("Selamat datang di API Privat Al Faiz!");
});

// Rute POST: Menerima dan menyimpan data lamaran
app.post("/lamar", function (request, response) {
  let dataPelamar = request.body;

  let skorKecocokan = 0;

  if (dataPelamar.usia >= 0 && dataPelamar.usia <= 30) {
    skorKecocokan += 50;
    console.log("Skor Kecocokan AI:", skorKecocokan);
  }

  // 1. Rancangan perintah SQL
  let perintahSQL = "INSERT INTO lamaran (nama, usia) VALUES (?, ?)";

  // 2. Data yang akan mengisi tanda ?
  let nilaiYangDimasukkan = [dataPelamar.nama, dataPelamar.usia];

  // 3. Eksekusi ke database
  databaseMySQL.query(perintahSQL, nilaiYangDimasukkan, function (error) {
    if (error) {
      console.log("Gagal menyimpan data:", error);
      response.send("Maaf, terjadi kesalahan di server.");
    } else {
      console.log("Data Budi berhasil masuk kulkas! 💾");
      response.send("Lamaran berhasil diterima dan disimpan!");
    }
  });
});

// Loket untuk HRD melihat data (Fungsi READ)
app.get("/lihat-data", (req, res) => {
  const sql = "SELECT * FROM lamaran";

  databaseMySQL.query(sql, (err, hasil) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Gagal mengambil data dari kulkas awan.");
    }
    // Mengirimkan hasil bacaan dari database ke browser
    res.json(hasil);
  });
});

// Loket untuk HRD menghapus data (Fungsi DELETE)
app.delete("/hapus-data/:id", (req, res) => {
  // Menangkap nomor ID dari alamat URL
  const targetId = req.params.id;

  // Perintah SQL dengan target spesifik
  const sql = "DELETE FROM lamaran WHERE id = ?";

  // Mengeksekusi perintah hapus
  databaseMySQL.query(sql, [targetId], (err, hasil) => {
    if (err) {
      console.error("Gagal menghapus:", err);
      return res.status(500).send("Gagal menghapus data dari kulkas awan.");
    }
    res.send("Data lamaran berhasil dihapus!");
  });
});

// Loket untuk HRD memperbarui data (Fungsi UPDATE)
app.put("/update-data/:id", (req, res) => {
  const targetId = req.params.id;
  const usiaBaru = req.body.usia; // Menangkap data usia baru dari paket yang dikirim

  // Perintah SQL untuk mengubah usia berdasarkan ID
  const sql = "UPDATE lamaran SET usia = ? WHERE id = ?";

  // Mengeksekusi perintah perbarui (perhatikan urutan array: usiaBaru dulu, lalu targetId)
  databaseMySQL.query(sql, [usiaBaru, targetId], (err, hasil) => {
    if (err) {
      console.error("Gagal memperbarui:", err);
      return res.status(500).send("Gagal memperbarui data di kulkas awan.");
    }
    res.send("Data usia berhasil diperbarui!");
  });
});

// Menyalakan server di port 3000
app.listen(3000, function () {
  console.log("Server sudah menyala di port 3000");
});
