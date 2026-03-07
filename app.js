const express = require("express");
const app = express();
const cors = require("cors"); // Memanggil alat cors
app.use(cors()); // Mengaktifkan cors untuk semua pengunjung
const mysql = require("mysql2");

// Pengaturan alamat dan kunci kulkas (database)
const databaseMySQL = mysql.createConnection({
  host: "mysql-260172d4-putrapandu530-9e8c.a.aivencloud.com",
  port: "15590",
  user: "avnadmin",
  password: "AVNS_ir1bA1cXidrHaJe6nAD", // Bawaan XAMPP memang kosong
  database: "defaultdb",
  ssl: { rejectUnauthorized: false },
});

// Mengetes apakah koneksi berhasil
databaseMySQL.connect(function (error) {
  if (error) {
    console.log("Gagal terhubung ke database:", error);
  } else {
    console.log("Berhasil terhubung ke database MySQL! 🔌");
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

  db.query(sql, (err, hasil) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Gagal mengambil data dari kulkas awan.");
    }
    // Mengirimkan hasil bacaan dari database ke browser
    res.json(hasil);
  });
});

// Menyalakan server di port 3000
app.listen(3000, function () {
  console.log("Server sudah menyala di port 3000");
});
