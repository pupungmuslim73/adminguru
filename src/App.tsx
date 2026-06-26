import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Target,
  BookOpen,
  Compass,
  FileQuestion,
  FileEdit,
  LayoutTemplate,
  CalendarRange,
  ListCollapse,
  CheckSquare,
  History,
  Sparkles,
  School,
  User,
  Phone,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Copy,
  Download,
  X,
  Plus,
  Trash,
  ChevronRight,
  Menu,
  Check,
  Maximize2,
  Minimize2,
  RotateCcw,
  AlertCircle,
  FileText,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eraser,
  Wand2,
  Printer,
  Image as ImageIcon
} from "lucide-react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, onSnapshot } from "firebase/firestore";
import {
  TeacherSettings,
  CommonData,
  SpecificData,
  GeneratedDocument,
  MENU_ITEMS,
  DIMENSI_PROFIL_LULUSAN,
  MITRA_BELAJAR,
  TEMA_P5,
  MODEL_PEMBELAJARAN,
  METODE_PEMBELAJARAN,
  LINGKUNGAN_BELAJAR,
  JENIS_UJIAN,
  FOKUS_KOGNITIF
} from "./types";

// Helper for localStorage
const storage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  set: (key: string, val: string) => {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  },
};

const MENU_THEMES: Record<string, {
  colorName: string;
  activeBtn: string;
  activeHover: string;
  iconBg: string;
  iconText: string;
  iconBorder: string;
  iconBgActive: string;
  iconTextActive: string;
  accentText: string;
}> = {
  beranda: {
    colorName: "blue",
    activeBtn: "bg-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20",
    activeHover: "hover:from-blue-700 hover:to-indigo-700",
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-400 group-hover:text-blue-200",
    iconBorder: "border-blue-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-blue-600"
  },
  "cp-tp-atp": {
    colorName: "emerald",
    activeBtn: "bg-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20",
    activeHover: "hover:from-emerald-700 hover:to-teal-700",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400 group-hover:text-emerald-200",
    iconBorder: "border-emerald-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-emerald-600"
  },
  kktp: {
    colorName: "amber",
    activeBtn: "bg-semibold bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-500/20",
    activeHover: "hover:from-amber-700 hover:to-yellow-700",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400 group-hover:text-amber-200",
    iconBorder: "border-amber-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-amber-600"
  },
  prota: {
    colorName: "purple",
    activeBtn: "bg-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20",
    activeHover: "hover:from-purple-700 hover:to-fuchsia-700",
    iconBg: "bg-purple-500/10",
    iconText: "text-purple-400 group-hover:text-purple-200",
    iconBorder: "border-purple-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-purple-600"
  },
  prosem: {
    colorName: "indigo",
    activeBtn: "bg-semibold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20",
    activeHover: "hover:from-indigo-700 hover:to-blue-700",
    iconBg: "bg-indigo-500/10",
    iconText: "text-indigo-400 group-hover:text-indigo-200",
    iconBorder: "border-indigo-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-indigo-600"
  },
  "modul-ajar": {
    colorName: "rose",
    activeBtn: "bg-semibold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/20",
    activeHover: "hover:from-rose-700 hover:to-pink-700",
    iconBg: "bg-rose-500/10",
    iconText: "text-rose-400 group-hover:text-rose-200",
    iconBorder: "border-rose-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-rose-600"
  },
  "modul-koku": {
    colorName: "cyan",
    activeBtn: "bg-semibold bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/20",
    activeHover: "hover:from-cyan-700 hover:to-teal-700",
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-400 group-hover:text-cyan-200",
    iconBorder: "border-cyan-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-cyan-600"
  },
  soal: {
    colorName: "sky",
    activeBtn: "bg-semibold bg-gradient-to-r from-sky-600 to-blue-500 text-white shadow-lg shadow-sky-500/20",
    activeHover: "hover:from-sky-700 hover:to-blue-600",
    iconBg: "bg-sky-500/10",
    iconText: "text-sky-400 group-hover:text-sky-200",
    iconBorder: "border-sky-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-sky-600"
  },
  lkpd: {
    colorName: "amber",
    activeBtn: "bg-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20",
    activeHover: "hover:from-amber-600 hover:to-orange-600",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400 group-hover:text-amber-200",
    iconBorder: "border-amber-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-amber-600"
  },
  cover: {
    colorName: "rose",
    activeBtn: "bg-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20",
    activeHover: "hover:from-rose-600 hover:to-pink-600",
    iconBg: "bg-rose-500/10",
    iconText: "text-rose-400 group-hover:text-rose-200",
    iconBorder: "border-rose-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-rose-600"
  },
  "pengaturan-api": {
    colorName: "indigo",
    activeBtn: "bg-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20",
    activeHover: "hover:from-indigo-700 hover:to-violet-700",
    iconBg: "bg-indigo-500/10",
    iconText: "text-indigo-400 group-hover:text-indigo-200",
    iconBorder: "border-indigo-500/20",
    iconBgActive: "bg-white/20",
    iconTextActive: "text-white",
    accentText: "text-indigo-700"
  }
};

export default function App() {
  // Mobile menu sidebar toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App active view
  const [activeMenu, setActiveMenu] = useState("beranda");

  // Core configuration states
  const [settings, setSettings] = useState<TeacherSettings>({
    namaSekolah: "",
    kota: "",
    namaGuru: "",
    nip: "",
    namaKepsek: "",
    nipKepsek: ""
  });

  const [commonData, setCommonData] = useState<CommonData>({
    jenjang: "SD/MI",
    kelas: "I",
    fase: "A",
    semester: "Ganjil",
    tahunAjaran: "2025/2026",
  });

  const [specificData, setSpecificData] = useState<SpecificData>({
    mapel: "",
    materiPokok: "",
    cp: "",
    tp: "",
    alokasiWaktu: "",
    dimensiPPP: [DIMENSI_PROFIL_LULUSAN[2], DIMENSI_PROFIL_LULUSAN[5]], // Default: Penalaran kritis, Kolaborasi
    mitra: [MITRA_BELAJAR[4]], // Default: Sesama rekan guru
    isTarl: false,
    tarlMahir: "",
    tarlCakap: "",
    tarlBimbingan: "",
    model: MODEL_PEMBELAJARAN[1], // Problem Based Learning
    metode: "",
    lingkungan: LINGKUNGAN_BELAJAR[0], // Kelas Indoor
    media: "",
    temaP5: TEMA_P5[0],
    topikP5: "",
    jenisUjian: JENIS_UJIAN[1],
    fokusKognitif: FOKUS_KOGNITIF[1],
    pg: 10,
    isian: 5,
    essay: 3,
    jodoh: 0,
    instruksiSoal: "",
    babList: [""],
    elemenCp: "",
    sumberCp: "",
    jumlahTp: "",
    jumlahPertemuan: "",
    tingkatDetail: "Lengkap dan Terperinci",
    karakteristikPesertaDidik: "",
    bentukKegiatan: "",
    produkAkhir: "",
    jpPerMinggu: "",
    jumlahMingguEfektif: "",
    jadwalAsesmen: "",
    jumlahMingguEfektifSemester: "",
    bulanEfektif: "",
    modelKktp: "",
    rentangNilai: "",
    teknikPenilaian: "",
    bentukSoalList: ["Pilihan Ganda", "Esai"],
    jumlahPilihanJawaban: "",
    gunakanStimulus: true,
    outputYangDibuat: [],
    prota: "",
  });

  // Client footprint mapping
  const [generationCount, setGenerationCount] = useState(0);

  // Editor states
  const [editorHtml, setEditorHtml] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState("");
  const [isSuggestingElemen, setIsSuggestingElemen] = useState(false);
  const [isSuggestingMateri, setIsSuggestingMateri] = useState(false);
  const [apiError, setApiError] = useState("");

  // History State
  const [savedDocs, setSavedDocs] = useState<GeneratedDocument[]>([]);

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Toasts
  const [toast, setToast] = useState<{ text: string; isError: boolean } | null>(null);

  // Gemini API Key testing states
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testKeyStatus, setTestKeyStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Editor reference
  const editorRef = useRef<HTMLDivElement>(null);

  // List of rotating quotes during generation
  const generationQuotes = [
    "Menyusun struktur berdasarkan Permendikdasmen No. 13 Tahun 2025...",
    "Mengintegrasikan Tiga Pilar Pembelajaran Mendalam (Deep Learning)...",
    "Melaraskan Indikator dengan Keputusan Kepala BSKAP No. 046/H/KR/2025...",
    "Merancang Apersepsi Mindful dan petualangan eksploratif Joyful...",
    "Menyusun Kriteria Ketuntasan dan Rancangan Diferensiasi Tingkat Kemampuan (TaRL)...",
    "Membuat Instrumen Rubrik Penilaian dan LKPD Mandiri...",
    "Merancang cover eksklusif kop sekolah formal siap cetak..."
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Fetch device footprint and initial data from localStorage
  useEffect(() => {
    // Load setup configurations
    const savedSet = storage.get("guru_settings");
    if (savedSet) {
      try {
        setSettings(JSON.parse(savedSet));
      } catch (e) {}
    } else {
      // Default setup placeholders to help teacher feel at home instantly
      setSettings({
        namaSekolah: "SD Negeri Merdeka 01",
        kota: "Semarang",
        namaGuru: "Kartini Pratama, S.Pd.",
        nip: "199405022022032008",
        namaKepsek: "Drs. Ki Hajar Dewantoro, M.A.",
        nipKepsek: "197211101999031005"
      });
    }

    // Load usage & count
    const savedUsage = storage.get("guru_usage");
    if (savedUsage) {
      try {
        const u = JSON.parse(savedUsage);
        setGenerationCount(u.generationCount || 0);
      } catch (e) {}
    }

    // Load history
    const savedHist = storage.get("guru_history");
    if (savedHist) {
      try {
        setSavedDocs(JSON.parse(savedHist));
      } catch (e) {}
    }
  }, []);

  // Interval rotation for quotes during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % generationQuotes.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Adjust alokasi waktu default or other items when jenjang changes
  const handleJenjangChange = (jenjang: string) => {
    let defaultClass = "I";
    let defaultFase = "A";
    let alokasi = "2 JP (2 x 35 Menit)";

    if (jenjang === "SD/MI") {
      defaultClass = "I";
      defaultFase = "A";
      alokasi = "2 JP (2 x 35 Menit)";
    } else if (jenjang === "SMP/MTs") {
      defaultClass = "VII";
      defaultFase = "D";
      alokasi = "2 JP (2 x 40 Menit)";
    } else if (jenjang === "SMA/SMK/MA") {
      defaultClass = "X";
      defaultFase = "E";
      alokasi = "2 JP (2 x 45 Menit)";
    }

    setCommonData((prev) => ({
      ...prev,
      jenjang,
      kelas: defaultClass,
      fase: defaultFase,
    }));

    setSpecificData((prev) => ({
      ...prev,
      alokasiWaktu: alokasi,
    }));

    showToast(`Jenjang diset ke ${jenjang}, data disesuaikan.`, false);
  };

  // Adjust default fase based on chosen class
  const handleKelasChange = (kelas: string) => {
    let defaultFase = commonData.fase;
    if (commonData.jenjang === "SD/MI") {
      if (["I", "II"].includes(kelas)) defaultFase = "A";
      else if (["III", "IV"].includes(kelas)) defaultFase = "B";
      else if (["V", "VI"].includes(kelas)) defaultFase = "C";
    } else if (commonData.jenjang === "SMP/MTs") {
      defaultFase = "D";
    } else if (commonData.jenjang === "SMA/SMK/MA") {
      if (kelas === "X") defaultFase = "E";
      else if (["XI", "XII"].includes(kelas)) defaultFase = "F";
    }

    setCommonData((prev) => ({
      ...prev,
      kelas,
      fase: defaultFase,
    }));
  };

  // Quick settings save
  const handleSettingsChange = (field: keyof TeacherSettings, val: string) => {
    const updated = { ...settings, [field]: val };
    setSettings(updated);
    storage.set("guru_settings", JSON.stringify(updated));
  };

  // Toast notifier
  const showToast = (text: string, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Add/Delete Bab lists
  const handleAddBab = () => {
    const nextIndex = specificData.babList.length + 1;
    setSpecificData((prev) => ({
      ...prev,
      babList: [...prev.babList, `Bab ${integerToRoman(nextIndex)}: Materi Baru`],
    }));
  };

  const handleRemoveBab = (index: number) => {
    if (specificData.babList.length <= 1) {
      showToast("Minimal wajib menyertakan satu bab materi.", true);
      return;
    }
    const filtered = specificData.babList.filter((_, i) => i !== index);
    setSpecificData((prev) => ({
      ...prev,
      babList: filtered,
    }));
  };

  const handleBabTextChange = (index: number, val: string) => {
    const updated = [...specificData.babList];
    updated[index] = val;
    setSpecificData((prev) => ({
      ...prev,
      babList: updated,
    }));
  };

  const integerToRoman = (num: number) => {
    const lookup: Record<string, number> = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let roman = "";
    for (const i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  // Document Reset triggers
  const handleResetForm = () => {
    setSpecificData((prev) => ({
      ...prev,
      mapel: "",
      materiPokok: "",
      cp: "",
      tp: "",
      mitra: [MITRA_BELAJAR[4]],
      isTarl: false,
      instruksiSoal: "",
      babList: [""],
      alokasiWaktu: "",
      tarlMahir: "",
      tarlCakap: "",
      tarlBimbingan: "",
      metode: "",
      media: "",
      topikP5: "",
      elemenCp: "",
      sumberCp: "",
      jumlahTp: "",
      jumlahPertemuan: "",
      karakteristikPesertaDidik: "",
      bentukKegiatan: "",
      produkAkhir: "",
      jpPerMinggu: "",
      jumlahMingguEfektif: "",
      jadwalAsesmen: "",
      jumlahMingguEfektifSemester: "",
      bulanEfektif: "",
      modelKktp: "",
      rentangNilai: "",
      teknikPenilaian: "",
      jumlahPilihanJawaban: "",
      outputYangDibuat: [],
    }));
    showToast("Isian spesifikasi dokumen berhasil dibersihkan.", false);
  };

  const safeParseJson = async (response: Response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(`Koneksi/Respon Server Bermasalah (${response.status}): ${text.slice(0, 150) || "Respon kosong"}...`);
    }
  };

  const handleSuggestElemenCp = async () => {
    if (!specificData.mapel) {
      showToast("Harap isi Nama Mata Pelajaran terlebih dahulu.", true);
      return;
    }
    setIsSuggestingElemen(true);
    setApiError("");
    try {
      const response = await fetch("/api/suggest-elemen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mapel: specificData.mapel,
          fase: commonData.fase,
          jenjang: commonData.jenjang,
          modelName: settings.aiModel,
          geminiApiKey: settings.geminiApiKey
        })
      });
      const data = await safeParseJson(response);
      if (!response.ok) throw new Error(data.error || "Gagal menghasilkan sugesti elemen CP");
      
      setSpecificData(prev => ({ ...prev, elemenCp: data.elemenCp }));
      showToast("Elemen CP berhasil diformulasikan.", false);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsSuggestingElemen(false);
    }
  };

  const handleSuggestMateriPokok = async () => {
    if (!specificData.mapel) {
      showToast("Harap isi Nama Mata Pelajaran terlebih dahulu.", true);
      return;
    }
    setIsSuggestingMateri(true);
    setApiError("");
    try {
      const response = await fetch("/api/suggest-materi-pokok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mapel: specificData.mapel,
          fase: commonData.fase,
          jenjang: commonData.jenjang,
          modelName: settings.aiModel,
          geminiApiKey: settings.geminiApiKey
        })
      });
      const data = await safeParseJson(response);
      if (!response.ok) throw new Error(data.error || "Gagal menghasilkan sugesti materi pokok");
      
      setSpecificData(prev => ({ ...prev, materiPokok: data.materiPokok }));
      showToast("Materi Pokok berhasil dirumuskan.", false);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsSuggestingMateri(false);
    }
  };

  const handleTestApiKey = async () => {
    setIsTestingKey(true);
    setTestKeyStatus(null);
    try {
      const response = await fetch("/api/test-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geminiApiKey: settings.geminiApiKey,
          modelName: settings.aiModel || "gemini-2.5-flash"
        })
      });
      const data = await safeParseJson(response);
      if (!response.ok) {
        throw new Error(data.error || "Gagal memverifikasi Koneksi Server.");
      }
      setTestKeyStatus({ success: true, message: data.message || "Sukses, Koneksi Berfungsi!" });
      showToast("Koneksi Server berhasil diverifikasi!", false);
    } catch (err: any) {
      setTestKeyStatus({ success: false, message: err.message || "Koneksi tidak valid atau gagal terhubung." });
      showToast("Pengujian Koneksi Server gagal.", true);
    } finally {
      setIsTestingKey(false);
    }
  };

  // Perform Generation with Gemini API
  const handleGenerate = async () => {
    // Validations
    if (!settings.namaSekolah) {
      showToast("Harap isi nama sekolah/madrasah di Form Identitas terlebih dahulu.", true);
      return;
    }
    if (activeMenu !== "modul-koku" && !specificData.mapel) {
      showToast("Mata pelajaran tidak boleh kosong.", true);
      return;
    }
    
    if (activeMenu === "modul-koku" && (!specificData.topikP5 || specificData.topikP5.trim() === "")) {
      showToast("Topik Kegiatan wajib diisi untuk modul kokurikuler.", true);
      return;
    }
    
    if (["modul-ajar", "soal"].includes(activeMenu) && (!specificData.materiPokok || specificData.materiPokok.trim() === "")) {
      showToast("Materi pokok atau bahasan inti wajib diisi untuk modul ini.", true);
      return;
    }

    if (activeMenu === "prota" && (!specificData.jumlahMingguEfektif || specificData.jumlahMingguEfektif.trim() === "")) {
      showToast("Jumlah Minggu Efektif wajib diisi untuk menyusun Program Tahunan.", true);
      return;
    }

    setApiError("");
    setIsGenerating(activeMenu);
    setCurrentQuoteIndex(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docType: activeMenu,
          commonData,
          specificData,
          settings,
        }),
      });

      const resData = await safeParseJson(response);
      if (!response.ok) {
        throw new Error(resData.error || "Gagal berkomunikasi dengan server administrasi.");
      }

      setEditorHtml(resData.html);

      // Construct nice title
      const typeLabel = MENU_ITEMS.find((m) => m.id === activeMenu)?.label || "Administrasi";
      setDocumentTitle(`${typeLabel} - ${specificData.mapel} Kelas ${commonData.kelas}`);

      // Increment Usage Count
      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      storage.set("guru_usage", JSON.stringify({ generationCount: newCount }));

      showToast("Prompt berhasil dibuat!", false);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Gagal menghubungkan atau batas waktu pengerjaan habis.");
      showToast("Gagal membuat prompt.", true);
    } finally {
      setIsGenerating("");
    }
  };

  // Sync edited changes from state to div (for copying/saving)
  const handleEditorInput = () => {
    if (editorRef.current) {
      setEditorHtml(editorRef.current.innerHTML);
    }
  };

  // Interactive local text controls
  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  // Exporters
  const copyToClipboard = () => {
    const currentHtml = editorRef.current?.innerHTML || editorHtml;
    if (!currentHtml) return;
    try {
      // Create rich-text copyable blob or plain copy backup
      const blob = new Blob([currentHtml], { type: "text/html" });
      const plainText = editorRef.current?.innerText || currentHtml.replace(/<[^>]*>/g, "");
      const clipboardItem = new ClipboardItem({
        "text/html": blob,
        "text/plain": new Blob([plainText], { type: "text/plain" }),
      });
      navigator.clipboard.write([clipboardItem]).then(() => {
        showToast("Format dokumen tersalin lengkap dengan tabel & warna!", false);
      });
    } catch (err) {
      // Fallback
      navigator.clipboard.writeText(currentHtml).then(() => {
        showToast("HTML murni tersalin ke memori clipboard.", false);
      });
    }
  };

  const exportToWord = () => {
    let currentHtml = editorRef.current?.innerHTML || editorHtml;
    if (!currentHtml) return;

    // Inject inline styles for Arabic text and Tables to force Word to read them correctly
    currentHtml = currentHtml.replace(/<div class="arabic-text" dir="rtl">/g, 
      `<div class="arabic-text" dir="rtl" style="font-family: 'mushaf madinah', 'KFGQPC Uthmanic Script HAFS', 'Traditional Arabic', 'Arial'; font-size: 24pt; text-align: right; direction: rtl; line-height: 2.2; margin: 16px 0;">`
    );

    // Convert with standard word container envelope
    const wordLandscapeStyles = `
      @page SectionPortrait { size: 595.3pt 841.9pt; margin: 72.0pt 72.0pt 72.0pt 72.0pt; }
      body { font-family: 'Arial', sans-serif; line-height: 1.6; } 
      table { border-collapse: collapse !important; border: 1px solid #cbd5e1; width: 100%; margin: 15px 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; } 
      th { background-color: #1e3a8a; color: #ffffff; border: 1px solid #cbd5e1; padding: 10px; text-align: left; } 
      td { border: 1px solid #cbd5e1; padding: 10px; } 
      p, li { text-align: justify; }
      .arabic-text { font-family: 'mushaf madinah', 'KFGQPC Uthmanic Script HAFS', 'Traditional Arabic', 'Arial', serif; font-size: 24pt; text-align: right; direction: rtl; line-height: 2.2; margin: 16px 0; }
    `;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>${documentTitle}</title>
<style>${wordLandscapeStyles}</style>
</head>
<body>`;
    const footer = "</body></html>";
    const sourceHtml = header + currentHtml + footer;

    const blob = new Blob(['\ufeff', sourceHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const cleanFileName = documentTitle.replace(/[^a-zA-Z0-9_\-\ ]/g, "");
    link.download = `${cleanFileName || "Administrasi_Guru"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Unduhan dokumen Microsoft Word telah diinisiasi.", false);
  };

  const exportToPdf = () => {
    const currentHtml = editorRef.current?.innerHTML || editorHtml;
    if (!currentHtml) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast("Gagal membuka jendela cetak. Pastikan popup tidak diblokir.", true);
      return;
    }

    const header = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>${documentTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Amiri+Quran&display=swap" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Amiri+Quran&display=swap');
          @font-face {
            font-family: 'mushaf madinah';
            src: local('KFGQPC Uthmanic Script HAFS'), 
                 local('Me Quran'),
                 url('https://cdn.jsdelivr.net/gh/quran/quran.com-images@master/fonts/quran/hafs/v1/UthmanicHafs1 Ver09.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
          }
          body {
            font-family: 'Inter', sans-serif;
            color: #000;
            background: #fff;
            line-height: 1.6;
            margin: 0;
            padding: 20mm;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #000;
            page-break-after: avoid;
          }
          .page-break-indicator {
            page-break-after: always;
            break-after: page;
            border: none;
            display: block;
          }
          .arabic-text {
            font-family: 'mushaf madinah', 'KFGQPC Uthmanic Script HAFS', 'Mushaf', 'Amiri Quran', serif;
            font-size: 2em;
            line-height: 2.2;
            text-align: right;
            direction: rtl;
            margin: 16px 0;
            padding: 0 12px;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @media print {
            body { padding: 15mm 20mm; }
            @page { 
              size: portrait;
              margin: 0; 
            }
            @page landscape-page {
              size: landscape;
              margin: 0;
            }
            .landscape-section {
              page: landscape-page;
            }
          }
        </style>
      </head>
      <body>
        ${currentHtml}
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 500);
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(header);
    printWindow.document.close();
  };

  // Persistence triggers
  const handleSaveHistory = () => {
    if (!editorHtml) return;

    const newDoc: GeneratedDocument = {
      id: `doc_${Date.now()}`,
      docType: activeMenu,
      title: documentTitle || `Prompt Administrasi - ${specificData.mapel} Kelas ${commonData.kelas}`,
      html: editorHtml,
      timestamp: new Date().toLocaleDateString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      commonData,
      specificData,
      settings,
    };

    const updated = [newDoc, ...savedDocs];
    setSavedDocs(updated);
    storage.set("guru_history", JSON.stringify(updated));
    showToast("Berhasil disimpan ke Riwayat Sesi!", false);
  };

  const handleLoadDoc = (doc: GeneratedDocument) => {
    setEditorHtml(doc.html);
    setDocumentTitle(doc.title);
    setCommonData(doc.commonData);
    setSpecificData(doc.specificData);
    setSettings(doc.settings);
    setActiveMenu(doc.docType);
    showToast(`Memuat sesi: ${doc.title}`, false);
  };

  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedDocs.filter((d) => d.id !== id);
    setSavedDocs(filtered);
    storage.set("guru_history", JSON.stringify(filtered));
    showToast("Dokumen riwayat terhapus.", false);
  };







  const toggleMitra = (mitra: string) => {
    const current = specificData.mitra;
    if (current.includes(mitra)) {
      setSpecificData((p) => ({ ...p, mitra: current.filter((m) => m !== mitra) }));
    } else {
      setSpecificData((p) => ({ ...p, mitra: [...current, mitra] }));
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col md:flex-row text-slate-800 antialiased selection:bg-blue-100 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[60] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border ${
              toast.isError
                ? "bg-red-600 border-red-500"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            {toast.isError ? (
              <AlertTriangle className="text-red-300 w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="text-emerald-400 w-5 h-5 shrink-0" />
            )}
            <span className="font-semibold text-sm">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Screen Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/85 backdrop-blur-md z-[80] flex flex-col items-center justify-center p-6 text-white text-center"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
              <Sparkles className="w-6 h-6 text-yellow-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <h3 className="text-xl font-bold mb-2">Merumuskan Prompt Cerdas</h3>
            <p className="text-sm text-blue-300 font-medium mb-8 max-w-sm">
              Asisten AI sedang menyusun prompt super detail berdasarkan parameter kurikulum nasional Anda.
            </p>

            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-850/60 border border-slate-700/50 rounded-2xl px-6 py-4 max-w-md shadow-lg"
            >
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1.5">Langkah saat ini</p>
              <p className="text-sm text-slate-200 font-semibold leading-relaxed">
                {generationQuotes[currentQuoteIndex]}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR (Desktop view) */}
      <aside className="hidden md:flex flex-col sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 overflow-y-auto custom-scrollbar shrink-0 justify-between border-r border-slate-800">
        <div>
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="font-bold text-xl text-white flex items-center gap-2 select-none">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-600/20">
                <FileText className="w-5 h-5" />
              </div>
              <span className="tracking-tight">AdminGuru.AI</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {MENU_ITEMS.map((item) => {
              const isActive = activeMenu === item.id;
              const theme = MENU_THEMES[item.id] || {
                activeBtn: "bg-blue-600 text-white shadow-md",
                iconBg: "bg-blue-500/10",
                iconText: "text-blue-400",
                iconBorder: "border-blue-500/20",
                iconBgActive: "bg-white/20",
                iconTextActive: "text-white"
              };
              
              const renderIcon = () => {
                switch (item.icon) {
                  case "Home":
                    return <Home className="w-4 h-4 shrink-0" />;
                  case "Target":
                    return <Target className="w-4 h-4 shrink-0" />;
                  case "BookOpen":
                    return <BookOpen className="w-4 h-4 shrink-0" />;
                  case "Compass":
                    return <Compass className="w-4 h-4 shrink-0" />;
                  case "FileQuestion":
                    return <FileQuestion className="w-4 h-4 shrink-0" />;
                  case "CalendarRange":
                    return <CalendarRange className="w-4 h-4 shrink-0" />;
                  case "ListCollapse":
                    return <ListCollapse className="w-4 h-4 shrink-0" />;
                  case "CheckSquare":
                    return <CheckSquare className="w-4 h-4 shrink-0" />;
                  case "History":
                    return <History className="w-4 h-4 shrink-0" />;
                  case "Key":
                    return <Key className="w-4 h-4 shrink-0" />;
                  case "FileEdit":
                    return <FileEdit className="w-4 h-4 shrink-0" />;
                  case "LayoutTemplate":
                    return <LayoutTemplate className="w-4 h-4 shrink-0" />;
                  default:
                    return <FileText className="w-4 h-4 shrink-0" />;
                }
              };

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group border border-transparent cursor-pointer ${
                    isActive
                      ? `${theme.activeBtn} font-bold`
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <span className={`p-1.5 rounded-lg shrink-0 flex items-center justify-center transition-all duration-200 border ${
                    isActive ? `${theme.iconBgActive} ${theme.iconTextActive} border-white/5` : `${theme.iconBg} ${theme.iconText} ${theme.iconBorder}`
                  }`}>
                    {renderIcon()}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer identification */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">
            Alat Pembelajaran Cepat
          </span>
        </div>
      </aside>

      {/* MOBILE HEADER (Phones) */}
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden z-20 shadow-sm shrink-0">
        <div className="font-bold text-lg text-slate-800 flex items-center gap-2 select-none">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <span>AdminGuru.AI</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-1.5"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </header>

      {/* Mobile Menu Dropdown overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-xl z-50 p-4 md:hidden flex flex-col gap-2"
          >
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2.5 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Pilih Modul Generator
            </p>
            <div className="grid grid-cols-1 gap-1.5 max-h-[380px] overflow-y-auto custom-scrollbar">
              {MENU_ITEMS.map((item) => {
                const isActive = activeMenu === item.id;
                const theme = MENU_THEMES[item.id] || {
                  activeBtn: "bg-blue-600 text-white",
                  iconBg: "bg-blue-100",
                  iconText: "text-blue-600",
                  iconBorder: "border-blue-200"
                };

                const renderIcon = () => {
                  switch (item.icon) {
                    case "Home": return <Home className="w-4 h-4 shrink-0" />;
                    case "Target": return <Target className="w-4 h-4 shrink-0" />;
                    case "BookOpen": return <BookOpen className="w-4 h-4 shrink-0" />;
                    case "Compass": return <Compass className="w-4 h-4 shrink-0" />;
                    case "FileQuestion": return <FileQuestion className="w-4 h-4 shrink-0" />;
                    case "CalendarRange": return <CalendarRange className="w-4 h-4 shrink-0" />;
                    case "ListCollapse": return <ListCollapse className="w-4 h-4 shrink-0" />;
                    case "CheckSquare": return <CheckSquare className="w-4 h-4 shrink-0" />;
                    case "History": return <History className="w-4 h-4 shrink-0" />;
                    case "Key": return <Key className="w-4 h-4 shrink-0" />;
                    case "FileEdit": return <FileEdit className="w-4 h-4 shrink-0" />;
                    case "LayoutTemplate": return <LayoutTemplate className="w-4 h-4 shrink-0" />;
                    default: return <FileText className="w-4 h-4 shrink-0" />;
                  }
                };

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? `${theme.activeBtn} border-transparent shadow-sm`
                        : "text-slate-700 hover:bg-slate-50 border-slate-100 bg-white"
                    }`}
                  >
                    <span className={`p-1.5 rounded-lg shrink-0 flex items-center justify-center border ${
                      isActive ? "bg-white/20 text-white border-white/5" : `${theme.iconBg} ${theme.iconText} ${theme.iconBorder}`
                    }`}>
                      {renderIcon()}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className={`flex-1 overflow-y-auto ${activeMenu !== "beranda" && activeMenu !== "pengaturan-api" ? "lg:overflow-hidden" : ""} p-4 md:p-8 custom-scrollbar flex flex-col`}>
          
          {/* Header Title Bar */}
          <div className="hidden md:flex shrink-0 items-center gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-xs">
            {(() => {
              const activeItem = MENU_ITEMS.find((m) => m.id === activeMenu);
              const theme = MENU_THEMES[activeMenu] || {
                iconBg: "bg-blue-500/10",
                iconText: "text-blue-600",
                iconBorder: "border-blue-500/20"
              };
              const renderActiveIcon = () => {
                if (!activeItem) return <School className="w-5 h-5" />;
                switch (activeItem.icon) {
                  case "Home": return <Home className="w-5 h-5" />;
                  case "Target": return <Target className="w-5 h-5" />;
                  case "BookOpen": return <BookOpen className="w-5 h-5" />;
                  case "Compass": return <Compass className="w-5 h-5" />;
                  case "FileQuestion": return <FileQuestion className="w-5 h-5" />;
                  case "CalendarRange": return <CalendarRange className="w-5 h-5" />;
                  case "ListCollapse": return <ListCollapse className="w-5 h-5" />;
                  case "CheckSquare": return <CheckSquare className="w-5 h-5" />;
                  case "History": return <History className="w-5 h-5" />;
                  case "Key": return <Key className="w-5 h-5" />;
                  case "FileEdit": return <FileEdit className="w-5 h-5" />;
                  case "LayoutTemplate": return <LayoutTemplate className="w-5 h-5" />;
                  default: return <FileText className="w-5 h-5" />;
                }
              };
              return (
                <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center border shadow-xs ${theme.iconBg} ${theme.iconText} ${theme.iconBorder}`}>
                  {renderActiveIcon()}
                </div>
              );
            })()}
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight leading-none mb-1 flex items-center gap-1.5">
                {MENU_ITEMS.find((m) => m.id === activeMenu)?.label || "Administrasi"}
                <span className="inline-block px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 text-[9px] font-mono font-bold tracking-wider uppercase">Aktif</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {MENU_ITEMS.find((m) => m.id === activeMenu)?.desc || ""}
              </p>
            </div>
          </div>

          {/* VIEW CONTROLS */}
          {activeMenu === "beranda" ? (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Cover card */}
              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="max-w-xl text-center lg:text-left">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 text-blue-100 text-xs font-bold tracking-wider mb-3 border border-blue-400/30">
                      GENERATOR PERANGKAT AJAR DEEP LEARNING (M³)
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight tracking-tight">
                      Platform Otomatis Administrasi Guru
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm leading-relaxed font-medium">
                      Susun Modul Ajar Deep Learning, Silabus Setahun, Asesmen & dokumen pembelajaran siap cetak sesuai aturan terbaru Permendikdasmen No. 13 Tahun 2025 & Keputusan Kepala BSKAP No. 046/H/KR/2025.
                    </p>
                  </div>
                  
                  <div className="bg-slate-900/40 p-4 rounded-2xl backdrop-blur-md border border-white/10 w-full lg:w-64 shrink-0 text-xs shadow-inner space-y-2.5 font-medium text-left">
                    <div className="text-[10px] text-blue-300 font-bold tracking-wider uppercase">Sistem Sinkronisasi</div>
                    <div className="space-y-1.5 flex flex-col">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Modul Lokal Tersinkronisasi
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Penulisan Format Rata (Justify)
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Pembelajaran TaRL Aktif
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generator Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide px-1">Pilih Generator Prompt</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MENU_ITEMS.filter((item) => !["beranda", "pengaturan-api"].includes(item.id)).map((item) => {
                    const theme = MENU_THEMES[item.id] || {
                      colorName: "blue",
                      activeBtn: "bg-blue-600 text-white shadow-md",
                      iconBg: "bg-blue-500/10",
                      iconText: "text-blue-400",
                      iconBorder: "border-blue-500/20",
                      accentText: "text-blue-600"
                    };

                    const renderGridIcon = () => {
                      switch (item.icon) {
                        case "Home": return <Home className="w-5 h-5" />;
                        case "Target": return <Target className="w-5 h-5" />;
                        case "BookOpen": return <BookOpen className="w-5 h-5" />;
                        case "Compass": return <Compass className="w-5 h-5" />;
                        case "FileQuestion": return <FileQuestion className="w-5 h-5" />;
                        case "CalendarRange": return <CalendarRange className="w-5 h-5" />;
                        case "ListCollapse": return <ListCollapse className="w-5 h-5" />;
                        case "CheckSquare": return <CheckSquare className="w-5 h-5" />;
                        case "History": return <History className="w-5 h-5" />;
                        case "Key": return <Key className="w-5 h-5" />;
                        case "FileEdit": return <FileEdit className="w-5 h-5" />;
                        case "LayoutTemplate": return <LayoutTemplate className="w-5 h-5" />;
                        default: return <FileText className="w-5 h-5" />;
                      }
                    };

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveMenu(item.id)}
                        className="group bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg border border-slate-100 text-left transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col items-start h-full cursor-pointer"
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 shadow-xs border transition-all duration-300 group-hover:scale-105 ${theme.iconBg} ${theme.iconText} ${theme.iconBorder}`}>
                          {renderGridIcon()}
                        </div>
                        <h3 className="text-xs md:text-sm font-bold text-slate-800 mb-1 leading-snug group-hover:text-slate-900 transition-colors">
                          {item.label}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                        <div className={`mt-auto pt-3 flex items-center gap-1 text-[10px] ${theme.accentText} font-bold opacity-75 group-hover:opacity-100 transition-opacity`}>
                          <span>Buka Generator</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tutorial / Guidelines on Deep Learning */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <BookOpen className="text-blue-600 w-5 h-5 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Konsep Inti Pembelajaran Mendalam (Deep Learning)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-xs text-blue-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span> Mindful (Berkesadaran)
                    </h4>
                    <p className="text-[11px] text-slate-600 justify-center">
                      Merancang kesadaran penuh emosional di awal belajar (hening sejenak, pernapasan, relaksasi), mengenali keunikan individual, dan membangkitkan fokus sebelum eksplorasi sains terapan.
                    </p>
                  </div>
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-xs text-indigo-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Meaningful (Bermakna)
                    </h4>
                    <p className="text-[11px] text-slate-600 justify-center">
                      Mengaitkan konsep belajar langsung ke tantangan problematik harian, kelestarian lingkungan sosial, atau implikasinya secara nyata dalam teknologi terapan.
                    </p>
                  </div>
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-xs text-emerald-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Joyful (Menggembirakan)
                    </h4>
                    <p className="text-[11px] text-slate-600 justify-center">
                      Membangkitkan kepuasan instingtif meneliti, menanggapi tantangan game interaktif, menyusun eksperimen berbasis proyek, & mengapresiasi keunikan solusi individual.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : activeMenu === "pengaturan-api" ? (
            <div className="max-w-xl mx-auto space-y-6 font-medium text-xs">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                
                {/* Header info */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Key className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 leading-tight">Pengaturan Kunci API & Model Gemini</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Hubungkan ke mesin kecerdasan buatan Gemini API secara mandiri</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Sistem menggunakan AI terintegrasi untuk pembuatan administrasi ajar. Anda dapat memasukkan <strong>Kunci API Gemini (Gemini API Key)</strong> Anda sendiri di bawah ini, atau menggunakan koneksi bawaan server.
                  </p>

                  <div className="space-y-3.5">
                    {/* Model Selector */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">
                        Pilih Versi Mesin Gemini (AI Model)
                      </label>
                      <select
                        id="aiModel"
                        name="aiModel"
                        value={settings.aiModel || "gemini-2.5-flash"}
                        onChange={(e) => handleSettingsChange("aiModel", e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 outline-none focus:border-blue-500 focus:bg-white text-[12px] font-semibold text-slate-700 transition"
                      >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Sangat Direkomendasikan & Cepat)</option>
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash (Kualitas Konsisten)</option>
                      </select>
                    </div>

                    {/* API Key Input */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider flex justify-between items-center">
                        <span>Gemini API Key (Kunci API Anda)</span>
                        <a 
                          href="https://aistudio.google.com/app/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-indigo-600 hover:underline normal-case font-bold"
                        >
                          Dapatkan API Key Gratis Di Sini &rarr;
                        </a>
                      </label>
                      <div className="relative">
                        <input
                          id="geminiApiKey"
                          name="geminiApiKey"
                          type="text"
                          value={settings.geminiApiKey || ""}
                          onChange={(e) => handleSettingsChange("geminiApiKey", e.target.value)}
                          placeholder="Masukkan Kunci API Gemini Anda (AIzaSy...)"
                          className="w-full p-3 pr-10 border border-slate-300 rounded-xl bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white text-[11px] transition font-mono tracking-wide text-slate-800"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                          <Key className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        * Kunci API ini tersimpan aman di peramban (browser) perangkat lokal Anda.
                      </p>
                    </div>

                    {/* Test Connection */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <button
                      type="button"
                      onClick={handleTestApiKey}
                      disabled={isTestingKey}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shrink-0"
                    >
                      {isTestingKey ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-indigo-700/20 border-t-indigo-700 rounded-full animate-spin"></div>
                          <span>Menguji Koneksi Server...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Uji Koneksi AI Server</span>
                        </>
                      )}
                    </button>

                    {testKeyStatus && (
                      <div className={`flex items-center gap-2 p-2.5 px-3 rounded-xl text-xs font-bold ${testKeyStatus.success ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-red-50 text-red-800 border border-red-100"} flex-1`}>
                        {testKeyStatus.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span className="leading-snug">{testKeyStatus.message}</span>
                      </div>
                    )}
                  </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            // GENERATOR FORMS LAYOUT WITH TWO PANELS (FORM ON LEFT, LIVE EDITOR ON RIGHT)
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-auto lg:flex-1 lg:min-h-0">
              
              {/* LEFT COLUMN: PARAMETER FORM PORT */}
              <div className="lg:col-span-5 flex flex-col lg:min-h-0 text-xs font-medium bg-transparent">
                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-3">
                
                {/* Section 1: Identitas Sekolah & Akademik */}
                <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] border border-slate-200 shrink-0 space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 text-blue-600 border-b border-slate-100 pb-2">
                    <School className="w-4 h-4" /> 1. Identitas & Akademis
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nama Sekolah / Madrasah</label>
                      <input
                        id="namaSekolah"
                        name="namaSekolah"
                        type="text"
                        value={settings.namaSekolah}
                        onChange={(e) => handleSettingsChange("namaSekolah", e.target.value)}
                        placeholder="Contoh: SMA Negeri 3 Surabaya"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>
                    {!["cp-tp-atp", "kktp", "prota", "prosem"].includes(activeMenu) && (
                      <>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Penyusun / Guru</label>
                          <input
                            id="namaGuru"
                            name="namaGuru"
                            type="text"
                            value={settings.namaGuru}
                            onChange={(e) => handleSettingsChange("namaGuru", e.target.value)}
                            placeholder="Nama Lengkap & Gelar"
                            className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">NIP Guru (Opsional)</label>
                          <input
                            id="nip"
                            name="nip"
                            type="text"
                            value={settings.nip}
                            onChange={(e) => handleSettingsChange("nip", e.target.value)}
                            placeholder="NIP Penyusun"
                            className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Kepala Sekolah</label>
                          <input
                            id="namaKepsek"
                            name="namaKepsek"
                            type="text"
                            value={settings.namaKepsek}
                            onChange={(e) => handleSettingsChange("namaKepsek", e.target.value)}
                            placeholder="Nama Kepala Sekolah"
                            className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">NIP Kepsek (Opsional)</label>
                          <input
                            id="nipKepsek"
                            name="nipKepsek"
                            type="text"
                            value={settings.nipKepsek}
                            onChange={(e) => handleSettingsChange("nipKepsek", e.target.value)}
                            placeholder="NIP Kepala Sekolah"
                            className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Kota / Kabupaten</label>
                          <input
                            id="kota"
                            name="kota"
                            type="text"
                            value={settings.kota}
                            onChange={(e) => handleSettingsChange("kota", e.target.value)}
                            placeholder="Nama Kota Penandatangan"
                            className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Curricular dropdowns */}
                  <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Jenjang Pendidikan</label>
                      <select
                        id="jenjang"
                        name="jenjang"
                        value={commonData.jenjang}
                        onChange={(e) => handleJenjangChange(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 p-2 outline-none focus:border-blue-500 focus:bg-white transition"
                      >
                        <option value="SD/MI">SD/MI</option>
                        <option value="SMP/MTs">SMP/MTs</option>
                        <option value="SMA/SMK/MA">SMA/SMK/MA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Kelas</label>
                      <select
                        id="kelas"
                        name="kelas"
                        value={commonData.kelas}
                        onChange={(e) => handleKelasChange(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 p-2 outline-none focus:border-blue-500 focus:bg-white transition"
                      >
                        {commonData.jenjang === "SD/MI" &&
                          ["I", "II", "III", "IV", "V", "VI"].map((kls) => (
                            <option key={kls} value={kls}>
                              Kelas {kls}
                            </option>
                          ))}
                        {commonData.jenjang === "SMP/MTs" &&
                          ["VII", "VIII", "IX"].map((kls) => (
                            <option key={kls} value={kls}>
                              Kelas {kls}
                            </option>
                          ))}
                        {commonData.jenjang === "SMA/SMK/MA" &&
                          ["X", "XI", "XII"].map((kls) => (
                            <option key={kls} value={kls}>
                              Kelas {kls}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Fase Pengajaran</label>
                      <input
                        id="fase"
                        name="fase"
                        type="text"
                        readOnly
                        value={`Fase ${commonData.fase}`}
                        className="w-full p-2.5 border border-slate-200 bg-slate-100 rounded-xl text-slate-500 font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tahun Ajaran</label>
                      <input
                        id="tahunAjaran"
                        name="tahunAjaran"
                        type="text"
                        value={commonData.tahunAjaran}
                        onChange={(e) => setCommonData({ ...commonData, tahunAjaran: e.target.value })}
                        placeholder="2025/2026"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>

                    {activeMenu !== "prota" && (
                      <div className="col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Semester</label>
                        <select
                          id="semester"
                          name="semester"
                          value={commonData.semester}
                          onChange={(e) => setCommonData({ ...commonData, semester: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 p-2 outline-none focus:border-blue-500 focus:bg-white transition"
                        >
                          <option value="Ganjil">Semester Ganjil (Gasal)</option>
                          <option value="Genap">Semester Genap</option>
                        </select>
                      </div>
                    )}
                  </div>

                </div>

                {/* Section 2: Spesifikasi Mata Pelajaran */}
                {activeMenu !== "modul-koku" ? (
                  <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] border border-slate-200 shrink-0 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 text-indigo-600 border-b border-slate-100 pb-2">
                      <Target className="w-4 h-4" /> 2. Spesifikasi Mapel
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Mata Pelajaran</label>
                        <input
                          id="mapel"
                          name="mapel"
                          type="text"
                          value={specificData.mapel}
                          onChange={(e) => setSpecificData({ ...specificData, mapel: e.target.value })}
                          placeholder="Contoh: Pendidikan Pancasila, Biologi, Matematika"
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Elemen CP dihilangkan */}


                      {["modul-ajar", "soal", "lkpd"].includes(activeMenu) && (
                        <div>
                          {activeMenu === "soal" && specificData.jenisUjian?.match(/(STS|SAS|SAT)/) ? (
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] uppercase font-bold text-slate-500">Materi Pokok / Bab yang Diujikan</label>
                                <button type="button" onClick={handleAddBab} className="p-1 px-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-bold flex items-center gap-1 transition text-[10px]">
                                  <Plus className="w-3 h-3" /> Tambah Bab
                                </button>
                              </div>
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {specificData.babList.map((bab, idx) => (
                                  <div key={idx} className="flex gap-2 items-center">
                                    <span className="text-[10px] font-mono text-slate-400 w-4">{idx + 1}.</span>
                                    <input type="text" value={bab} onChange={(e) => handleBabTextChange(idx, e.target.value)} className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-[11px]" placeholder="Misal: Bab 1 - Bilangan Bulat" />
                                    <button type="button" onClick={() => handleRemoveBab(idx)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition"><Trash className="w-4 h-4" /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex justify-between items-center">
                                <span>{["modul-ajar", "lkpd"].includes(activeMenu) ? "Topik Materi" : "Materi Pokok / Bahasan Inti"}</span>
                                {["cp-tp-atp", "kktp"].includes(activeMenu) && (
                                  <button
                                    type="button"
                                    onClick={handleSuggestMateriPokok}
                                    disabled={isSuggestingMateri}
                                    className="text-white bg-indigo-500 hover:bg-indigo-600 px-2 py-1 flex items-center gap-1 rounded-lg text-[10px] font-bold transition disabled:opacity-50"
                                    title="Rumuskan Otomatis dengan AI"
                                  >
                                    {isSuggestingMateri ? (
                                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                      <Wand2 className="w-3 h-3" />
                                    )}
                                    Auto
                                  </button>
                                )}
                              </label>
                              <textarea
                                id="materiPokok"
                                name="materiPokok"
                                value={specificData.materiPokok}
                                onChange={(e) => setSpecificData({ ...specificData, materiPokok: e.target.value })}
                                placeholder={["cp-tp-atp", "kktp"].includes(activeMenu) ? "Kosongkan agar dirincikan otomatis oleh AI, atau ketik manual:\n1. Judul Materi Pertama\n2. Judul Materi Kedua\n..." : "Contoh: Energi Alternatif Sel Surya"}
                                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition min-h-[90px] text-[11px]"
                              />
                            </>
                          )}
                        </div>
                      )}

                      {false && (
                        <div className="pt-2">
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex justify-between items-center">
                            <span>Capaian Pembelajaran (CP)</span>
                            <button
                              onClick={() => setSpecificData({ ...specificData, cp: "Tolong AI carikan dan jabarkan Capaian Pembelajaran terbaru" })}
                              className="text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded text-[9px] flex items-center gap-1 transition-colors"
                              title="Isi dengan template AI"
                            >
                              <Wand2 className="w-3 h-3" /> Magic Wand AI
                            </button>
                          </label>
                          <textarea
                            id="cp"
                            name="cp"
                            value={specificData.cp}
                            onChange={(e) => setSpecificData({ ...specificData, cp: e.target.value })}
                            placeholder="Ketikan manual atau gunakan Magic Wand AI"
                            className="w-full h-16 p-2 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-[11px] transition"
                          />
                        </div>
                      )}

                      {["modul-ajar", "kktp", "soal"].includes(activeMenu) && (
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex justify-between items-center">
                            Tujuan Pembelajaran (TP)
                            <button
                              onClick={() => setSpecificData({ ...specificData, tp: activeMenu === "kktp" ? "Tentukan kriteria ketercapaian dari Tujuan Pembelajaran berikut: ..." : "Rumuskan TP secara otomatis berdasarkan CP di atas." })}
                              className="text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded text-[9px] flex items-center gap-1 transition-colors"
                              title="Isi dengan template AI"
                            >
                              <Wand2 className="w-3 h-3" /> Magic Wand AI
                            </button>
                          </label>
                          <textarea
                            id="tp"
                            name="tp"
                            value={specificData.tp}
                            onChange={(e) => setSpecificData({ ...specificData, tp: e.target.value })}
                            placeholder={activeMenu === "kktp" ? "Ketikan atau paste Tujuan Pembelajaran Anda di sini" : "Ketikan manual atau gunakan Magic Wand AI"}
                            className="w-full h-16 p-2 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-[11px] transition"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] border border-slate-200 shrink-0 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 text-indigo-600 border-b border-slate-100 pb-2">
                      <Compass className="w-4 h-4" /> 2. Spesifikasi Kokurikuler
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tema</label>
                        <select
                          value={specificData.temaP5}
                          onChange={(e) => setSpecificData({ ...specificData, temaP5: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 p-2 outline-none focus:border-blue-500 focus:bg-white transition"
                        >
                          {TEMA_P5.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Topik Kegiatan</label>
                        <input
                          type="text"
                          value={specificData.topikP5}
                          onChange={(e) => setSpecificData({ ...specificData, topikP5: e.target.value })}
                          placeholder="Contoh: Pembuatan Pupuk Kompos Organik Cair"
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3: Pengaturan Tambahan */}
                <div className={`bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] border border-slate-200 shrink-0 space-y-4 ${["cp-tp-atp", "kktp"].includes(activeMenu) ? "hidden" : ""}`}>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 text-emerald-600 border-b border-slate-100 pb-2">
                    <BookOpen className="w-4 h-4" /> 3. Pengaturan Tambahan
                  </h3>

                  <div className="space-y-3">
                    {/* CP, TP, ATP */}
                    {activeMenu === "cp-tp-atp" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                              Jumlah TP
                            </label>
                            <input type="text" value={specificData.jumlahTp} onChange={e => setSpecificData({...specificData, jumlahTp: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Otomatis atau ketik (Misal: 4)" />
                            <div className="mt-1">
                              <span className="text-[9px] text-blue-500 font-medium bg-blue-50/50 px-1.5 py-0.5 rounded-md">* Bisa dikosongkan</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                              Jumlah Pertemuan
                            </label>
                            <input type="text" value={specificData.jumlahPertemuan} onChange={e => setSpecificData({...specificData, jumlahPertemuan: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Otomatis atau ketik (Misal: 4)" />
                            <div className="mt-1">
                              <span className="text-[9px] text-blue-500 font-medium bg-blue-50/50 px-1.5 py-0.5 rounded-md">* Bisa dikosongkan</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Modul Ajar */}
                    {activeMenu === "modul-ajar" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Alokasi Waktu</label>
                          <input type="text" value={specificData.alokasiWaktu} onChange={e => setSpecificData({...specificData, alokasiWaktu: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Contoh: 2 JP (2 x 35 menit)" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Model Pembelajaran</label>
                            <select value={specificData.model} onChange={e => setSpecificData({...specificData, model: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 outline-none focus:border-blue-500">
                              {MODEL_PEMBELAJARAN.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Metode Pembelajaran</label>
                            <select value={specificData.metode} onChange={e => setSpecificData({...specificData, metode: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 outline-none focus:border-blue-500">
                              <option value="">Pilih Metode Pembelajaran</option>
                              {METODE_PEMBELAJARAN.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Media Ajar / Sumber Belajar</label>
                          <input type="text" value={specificData.media} onChange={e => setSpecificData({...specificData, media: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Misal: Buku Paket, LKPD, LCD Proyektor..." />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex justify-between">Mitra Belajar</label>
                          <div className="grid grid-cols-2 gap-1.5 mt-2">
                            {MITRA_BELAJAR.map(mitra => {
                              const isChecked = specificData.mitra.includes(mitra);
                              return (
                                <button
                                  type="button"
                                  key={mitra}
                                  onClick={() => toggleMitra(mitra)}
                                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-[10px] text-left transition ${isChecked ? "bg-blue-50 border-blue-400 text-blue-800 font-bold" : "bg-slate-50/50 border-slate-200 text-slate-600"}`}
                                >
                                  <div className={`w-3 h-3 rounded flex items-center justify-center shrink-0 border ${isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"}`}>{isChecked && <Check className="w-2 h-2" />}</div>
                                  <span className="truncate">{mitra}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Modul Kokurikuler */}
                    {activeMenu === "modul-koku" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Durasi Kegiatan</label>
                          <input type="text" value={specificData.alokasiWaktu} onChange={e => setSpecificData({...specificData, alokasiWaktu: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Misal: 4 JP (4x35 Menit)" />
                        </div>
                      </div>
                    )}

                    {/* Prota */}
                    {activeMenu === "prota" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Jumlah Minggu Efektif (Setahun)</label>
                          <input type="text" value={specificData.jumlahMingguEfektif} onChange={e => setSpecificData({...specificData, jumlahMingguEfektif: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Misal: 36 Minggu" />
                        </div>
                      </div>
                    )}

                    {/* Prosem */}
                    {activeMenu === "prosem" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex justify-between items-center">
                            Program Tahunan
                          </label>
                          <textarea
                            id="prota"
                            name="prota"
                            value={specificData.prota}
                            onChange={(e) => setSpecificData({ ...specificData, prota: e.target.value })}
                            placeholder="Ketikan atau paste Program Tahunan Anda di sini"
                            className="w-full h-24 p-2 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-[11px] transition"
                          />
                        </div>
                      </div>
                    )}

                    {/* KKTP */}
                    {activeMenu === "kktp" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Model KKTP</label>
                          <input type="text" value={specificData.modelKktp} onChange={e => setSpecificData({...specificData, modelKktp: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Rubrik, Interval Nilai..." />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Rentang Nilai</label>
                            <input type="text" value={specificData.rentangNilai} onChange={e => setSpecificData({...specificData, rentangNilai: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Misal: 0-100" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Teknik Penilaian</label>
                            <input type="text" value={specificData.teknikPenilaian} onChange={e => setSpecificData({...specificData, teknikPenilaian: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Misal: Tes Tertulis dan Observasi" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Soal */}
                    {activeMenu === "soal" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Jenis Asesmen</label>
                            <select value={specificData.jenisUjian} onChange={e => setSpecificData({...specificData, jenisUjian: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 p-2 outline-none focus:border-blue-500">
                              {JENIS_UJIAN.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Level Soal</label>
                            <select value={specificData.fokusKognitif} onChange={e => setSpecificData({...specificData, fokusKognitif: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 p-2 outline-none focus:border-blue-500">
                              {FOKUS_KOGNITIF.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Jumlah Pilihan Jawaban</label>
                            <input type="text" value={specificData.jumlahPilihanJawaban} onChange={e => setSpecificData({...specificData, jumlahPilihanJawaban: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="4 atau 5" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 mt-6 flex gap-2 items-center">
                              <input type="checkbox" checked={specificData.gunakanStimulus} onChange={e => setSpecificData({...specificData, gunakanStimulus: e.target.checked})} className="w-4 h-4 rounded text-blue-600" />
                              Gunakan Stimulus
                            </label>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-2">Bentuk dan Jumlah Soal</label>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            <div>
                               <label className="block text-[10px] text-slate-500 mb-1">PG</label>
                               <input type="number" min="0" value={specificData.pg} onChange={e => setSpecificData({...specificData, pg: parseInt(e.target.value) || 0})} className="w-full p-2 border border-slate-300 rounded-xl text-center" />
                            </div>
                            <div>
                               <label className="block text-[10px] text-slate-500 mb-1">Isian Singkat</label>
                               <input type="number" min="0" value={specificData.isian} onChange={e => setSpecificData({...specificData, isian: parseInt(e.target.value) || 0})} className="w-full p-2 border border-slate-300 rounded-xl text-center" />
                            </div>
                            <div>
                               <label className="block text-[10px] text-slate-500 mb-1">Uraian / Esai</label>
                               <input type="number" min="0" value={specificData.essay} onChange={e => setSpecificData({...specificData, essay: parseInt(e.target.value) || 0})} className="w-full p-2 border border-slate-300 rounded-xl text-center" />
                            </div>
                            <div>
                               <label className="block text-[10px] text-slate-500 mb-1">Menjodohkan</label>
                               <input type="number" min="0" value={specificData.jodoh} onChange={e => setSpecificData({...specificData, jodoh: parseInt(e.target.value) || 0})} className="w-full p-2 border border-slate-300 rounded-xl text-center" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LKPD */}
                    {activeMenu === "lkpd" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Jenis LKPD</label>
                            <select value={specificData.jenisLkpd || "Eksperimen / Praktikum"} onChange={e => setSpecificData({...specificData, jenisLkpd: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 p-2 outline-none focus:border-blue-500">
                              <option value="Eksperimen / Praktikum">Eksperimen / Praktikum</option>
                              <option value="Diskusi Kelompok">Diskusi Kelompok</option>
                              <option value="Proyek / Penugasan">Proyek / Penugasan</option>
                              <option value="Latihan Soal / Kuis">Latihan Soal / Kuis</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Bentuk Tugas</label>
                            <input type="text" value={specificData.bentukTugas || ""} onChange={e => setSpecificData({...specificData, bentukTugas: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Misal: Makalah, Presentasi, Unjuk Kerja" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Input Soal Sendiri / Mandiri (Opsional)</label>
                          <textarea
                            value={specificData.soalMandiri || ""}
                            onChange={e => setSpecificData({...specificData, soalMandiri: e.target.value})}
                            className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500 h-24 text-xs font-medium"
                            placeholder="Tuliskan daftar pertanyaan atau soal Anda sendiri di sini jika ingin menggunakan soal buatan Anda sendiri (bukan dibuat otomatis oleh AI)..."
                          />
                        </div>
                      </div>
                    )}

                    {/* Cover */}
                    {activeMenu === "cover" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Dokumen Apa?</label>
                            <select value={specificData.jenisDokumen || "Modul Ajar"} onChange={e => setSpecificData({...specificData, jenisDokumen: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 p-2 outline-none focus:border-blue-500">
                              <option value="Modul Ajar">Modul Ajar</option>
                              <option value="Modul Kokurikuler P5">Modul Kokurikuler P5</option>
                              <option value="Program Tahunan (Prota)">Program Tahunan (Prota)</option>
                              <option value="Program Semester (Prosem)">Program Semester (Prosem)</option>
                              <option value="KKTP">KKTP</option>
                              <option value="Analisis CP TP ATP">Analisis CP TP ATP</option>
                              <option value="LKPD">LKPD</option>
                              <option value="Soal Asesmen">Soal Asesmen</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tahun Pembuatan / Ajaran</label>
                            <input type="text" value={specificData.tahunPembuatan || "2024/2025"} onChange={e => setSpecificData({...specificData, tahunPembuatan: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50/50 outline-none focus:border-blue-500" placeholder="Misal: 2024/2025" />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                </div> {/* End Scrollable Form Content */}

                {/* Submitting buttons port pinned at the bottom */}
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl shadow-[0_2px_12px_rgba(30,41,59,0.02)] shrink-0 mt-3">
                  <div className="flex gap-2.5">
                    <button
                      onClick={handleGenerate}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/10 transition-all active:scale-95 text-xs shadow-md"
                    >
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Buat Prompt AI</span>
                    </button>

                    <button
                      onClick={handleResetForm}
                      className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-red-500 transition-colors shadow-sm"
                      title="Reset Form"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* API error panel */}
                  {apiError && (
                    <div className="mt-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[11px] flex flex-col gap-2">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                          <span className="font-extrabold block mb-0.5 text-red-800">Kesalahan Pengerjaan API:</span>
                          <span className="block font-medium">{apiError}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: RICH TEXT FRAMEWORK & SIMULATION PAPER */}
              <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200 relative shadow-sm lg:min-h-0 overflow-hidden">
                
                {/* Fixed Header Toolbar Wrapper */}
                <div className="sticky top-0 z-20 rounded-t-2xl overflow-hidden shadow-sm">
                  {/* Editor Top Utility Header */}
                  <div className="bg-slate-900 text-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                  <span className="font-bold text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Editor Presisi & Siap Cetak
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      disabled={!editorHtml}
                      className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-slate-300 hover:text-white transition"
                      title="Pratinjau Layar Penuh"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      disabled={!editorHtml}
                      className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-slate-300 hover:text-white transition"
                      title="Salin ke Clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSaveHistory}
                      disabled={!editorHtml}
                      className="p-2 bg-slate-800 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-slate-300 hover:text-white transition"
                      title="Simpan ke Berkas Sesi"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      onClick={exportToPdf}
                      disabled={!editorHtml}
                      className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 ml-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Simpan PDF</span>
                    </button>
                    <button
                      onClick={exportToWord}
                      disabled={!editorHtml}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 ml-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .doc</span>
                    </button>
                  </div>
                </div>

                {/* Standard text decorators & Alignments */}
                <div className="bg-slate-800 p-2 border-b border-slate-700/50 flex flex-wrap gap-1 shrink-0">
                  <div className="flex items-center gap-1 pr-2 mr-1 border-r border-slate-700/50">
                    <button
                      onClick={() => execCommand("bold")}
                      className="p-1.5 px-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold"
                      title="Tebal (Bold)"
                    >
                      <BoldIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => execCommand("italic")}
                      className="p-1.5 px-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      title="Miring (Italic)"
                    >
                      <ItalicIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => execCommand("underline")}
                      className="p-1.5 px-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      title="Garis Bawah (Underline)"
                    >
                      <UnderlineIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 pr-2 mr-1 border-r border-slate-700/50">
                    <button
                      onClick={() => execCommand("justifyLeft")}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      title="Rata Kiri"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => execCommand("justifyCenter")}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      title="Rata Tengah"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => execCommand("justifyRight")}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      title="Rata Kanan"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => execCommand("justifyFull")}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      title="Rata Kiri Kanan"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 pr-2 mr-1 border-r border-slate-700/50">
                    <button
                      onClick={() => execCommand("insertUnorderedList")}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      title="Daftar Simbol (Bullets)"
                    >
                      <ListIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => execCommand("insertOrderedList")}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                      title="Daftar Angka (Numbering)"
                    >
                      <ListOrderedIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => execCommand("removeFormat")}
                    className="p-1.5 px-2 bg-slate-700 hover:bg-red-900/40 rounded-lg text-slate-300 hover:text-red-200 transition flex items-center gap-1.5"
                    title="Hapus Pemformatan"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">Bersihkan</span>
                  </button>
                </div>
                </div> {/* End Fixed Header Toolbar Wrapper */}

                {/* Simulating writing document paper */}
                <div className="flex-1 p-4 sm:p-6 bg-slate-50/70 relative overflow-y-auto custom-scrollbar">
                  {!editorHtml ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3 bg-white/50 backdrop-blur-sm">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Prompt Belum Disusun</h4>
                        <p className="text-[10px] text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed justify-center font-medium">
                          Silakan lengkapi parameter spesifikasi akademis Anda di panel kiri, kemudian klik tombol "Buat Prompt AI" untuk mulai merumuskan prompt.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* HTML Paper frame view with full editing enablement */}
                  <div className="bg-white shadow-xl mx-auto max-w-[210mm] min-h-[297mm] p-6 sm:p-10 border border-slate-200 rounded text-slate-800">
                    <div
                      id="document-editor"
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleEditorInput}
                      className="outline-none doc-preview-area"
                      dangerouslySetInnerHTML={{ __html: editorHtml }}
                    />
                  </div>

                </div>

              </div>
              
            </div>
          )}

        </div>
      </main>

      {/* DETAILED RESPONSIVE PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] bg-slate-900/80 backdrop-blur-sm overflow-hidden flex items-center justify-center p-2 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-100 rounded-3xl w-full max-w-5xl h-[95vh] sm:h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Header inside Modal */}
              <div className="bg-white text-slate-800 p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-3">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="bg-blue-50 p-2 rounded-xl text-blue-600 shrink-0">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 truncate max-w-sm sm:max-w-md">
                      {documentTitle}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Mode Siap Cetak & Edit (A4 Standard)</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {/* Editor Toolbars in Preview */}
                  <div className="flex items-center mr-2 border-r border-slate-200 pr-2">
                    <button onClick={() => execCommand("bold")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Bold"><BoldIcon className="w-4 h-4" /></button>
                    <button onClick={() => execCommand("italic")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Italic"><ItalicIcon className="w-4 h-4" /></button>
                    <button onClick={() => execCommand("underline")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Underline"><UnderlineIcon className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button onClick={() => execCommand("justifyLeft")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Align Left"><AlignLeft className="w-4 h-4" /></button>
                    <button onClick={() => execCommand("justifyCenter")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Align Center"><AlignCenter className="w-4 h-4" /></button>
                    <button onClick={() => execCommand("justifyRight")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Align Right"><AlignRight className="w-4 h-4" /></button>
                    <button onClick={() => execCommand("justifyFull")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Justify"><AlignJustify className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button onClick={() => execCommand("insertUnorderedList")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Bullet"><ListIcon className="w-4 h-4" /></button>
                    <button onClick={() => execCommand("insertOrderedList")} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="Numbering"><ListOrderedIcon className="w-4 h-4" /></button>
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition hidden sm:block"
                    title="Salin Dokumen"
                  >
                    <Copy className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={exportToPdf}
                    className="bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Simpan PDF</span>
                  </button>
                  <button
                    onClick={exportToWord}
                    className="bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Unduh Word</span>
                  </button>
                  <div className="w-px h-5 bg-slate-200 mx-1.5 hidden sm:block"></div>
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl text-slate-500 transition"
                    title="Tutup"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Document page frame */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 bg-slate-200/50 custom-scrollbar">
                <div className="bg-white shadow-xl mx-auto max-w-[210mm] min-h-[297mm] p-8 sm:p-14 border border-slate-200 rounded text-slate-800">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    className="text-left doc-preview-area outline-none"
                    dangerouslySetInnerHTML={{ __html: editorHtml }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
