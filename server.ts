import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// JIKA ANDA INGIN MENULISKAN API KEY LANGSUNG DI DALAM KODE (MISAL UNTUK DEPLOY VERCEL):
// Ganti string kosong di bawah ini dengan API Key Gemini Anda (contoh: "AIzaSy...")
const HARDCODED_GEMINI_API_KEY = "AIzaSyCBNswQlq2ZE1eNMSWTBtEYkbpSeuH2B6M";

// Initialize GenAI safely using process.env.GEMINI_API_KEY or user-provided key
// User-Agent must be 'aistudio-build'
function getGenAIWithKey(userApiKey?: string) {
  const apiKey = userApiKey?.trim() || HARDCODED_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Kunci API Gemini tidak ditemukan pada sistem. Silakan masukkan Kunci API Gemini Anda di dalam kode (server.ts) atau di menu Pengaturan.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function getGenAI() {
  return getGenAIWithKey();
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Document Generation API
app.post("/api/generate", async (req, res) => {
  try {
    const {
      docType,
      commonData,
      specificData,
      settings,
    } = req.body;

    // Mapping Doc Type labels
    const docLabels: Record<string, string> = {
      "cp-tp-atp": "Analisis CP, TP, dan ATP (Setahun)",
      "modul-ajar": "Modul Ajar Deep Learning (Mindful, Meaningful, Joyful)",
      "modul-koku": "Modul Kokurikuler (P5)",
      "soal": "Generator Soal & Kisi-Kisi Asesmen",
      "prota": "Program Tahunan (Prota)",
      "prosem": "Program Semester (Prosem)",
      "kktp": "Penyusunan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)",
      "lkpd": "Lembar Kerja Peserta Didik (LKPD)",
      "cover": "Cover Administrasi",
    };

    const docName = docLabels[docType] || "Dokumen Administrasi Guru";

    // Set Up prompts based on deep learning & curriculum requirements
    const systemPrompt = `Anda adalah asisten ahli kurikulum nasional, perangkat ajar, asesmen, dan dokumen administrasi guru berlisensi resmi. Tugas Anda adalah menyusun dokumen pembelajaran yang sangat lengkap, kontekstual, terperinci, rapi, dan siap pakai sesuai dengan seluruh standar regulasi terbaru di Indonesia:
- Permendikdasmen No. 13 Tahun 2025
- Keputusan Kepala BSKAP No. 046/H/KR/2025

Prinsip Utama Penyusunan Modul Ajar (Pembelajaran Mendalam / DEEP LEARNING):
Anda wajib mengintegrasikan Tiga Pilar Utama Pembelajaran Mendalam (Deep Learning) secara terperinci ke dalam langkah pembelajaran inti:
1. Mindful (Berkesadaran): Menghargai keunikan siswa, menciptakan kesadaran penuh dalam belajar, serta menyediakan jalur belajar adaptif. (Aktivitas pembuka berfokus pada ketenangan emosi/kehadiran utuh, misal: hening sejenak, teknik bernapas, sharing perasaan).
2. Meaningful (Bermakna): Menghubungkan konsep sains/teori dengan tantangan hidup nyata, nilai-nilai sosial, serta implikasinya secara konkret. (Mengapa materi ini penting, apa relevansinya dengan kehidupan mereka).
3. Joyful (Menggembirakan): Memicu rasa ingin tahu alami siswa, melakukan eksperimen/penemuan konsep mandiri yang memuaskan jiwa penjelajah mereka. (Game akademis, tantangan kolaboratif, petualangan eksplorasi).

Kriteria Pengukuran Karakter:
Sesuai regulasi terbaru, gantikan penggunaan Profil Pelajar Pancasila lama dengan delapan Dimensi Profil Lulusan berikut:
1. Keimanan/ketakwaan
2. Kewargaan
3. Penalaran kritis
4. Kreativitas
5. Kemandirian
6. Kolaborasi
7. Kesehatan
8. Komunikasi

ATURAN FORMAT DOKUMEN PRESET ELEGAN (STRICT HTML & COLOR SCHEME):
1. Hasil generate HANYA berformat HTML murni di dalam tag root atau langsung teks HTML (Tanpa tag <html>, <head>, atau <body>). Jangan berikan penjelasan teks pembuka atau penutup di luar HTML, HANYA HTML murni!
2. TATA LETAK & PERATAAN PARAGRAF Wajib Rapi (Justify): Semua penjelasan, langkah kegiatan, deskripsi, rubrik, dan isi materi wajib menggunakan format rata kanan-kiri yang rapi. Terapkan inline style jika perlu: style="text-align: justify;".
3. Skema Warna Hidup & Profesional:
   - Judul Heading 1 (h1) dan Heading 2 (h2) wajib diberi warna aksen biru navy royal (#1e3a8a atau #1d4ed8) untuk membangun hirarki visual yang hidup.
   - Tabel bergaris tipis abu-abu (#cbd5e1). Baris tajuk tabel (th) wajib memiliki latar belakang berwarna biru navy (#1e3a8a) dengan warna teks putih bersih (#ffffff) dan ketebalan font semibold.
   - Baris tabel zebra striping tipis: gunakan selang-seling baris genap berwarna abu-abu sangat muda (#f8fafc) dan baris ganjil berwarna putih bersih (#ffffff).
4. Callout Box Informatif: Bungkus bagian krusial seperti apersepsi utama, instruksi keselamatan, atau pemetaan diferensiasi di dalam kotak berwarna:
   <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; color: #1e3a8a; text-align: justify;">[Konten Penting]</div>
5. Penomoran Otomatis Wajib: Selalu gunakan tag <ol> dan <li> untuk penomoran terurut, serta <ul> dan <li> untuk penjelasan poin. Jangan mengetik nomor atau simbol secara manual di dalam teks.
6. Pilihan Ganda Terstruktur: Jika terdapat soal ujian pilihan ganda, urutkan opsi menggunakan huruf kecil (a., b., c., d., e.). Gunakan format grid atau baris yang rapi.
7. Cover Eksklusif Satu Halaman Penuh: Selalu awali dokumen dengan cover premium satu halaman penuh. JANGAN gunakan/tampilkan nama yayasan, CUKUP NAMA SEKOLAH saja untuk kop instansi. Gunakan judul besar berwarna biru navy. Sajikan identitas secara rapi dalam TABEL IDENTITAS (meliputi Nama Penyusun, NIP/NUPTK, Tahun Ajaran, Semester, Fase, Kelas, Mata Pelajaran, dll) di bagian tengah cover, dan diakhiri dengan pembatas halaman cetak: <hr class="page-break-indicator" style="page-break-after: always; break-after: page; display: block; border: none; border-top: 2px dashed #3b82f6; margin: 40px 0;" />
8. Lampiran Terpisah: Selalu letakkan LKPD, Rubrik Asesmen dan kunci jawaban di bagian paling belakang (Lampiran) dengan didahului pembatas halaman cetak: <hr class="page-break-indicator" style="page-break-before: always; break-before: page; border: none; border-top: 2px dashed #3b82f6; margin: 40px 0;" />
9. Dokumen yang dihasilkan harus SANGAT LENGKAP tanpa ada bagian yang sengaja diringkas atau terpotong dengan kata-kata penjelas malas.
10. Untuk setiap teks/tulisan berbahasa Arab (seperti ayat Al-Quran, doa, hadits, dsb.), WAJIB dibungkus dengan tag HTML: <div class="arabic-text" dir="rtl">[teks arab]</div>. Gunakan tag tersebut untuk setiap blok bahasa Arab agar ditampilkan dengan benar.
11. Orientasi Halaman Portrait: JANGAN membuat tabel yang memanjang secara horizontal. Buatlah rancangan tabel sedemikian rupa agar tetap proporsional dan muat dalam satu halaman portrait (vertikal). Jika data banyak, gunakan struktur tumpuk, kurangi jumlah kolom, atau gunakan sub-judul baris daripada kolom tambahan.
12. STRUKTUR KONTEN TERKUNCI (HARGA MATI): Anda WAJIB mengikuti urutan dan nama bagian persis seperti kerangka dokumen yang diminta di bawah ini. JANGAN mengurangi, mengubah nama, atau mengubah urutan sedikitpun.`;

    const docPrompt = `
Buatlah dokumen: **${docName}**

INFORMASI IDENTITAS & AKADEMIK:
- Nama Sekolah/Madrasah: ${settings?.namaSekolah || "Sekolah Contoh"}
- Guru/Penyusun: ${settings?.namaGuru || "Nama Guru"}
- NIP Guru: ${settings?.nip || "-"}
- Kepala Sekolah: ${settings?.namaKepsek || "Nama Kepala Sekolah"}
- NIP Kepala Sekolah: ${settings?.nipKepsek || "-"}
- Kota/Kabupaten: ${settings?.kota || "Kota"}
- Jenjang: ${commonData?.jenjang || "-"}
- Kelas: ${commonData?.kelas || "-"}
- Fase: ${commonData?.fase || "-"}
- Semester: ${commonData?.semester || "-"}
- Tahun Ajaran: ${commonData?.tahunAjaran || "-"}

SPESIFIKASI MATA PELAJARAN:
- Mata Pelajaran: ${specificData?.mapel || "Pelajaran"}
- Materi Pokok/Tema: ${docType === "soal" && specificData?.jenisUjian?.match(/(STS|SAS|SAT)/) 
    ? (Array.isArray(specificData.babList) && specificData.babList.filter(Boolean).length > 0 ? specificData.babList.filter(Boolean).join(", ") : "Semua Bab/Materi Pokok yang Relevan")
    : (!specificData?.materiPokok || specificData?.materiPokok.trim() === "-" || specificData?.materiPokok.trim() === "" ? "[Data dikosongkan oleh pengguna: Tolong AI jabarkan, rincikan, dan susun otomatis materi pokok yang paling relevan (sesuai untuk satu tahun/satu semester/modul ini) berdasarkan Fase, Kelas, dan Mata Pelajaran. Jika lebih dari satu materi, susun menggunakan format numbering (1. Judul Materi, 2. Judul Materi, dst)]" : specificData.materiPokok)}
- Alokasi Waktu: ${specificData?.alokasiWaktu || "2 JP (2 x 45 menit)"}

KOMPONEN PENDUKUNG UTAMA (WAJIB DIBAHAS DAN DIINTEGRASIKAN SECARA MENDALAM):
- Capaian Pembelajaran (CP) & Elemen CP: ${!specificData?.cp || specificData?.cp.trim() === "-" || specificData?.cp.trim() === "" ? "[Data dikosongkan oleh pengguna: Tolong AI carikan, lengkapi, dan jabarkan otomatis Elemen CP beserta deskripsi Capaian Pembelajaran terbaru dari BSKAP (Keputusan Kepala BSKAP No. 046/H/KR/2025) yang paling valid untuk Fase, Kelas, dan Mata Pelajaran ini]" : specificData.cp}
- Tujuan Pembelajaran (TP): ${specificData?.tp || "TP Ditentukan otomatis"}
- Dimensi Profil Pelajar Pancasila: (AI HARAP TENTUKAN OTOMATIS SESUAI MAPEL DAN MATERI)
- Mitra Belajar: ${Array.isArray(specificData?.mitra) && specificData.mitra.length ? specificData.mitra.join(", ") : "Sesama Rekan Guru"}
- Pembelajaran Terdiferensiasi (TaRL): ${specificData?.isTarl ? `Ya. Kelompok Mahir: ${specificData.tarlMahir}, Kelompok Cakap: ${specificData.tarlCakap}, Kelompok Butuh Bimbingan: ${specificData.tarlBimbingan}` : "Standar Umum"}
- Model Pembelajaran: ${specificData?.model || "Problem Based Learning"}
- Metode Pembelajaran: ${specificData?.metode || "Diskusi Kelompok, Tanya Jawab"}
- Lingkungan Belajar: ${specificData?.lingkungan || "Kelas Indoor"}
- Media dan Sumber Belajar: ${specificData?.media || "Buku Paket, Internet, Proyektor"}

DIBAWAH INI ADALAH DETAIL KHUSUS UNTUK TIAP JENIS DOKUMEN:
${
  docType === "cp-tp-atp"
    ? `
- Jumlah Target TP yang Diharapkan: ${specificData?.jumlahTp || "Disesuaikan otomatis oleh AI berdasarkan keluasan materi"}
- Jumlah Pertemuan / Alokasi: ${specificData?.jumlahPertemuan || "Disesuaikan otomatis oleh AI berdasarkan jumlah TP dan materi"}

Susun dokumen CP, TP, ATP dengan bagian-bagian berikut WAJIB secara berurutan dan persis tanpa diubah:
1. Identitas dokumen
2. Capaian Pembelajaran
3. Analisis CP
4. Tujuan Pembelajaran
5. Indikator TP
6. ATP
7. Materi pokok
8. Aktivitas pembelajaran
9. Bentuk asesmen
10. Tabel CP, TP, ATP`
    : ""
}
${
  docType === "modul-ajar"
    ? `
Susun Modul Ajar Deep Learning yang kaya dan interaktif menggunakan Tiga Pilar Pembelajaran Mendalam. Anda WAJIB menyertakan semua bagian berikut di dalam hasil generate secara berurutan dan persis tanpa diubah:
1. Identitas Modul
2. Kompetensi Awal
3. Profil Lulusan
4. Sarana dan Prasarana
5. Target Peserta Didik
6. Model Pembelajaran
7. Tujuan Pembelajaran
8. Pemahaman Bermakna
9. Pertanyaan Pemantik
10. Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup)
11. Integrasi Deep Learning
12. Asesmen Diagnostik
13. Asesmen Formatif
14. Asesmen Sumatif
15. Remedial
16. Pengayaan
17. Refleksi Guru
18. Refleksi Peserta Didik
19. LKPD
20. Rubrik Penilaian`
    : ""
}
${
  docType === "prota"
    ? `
Susun dokumen Program Tahunan (Prota) dengan menyertakan hal-hal berikut WAJIB secara berurutan dan persis tanpa diubah:
Daftar Bab/Materi: ${specificData?.babList ? specificData.babList.join(", ") : "Bab I, Bab II, Bab III"}

1. Identitas program tahunan
2. Capaian pembelajaran
3. Daftar materi satu tahun
4. Jumlah minggu efektif
5. Distribusi alokasi waktu
6. Program semester ganjil
7. Program semester genap
8. Jadwal asesmen
9. Keterangan kegiatan sekolah
10. Tabel program tahunan`
    : ""
}
${
  docType === "prosem"
    ? `
Susun dokumen Program Semester (Prosem) untuk Semester ${commonData?.semester || "Ganjil"} dengan menyertakan hal-hal berikut WAJIB secara berurutan dan persis tanpa diubah:
Daftar Bab/Materi: ${specificData?.babList ? specificData.babList.join(", ") : "Bab I, Bab II, Bab III"}

1. Identitas program semester
2. Capaian pembelajaran
3. Daftar materi satu semester
4. Jumlah minggu efektif semester
5. Distribusi materi per bulan
6. Distribusi materi per minggu
7. Alokasi waktu
8. Tujuan pembelajaran
9. Jadwal asesmen
10. Keterangan
11. Tabel program semester`
    : ""
}
${
  docType === "kktp"
    ? `
Susun dokumen Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) dengan menyertakan hal-hal berikut WAJIB secara berurutan dan persis tanpa diubah:
1. Identitas KKTP
2. Capaian pembelajaran
3. Tujuan pembelajaran
4. Indikator ketercapaian
5. Kriteria ketercapaian
6. Interval nilai
7. Deskripsi capaian
8. Teknik penilaian
9. Instrumen penilaian
10. Tindak lanjut
11. Tabel KKTP`
    : ""
}
${
  docType === "lkpd"
    ? `
Susun dokumen Lembar Kerja Peserta Didik (LKPD) dengan menyertakan hal-hal berikut WAJIB secara berurutan dan persis tanpa diubah:
Jenis LKPD: ${specificData?.jenisLkpd || "Eksperimen / Praktikum"}
Bentuk Tugas: ${specificData?.bentukTugas || "Makalah/Unjuk Kerja"}
${specificData?.soalMandiri ? `PERTANYAAN / SOAL MANDIRI YANG WAJIB DIGUNAKAN DAN DISAJIKAN:\n${specificData.soalMandiri}\n(Catatan: Gunakan persis daftar soal/pertanyaan mandiri di atas untuk bagian Pertanyaan Diskusi / Analisis, jangan digenerate otomatis)` : ""}

1. Identitas LKPD (Judul, Nama Siswa, Kelas)
2. Tujuan Kegiatan
3. Alat dan Bahan (Jika Relevan)
4. Langkah-Langkah Kegiatan / Petunjuk Kerja
5. Lembar Pengamatan / Tabel Data
6. Pertanyaan Diskusi / Analisis ${specificData?.soalMandiri ? "(Gunakan daftar pertanyaan mandiri yang diberikan di atas)" : ""}
7. Kesimpulan
8. Rubrik Penilaian LKPD`
    : ""
}
${
  docType === "cover"
    ? `
Susun Cover / Sampul Dokumen Administrasi Guru dengan menyertakan hal-hal berikut secara elegan:
Dokumen: ${specificData?.jenisDokumen || "Modul Ajar"}
Tahun Ajaran: ${specificData?.tahunPembuatan || "2024/2025"}

Desain cover yang profesional, menggunakan judul besar di tengah, memuat semua identitas lengkap sekolah, guru, kepala sekolah, mapel, kelas, dan tahun ajaran secara proporsional. Pastikan layout menarik untuk halaman depan.`
    : ""
}

Kembalikan dokumen rancangan lengkap tersebut dalam format HTML murni. Ingat, HANYA HTML murni tanpa penjelasan teks lainnya di awal atau di akhir (tag <html> tidak perlu). Susun seindah, selengkap, dan sekonkret mungkin. Isi nama guru, nama sekolah, NIP, dsb di tempat-tempat yang sesuai untuk menjadikannya karya siap cetak kualitas premium.
`;

    let fullPrompt = `${systemPrompt}\n\n${docPrompt}`;

    if (docType === "cp-tp-atp") {
      fullPrompt = `Anda adalah pakar Kurikulum Merdeka, Deep Learning, dan penyusun perangkat ajar profesional Indonesia.

Data:
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Mata Pelajaran : ${specificData?.mapel || "[ISI DISINI]"}
Fase : ${commonData?.fase || "[ISI DISINI]"}
Kelas : ${commonData?.kelas || "[ISI DISINI]"}
Semester : ${commonData?.semester || "[ISI DISINI]"}
Tahun Pelajaran : ${commonData?.tahunAjaran || "[ISI DISINI]"}

Tugas:

1. Identifikasi dan tampilkan Capaian Pembelajaran (CP) yang sesuai dengan mata pelajaran, fase, dan jenjang.
2. Analisis CP secara mendalam.
3. Turunkan CP menjadi Tujuan Pembelajaran (TP) yang runtut, logis, terukur, dan berorientasi pada capaian kompetensi peserta didik.
4. Susun Alur Tujuan Pembelajaran (ATP) secara sistematis dari kemampuan dasar menuju kemampuan yang lebih kompleks.
5. Integrasikan pendekatan Deep Learning:
   - Mindful Learning
   - Meaningful Learning
   - Joyful Learning
6. Kaitkan dengan Profil Lulusan dan Profil Pelajar Pancasila yang relevan.
7. Sertakan rekomendasi strategi pembelajaran dan asesmen.

Output:
A. Identitas Dokumen
B. Capaian Pembelajaran (CP)
C. Analisis CP
D. Tujuan Pembelajaran (TP)
E. Alur Tujuan Pembelajaran (ATP)
F. Tabel ATP Lengkap (TP, Materi, Kegiatan, Alokasi Waktu, Asesmen)
G. Integrasi Deep Learning
H. Rekomendasi Implementasi Pembelajaran

Gunakan format profesional, sistematis, siap digunakan guru, dan sesuai regulasi pendidikan terbaru.`;
    } else if (docType === "kktp") {
      fullPrompt = `Anda adalah pakar asesmen Kurikulum Merdeka.

Data:
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Mata Pelajaran : ${specificData?.mapel || "[ISI DISINI]"}
Fase : ${commonData?.fase || "[ISI DISINI]"}
Kelas : ${commonData?.kelas || "[ISI DISINI]"}
Semester : ${commonData?.semester || "[ISI DISINI]"}
Tahun Pelajaran : ${commonData?.tahunAjaran || "[ISI DISINI]"}

Tujuan Pembelajaran:
${specificData?.tp || "[ISI DISINI]"}

Tugas:

1. Analisis setiap Tujuan Pembelajaran.
2. Susun indikator ketercapaian yang terukur.
3. Buat Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).
4. Susun rubrik penilaian 4 level:
   - Perlu Bimbingan
   - Cukup
   - Baik
   - Sangat Baik
5. Tentukan bentuk asesmen yang sesuai.
6. Sertakan rekomendasi remedial dan pengayaan.

Output:
A. Analisis TP
B. Indikator Ketercapaian
C. Tabel KKTP
D. Rubrik Penilaian
E. Bentuk Asesmen
F. Program Remedial
G. Program Pengayaan`;
    } else if (docType === "prota") {
      fullPrompt = `Anda adalah ahli perencanaan pembelajaran Kurikulum Merdeka.

Data:
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Mata Pelajaran : ${specificData?.mapel || "[ISI DISINI]"}
Fase : ${commonData?.fase || "[ISI DISINI]"}
Kelas : ${commonData?.kelas || "[ISI DISINI]"}
Tahun Pelajaran : ${commonData?.tahunAjaran || "[ISI DISINI]"}
Jumlah Minggu Efektif : ${specificData?.jumlahMingguEfektif || "[ISI DISINI]"}

Tugas:

1. Identifikasi CP sesuai mata pelajaran dan fase.
2. Petakan materi pokok selama satu tahun.
3. Distribusikan alokasi waktu berdasarkan minggu efektif.
4. Susun Program Tahunan secara sistematis.
5. Integrasikan pendekatan Deep Learning.

Output:
A. Analisis Materi Tahunan
B. Distribusi Alokasi Waktu
C. Tabel Program Tahunan (Prota)
D. Catatan Implementasi Deep Learning`;
    } else if (docType === "prosem") {
      fullPrompt = `Anda adalah ahli administrasi pembelajaran Kurikulum Merdeka.

Data:
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Mata Pelajaran : ${specificData?.mapel || "[ISI DISINI]"}
Fase : ${commonData?.fase || "[ISI DISINI]"}
Kelas : ${commonData?.kelas || "[ISI DISINI]"}
Semester : ${commonData?.semester || "[ISI DISINI]"}
Tahun Pelajaran : ${commonData?.tahunAjaran || "[ISI DISINI]"}

Program Tahunan:
${specificData?.prota || "[ISI DISINI]"}

Tugas:

1. Susun distribusi materi selama satu semester.
2. Tentukan alokasi waktu setiap topik.
3. Sesuaikan dengan minggu efektif semester.
4. Integrasikan pendekatan Deep Learning.
5. Sajikan dalam format Program Semester yang siap digunakan.

Output:
A. Analisis Semester
B. Distribusi Materi
C. Tabel Program Semester (Prosem)
D. Catatan Implementasi Deep Learning`;
    } else if (docType === "modul-ajar") {
      fullPrompt = `Anda adalah guru profesional dan ahli penyusun Modul Ajar Kurikulum Merdeka berbasis Deep Learning.

Data:
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Nama Guru : ${settings?.namaGuru || "[ISI DISINI]"}
Mata Pelajaran : ${specificData?.mapel || "[ISI DISINI]"}
Fase : ${commonData?.fase || "[ISI DISINI]"}
Kelas : ${commonData?.kelas || "[ISI DISINI]"}
Semester : ${commonData?.semester || "[ISI DISINI]"}
Tahun Pelajaran : ${commonData?.tahunAjaran || "[ISI DISINI]"}
Topik Materi : ${specificData?.materiPokok || "[ISI DISINI]"}
Alokasi Waktu : ${specificData?.alokasiWaktu || "[ISI DISINI]"}
Tujuan Pembelajaran : ${specificData?.tp || "[ISI DISINI]"}
Model Pembelajaran : ${specificData?.model || "Tatap Muka"}
Metode Pembelajaran : ${specificData?.metode || "[ISI DISINI]"}
Media Ajar / Sumber Belajar : ${specificData?.media || "[ISI DISINI]"}
Mitra Belajar : ${Array.isArray(specificData?.mitra) && specificData?.mitra.length > 0 ? specificData.mitra.join(", ") : "[ISI DISINI]"}

Susun Modul Ajar lengkap yang mencakup:

1. Identitas Modul
2. Kompetensi Awal
3. Profil Lulusan
4. Sarana dan Prasarana
5. Target Peserta Didik
6. Model Pembelajaran
7. Tujuan Pembelajaran
8. Pemahaman Bermakna
9. Pertanyaan Pemantik
10. Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup)
11. Integrasi Deep Learning
12. Asesmen Diagnostik
13. Asesmen Formatif
14. Asesmen Sumatif
15. Remedial
16. Pengayaan
17. Refleksi Guru
18. Refleksi Peserta Didik
19. LKPD
20. Rubrik Penilaian

Buat secara lengkap, rinci, siap cetak, dan siap digunakan di kelas.`;
    } else if (docType === "modul-koku") {
      fullPrompt = `Anda adalah ahli penyusun Modul Kokurikuler Kurikulum Merdeka.

Data:
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Fase : ${commonData?.fase || "[ISI DISINI]"}
Kelas : ${commonData?.kelas || "[ISI DISINI]"}
Semester : ${commonData?.semester || "[ISI DISINI]"}
Tahun Pelajaran : ${commonData?.tahunAjaran || "[ISI DISINI]"}
Tema : ${specificData?.temaP5 || "[ISI DISINI]"}
Topik Kegiatan : ${specificData?.topikP5 || "[ISI DISINI]"}
Durasi Kegiatan : ${specificData?.alokasiWaktu || "[ISI DISINI]"}

Susun Modul Kokurikuler yang lengkap.

Komponen:
1. Identitas Modul
2. Latar Belakang
3. Tujuan Kegiatan
4. Profil Lulusan
5. Profil Pelajar Pancasila
6. Target Peserta
7. Sarana dan Prasarana
8. Rangkaian Kegiatan
9. Jadwal Pelaksanaan
10. Instrumen Observasi
11. Rubrik Penilaian
12. Refleksi Peserta
13. Refleksi Guru
14. Dokumentasi yang Disarankan
15. Tindak Lanjut

Buat dalam format profesional siap digunakan sekolah.`;
    } else if (docType === "soal") {
      const materi = specificData?.jenisUjian?.match(/(STS|SAS|SAT)/) 
        ? (Array.isArray(specificData.babList) && specificData.babList.filter(Boolean).length > 0 ? specificData.babList.filter(Boolean).join(", ") : "Semua Bab/Materi Pokok yang Relevan")
        : (specificData?.materiPokok || "[ISI DISINI]");

      const bentukSoal = `Pilihan Ganda (${specificData?.pg || 0}), Isian (${specificData?.isian || 0}), Uraian/Esai (${specificData?.essay || 0}), Menjodohkan (${specificData?.jodoh || 0})`;
      const jumlahSoal = (Number(specificData?.pg) || 0) + (Number(specificData?.isian) || 0) + (Number(specificData?.essay) || 0) + (Number(specificData?.jodoh) || 0);

      fullPrompt = `Anda adalah ahli asesmen pendidikan dan penyusun soal profesional.

Data:
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Mata Pelajaran : ${specificData?.mapel || "[ISI DISINI]"}
Fase : ${commonData?.fase || "[ISI DISINI]"}
Kelas : ${commonData?.kelas || "[ISI DISINI]"}
Semester : ${commonData?.semester || "[ISI DISINI]"}
Tahun Pelajaran : ${commonData?.tahunAjaran || "[ISI DISINI]"}
Materi : ${materi}
Tujuan Pembelajaran : ${specificData?.tp || "[ISI DISINI]"}
Jumlah Soal : ${jumlahSoal > 0 ? `${jumlahSoal} Soal` : "[ISI DISINI]"}
Bentuk Soal : ${bentukSoal}
Level Kognitif : ${specificData?.fokusKognitif || "[ISI DISINI]"}

Tugas:

1. Analisis tujuan pembelajaran.
2. Susun kisi-kisi soal lengkap.
3. Buat soal sesuai jumlah yang diminta.
4. Variasikan tingkat kesulitan (mudah, sedang, sulit).
5. Susun kunci jawaban.
6. Buat pedoman penskoran.
7. Buat rubrik penilaian.
8. Integrasikan HOTS, literasi, dan numerasi jika relevan.
9. Susun rekomendasi remedial dan pengayaan.

Output:
A. Kisi-Kisi Soal
B. Paket Soal
C. Kunci Jawaban
D. Pedoman Penskoran
E. Rubrik Penilaian
F. Analisis HOTS
G. Program Remedial dan Pengayaan

Gunakan format profesional dan siap digunakan untuk asesmen sekolah.`;
    } else if (docType === "lkpd") {
      fullPrompt = `Anda adalah ahli penyusun Lembar Kerja Peserta Didik (LKPD) Kurikulum Merdeka.

Data:
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Mata Pelajaran : ${specificData?.mapel || "[ISI DISINI]"}
Fase : ${commonData?.fase || "[ISI DISINI]"}
Kelas : ${commonData?.kelas || "[ISI DISINI]"}
Materi Pokok : ${specificData?.materiPokok || "[ISI DISINI]"}
Jenis LKPD : ${specificData?.jenisLkpd || "Eksperimen"}
Bentuk Tugas : ${specificData?.bentukTugas || "[ISI DISINI]"}
${specificData?.soalMandiri ? `PERTANYAAN / SOAL MANDIRI YANG WAJIB DIINPUT DAN DIGUNAKAN (JANGAN DIGANTI):\n${specificData.soalMandiri}` : ""}

Susun LKPD yang menarik dan relevan untuk siswa, mencakup identitas, tujuan, alat & bahan, langkah kerja, lembar pengamatan/tabel, pertanyaan diskusi${specificData?.soalMandiri ? " (gunakan daftar soal mandiri di atas secara lengkap)" : ""}, kesimpulan, dan rubrik penilaian LKPD. Gunakan format profesional yang siap cetak.`;
    } else if (docType === "cover") {
      fullPrompt = `Anda adalah desainer dokumen administrasi pendidikan profesional kelas dunia.

Data:
Jenis Dokumen : ${specificData?.jenisDokumen || "Modul Ajar"}
Nama Sekolah : ${settings?.namaSekolah || "[ISI DISINI]"}
Mata Pelajaran : ${specificData?.mapel || "[ISI DISINI]"}
Jenjang : ${commonData?.jenjang || "[ISI DISINI]"}
Fase / Kelas : ${commonData?.fase || "-"} / ${commonData?.kelas || "-"}
Semester : ${commonData?.semester || "[ISI DISINI]"}
Tahun Pelajaran : ${specificData?.tahunPembuatan || "2024/2025"}
Nama Guru : ${settings?.namaGuru || "[ISI DISINI]"}
NIP Guru : ${settings?.nip || "[ISI DISINI]"}
Kepala Sekolah : ${settings?.namaKepsek || "[ISI DISINI]"}
NIP Kepala Sekolah : ${settings?.nipKepsek || "[ISI DISINI]"}
Kota : ${settings?.kota || "[ISI DISINI]"}

PETUNJUK DESAIN COVER (WAJIB DALAM BENTUK GAMBAR / VISUAL PENUH YANG SANGAT INDAH):
Rancang cover ini agar tampak seperti satu halaman gambar sampul buku cetak berkualitas premium yang sangat artistik, bukan sekadar teks polos. 
1. Gunakan background halaman penuh (full-bleed) dengan gradasi warna biru navy royal mewah ke ungu gelap (CSS gradient) atau skema warna yang kontras tinggi dan hidup.
2. Berikan bingkai (border) dekoratif ganda beraksen emas atau putih yang elegan di sekeliling halaman.
3. Buat judul dokumen ("${specificData?.jenisDokumen || "Modul Ajar"}") di bagian tengah atas dengan ukuran font ekstra besar, tebal, bayangan teks (text-shadow) halus, dan warna emas atau putih bersinar.
4. Buat sub-judul yang memuat Mata Pelajaran dan Kelas dengan gaya minimalis modern di bawah judul utama.
5. Tempatkan logo/ornamen dekoratif geometris atau ikon abstrak menggunakan CSS murni di tengah halaman untuk memberikan kesan visual yang kuat.
6. Susun tabel/kotak identitas guru dan kepala sekolah di bagian bawah dengan latar belakang semi-transparan (backdrop-filter blur atau rgba) yang sangat mewah dan simetris.
7. Pastikan seluruh elemen ditata secara presisi sehingga terlihat seperti sebuah karya desain grafis / gambar utuh yang memanjakan mata saat dicetak atau dilihat. Jangan sertakan teks instruksi apa pun di luar HTML.`;
    }

    const htmlOutput = `
<div style="font-family: sans-serif; color: #334155; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
  <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
    <h3 style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 16px;">✨ Prompt AI Berhasil Dibuat</h3>
    <p style="margin: 0; font-size: 14px; color: #1e40af;">Salin seluruh teks di bawah ini dan tempelkan ke ChatGPT, Gemini, Claude, atau AI lainnya untuk menghasilkan dokumen administrasi Anda.</p>
  </div>
  
  <div style="position: relative;">
    <pre style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #cbd5e1; overflow-x: auto; font-family: monospace; font-size: 13px; line-height: 1.5; white-space: pre-wrap; color: #1e293b;">${fullPrompt
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</pre>
  </div>
</div>
`;

    res.json({ html: htmlOutput });

  } catch (err: any) {
    console.error("Kesalahan pembuatan prompt:", err.message);
    res.status(500).json({ error: err.message || "Gagal membuat prompt." });
  }
});

// Test Gemini API Key
app.post("/api/test-api-key", async (req, res) => {
  try {
    const { geminiApiKey, modelName } = req.body;
    const testAi = getGenAIWithKey(geminiApiKey);
    const response = await testAi.models.generateContent({
      model: modelName || "gemini-2.5-flash",
      contents: "Test connection. Reply with 'ok'.",
    });
    
    if (response && response.text) {
      return res.json({ success: true, message: "Sukses, API Key Berfungsi!" });
    } else {
      return res.status(400).json({ error: "Respon kosong dari model. Silakan periksa pengaturan." });
    }
  } catch (err: any) {
    console.error("Kesalahan pengujian API Key:", err);
    return res.status(400).json({ error: err.message || "Gagal memverifikasi API. Pastikan sistem dikonfigurasi dengan benar." });
  }
});

// Auto-Suggest Elemen CP API
app.post("/api/suggest-elemen", async (req, res) => {
  try {
    const { mapel, fase, jenjang, modelName, geminiApiKey } = req.body;
    
    if (!mapel) {
      return res.status(400).json({ error: "Mata pelajaran harus diisi" });
    }

    const ai = getGenAIWithKey(geminiApiKey);
    const response = await ai.models.generateContent({
      model: modelName || "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{
            text: `Berikan daftar Elemen Capaian Pembelajaran (CP) untuk mata pelajaran ${mapel} pada jenjang ${jenjang || "SD/SMP/SMA"} fase ${fase || "Fase B"} berdasarkan Kurikulum Merdeka di Indonesia. \nKeluarkan HANYA nama-nama elemennya saja, dipisahkan dengan tanda koma (contoh: Pemahaman Sains, Keterampilan Proses). Jangan ada kata pembuka, penutup, bullet point, penjelasan, huruf kapital di awal kalimat respon yang bukan nama elemen, atau penomoran.`
          }]
        }
      ]
    });

    let output = response.text || "";
    output = output.replace(/\n[-*]?\s*/g, ', ').replace(/, \s*,/g, ',').trim();
    if (output.endsWith(",")) output = output.slice(0, -1);
    
    res.json({ elemenCp: output });
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')) {
      console.error(`[Gemini API] Quota Exceeded (429) on suggest-elemen`);
      res.status(429).json({ error: "Batas kuota API habis. Silakan coba beberapa saat lagi." });
    } else {
      console.error("Kesalahan suggest elemen:", err.message);
      res.status(500).json({ error: err.message || "Gagal menghasilkan elemen CP." });
    }
  }
});

// Auto-Suggest Materi Pokok API
app.post("/api/suggest-materi-pokok", async (req, res) => {
  try {
    const { mapel, fase, jenjang, modelName, geminiApiKey } = req.body;
    
    if (!mapel) {
      return res.status(400).json({ error: "Mata pelajaran harus diisi" });
    }

    const ai = getGenAIWithKey(geminiApiKey);
    const response = await ai.models.generateContent({
      model: modelName || "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{
            text: `Rincikan daftar Materi Pokok / Bahasan Inti untuk mata pelajaran ${mapel} pada jenjang ${jenjang || "SD/SMP/SMA"} fase ${fase || "Fase B"} selama satu tahun ajaran (Semester 1 dan 2) berdasarkan Kurikulum Merdeka.\nKeluarkan HANYA format numbering judul materinya saja (contoh: \n1. Judul Materi Pertama\n2. Judul Materi Kedua\n3. Judul Materi Ketiga).\nJangan sertakan kata pembuka, penjelasan, atau teks tambahan apapun selain daftar tersebut.`
          }]
        }
      ]
    });

    let output = response.text || "";
    output = output.trim();
    
    res.json({ materiPokok: output });
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')) {
      console.error(`[Gemini API] Quota Exceeded (429) on suggest-materi-pokok`);
      res.status(429).json({ error: "Batas kuota API habis. Silakan coba beberapa saat lagi." });
    } else {
      console.error("Kesalahan suggest materi:", err.message);
      res.status(500).json({ error: err.message || "Gagal menghasilkan materi pokok." });
    }
  }
});

// Configure Vite or Static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
