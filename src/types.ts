export interface TeacherSettings {
  namaSekolah: string;
  kota: string;
  namaGuru: string;
  nip: string;
  namaKepsek: string;
  nipKepsek: string;
  aiModel?: string;
  geminiApiKey?: string;
}

export interface CommonData {
  jenjang: string;
  kelas: string;
  fase: string;
  semester: string;
  tahunAjaran: string;
}

export interface SpecificData {
  mapel: string;
  materiPokok: string;
  cp: string;
  tp: string;
  alokasiWaktu: string;
  dimensiPPP: string[];
  mitra: string[];
  isTarl: boolean;
  tarlMahir: string;
  tarlCakap: string;
  tarlBimbingan: string;
  model: string;
  metode: string;
  lingkungan: string;
  media: string;
  temaP5: string;
  topikP5: string;
  jenisUjian: string;
  fokusKognitif: string;
  pg: number;
  isian: number;
  essay: number;
  jodoh: number;
  instruksiSoal: string;
  babList: string[];

  // Identitas Tambahan
  elemenCp: string;
  
  // Form Tambahan "CP, TP, ATP"
  sumberCp: string;
  jumlahTp: string;
  jumlahPertemuan: string;
  tingkatDetail: string;

  // Form Tambahan "Modul Ajar"
  karakteristikPesertaDidik: string;

  // Form Tambahan "Modul Kokurikuler"
  bentukKegiatan: string;
  produkAkhir: string;

  // Form Tambahan "Prota & Prosem"
  jpPerMinggu: string;
  jumlahMingguEfektif: string;
  jadwalAsesmen: string;
  jumlahMingguEfektifSemester: string;
  bulanEfektif: string;

  // Form Tambahan "KKTP"
  modelKktp: string;
  rentangNilai: string;
  teknikPenilaian: string;

  // Form Tambahan "Buat Soal & Kisi-Kisi"
  bentukSoalList: string[];
  jumlahPilihanJawaban: string;
  gunakanStimulus: boolean;
  outputYangDibuat: string[];
  prota?: string;

  // Form Tambahan "LKPD"
  jenisLkpd?: string;
  bentukTugas?: string;
  soalMandiri?: string;

  // Form Tambahan "Cover"
  jenisDokumen?: string;
  tahunPembuatan?: string;
}

export interface GeneratedDocument {
  id: string;
  docType: string;
  title: string;
  html: string;
  timestamp: string;
  commonData: CommonData;
  specificData: SpecificData;
  settings: TeacherSettings;
}

export const MENU_ITEMS = [
  { id: "beranda", label: "Beranda Utama", icon: "Home", desc: "Menu awal dan info sistem" },
  { id: "cp-tp-atp", label: "CP, TP, ATP", icon: "Target", desc: "Alur Tujuan Pembelajaran" },
  { id: "kktp", label: "Penyusunan KKTP", icon: "CheckSquare", desc: "Kriteria ketercapaian tujuan" },
  { id: "prota", label: "Program Tahunan (Prota)", icon: "CalendarRange", desc: "Distribusi materi setahun" },
  { id: "prosem", label: "Program Semester (Prosem)", icon: "ListCollapse", desc: "Distribusi jam per minggu" },
  { id: "modul-ajar", label: "Modul Ajar Deep Learning", icon: "BookOpen", desc: "Rencana Pembelajaran 3 Pilar" },
  { id: "modul-koku", label: "Modul Kokurikuler (P5)", icon: "Compass", desc: "Modul Projek Penguatan Profil" },
  { id: "soal", label: "Generator Soal & Kisi", icon: "FileQuestion", desc: "Asesmen Sumatif & Formatif" },
  { id: "lkpd", label: "Lembar Kerja Siswa (LKPD)", icon: "FileEdit", desc: "Aktivitas Praktik & Latihan Siswa" },
  { id: "cover", label: "Cover Administrasi", icon: "LayoutTemplate", desc: "Sampul Dokumen Formal" },
  { id: "pengaturan-api", label: "Pengaturan Kunci API", icon: "Key", desc: "Konfigurasi Kunci API & Model Gemini" },
];

export const DIMENSI_PROFIL_LULUSAN = [
  "Keimanan/ketakwaan",
  "Kewargaan",
  "Penalaran kritis",
  "Kreativitas",
  "Kemandirian",
  "Kolaborasi",
  "Kesehatan",
  "Komunikasi",
];

export const MITRA_BELAJAR = [
  "Orang Tua / Wali Murid",
  "Komunitas Praktisi / Tokoh Masyarakat",
  "Dunia Usaha & Dunia Industri (DUDI)",
  "Pakar Profil / Akademisi Ahli",
  "Sesama Rekan Guru (Peer Teaching)",
  "Instansi Pemerintah / Swasta Terkait",
];

export const TEMA_P5 = [
  "Gaya Hidup Berkelanjutan",
  "Kearifan Lokal",
  "Bhinneka Tunggal Ika",
  "Bangunlah Jiwa dan Raganya",
  "Suara Demokrasi",
  "Rekayasa dan Teknologi",
  "Kewirausahaan",
  "Kebekerjaan",
];

export const MODEL_PEMBELAJARAN = [
  "Tatap Muka",
  "Problem Based Learning (PBL)",
  "Project Based Learning (PjBL)",
  "Discovery Learning",
  "Inquiry Learning",
  "Blended Learning",
];

export const METODE_PEMBELAJARAN = [
  "Diskusi Kelompok",
  "Ceramah Interaktif",
  "Tanya Jawab",
  "Eksperimen / Praktikum",
  "Presentasi",
  "Penugasan Mandiri",
];

export const LINGKUNGAN_BELAJAR = [
  "Kelas Indoor",
  "Luar Kelas / Outdoor",
  "Laboratorium",
  "Perpustakaan",
];

export const JENIS_UJIAN = [
  "Asesmen Formatif Harian",
  "Sumatif Lingkup Materi",
  "Sumatif Tengah Semester (STS)",
  "Sumatif Akhir Semester (SAS)",
  "Sumatif Akhir Tahun (SAT)",
];

export const FOKUS_KOGNITIF = [
  "C1-C2 (Pemahaman Dasar)",
  "C3-C4 (Penerapan & Analisis)",
  "C5-C6 (HOTS & Evaluasi Tinggi)",
];
