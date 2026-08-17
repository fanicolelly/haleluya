import type { LucideIcon } from "lucide-react";
import { Truck, CreditCard, RotateCcw, ShieldCheck, PackageCheck } from "lucide-react";

export interface HelpCategory {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  badge: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// Sumber tunggal kategori bantuan — dipakai bersama oleh card grid dan
// section accordion FAQ di app/bantuan/page.tsx.
export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: "pesanan-pengiriman",
    name: "Pesanan & Pengiriman",
    description: "Estimasi pengiriman, lacak pesanan, dan status kirim.",
    icon: Truck,
    badge: "bg-blue-50 text-blue-700",
  },
  {
    slug: "pembayaran",
    name: "Pembayaran",
    description: "Metode pembayaran, kegagalan transaksi, dan invoice.",
    icon: CreditCard,
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    slug: "retur-pengembalian-dana",
    name: "Retur & Pengembalian Dana",
    description: "Ajukan retur, klaim barang rusak, dan proses refund.",
    icon: RotateCcw,
    badge: "bg-amber-50 text-amber-700",
  },
  {
    slug: "akun-keamanan",
    name: "Akun & Keamanan",
    description: "Kelola akun, password, dan keamanan data Anda.",
    icon: ShieldCheck,
    badge: "bg-violet-50 text-violet-700",
  },
  {
    slug: "kebijakan-produk",
    name: "Kebijakan Produk",
    description: "Garansi, keaslian produk, dan standar kualitas.",
    icon: PackageCheck,
    badge: "bg-rose-50 text-rose-700",
  },
];

export const FAQ_BY_CATEGORY: Record<string, FaqItem[]> = {
  "pesanan-pengiriman": [
    {
      question: "Berapa lama estimasi pengiriman?",
      answer:
        "Estimasi pengiriman umumnya 2-5 hari kerja untuk area Jawa dan 4-8 hari kerja untuk luar Jawa, tergantung jasa kirim yang dipilih saat checkout.",
    },
    {
      question: "Bagaimana cara melacak pesanan saya?",
      answer:
        'Buka halaman "Pesanan Saya", pilih pesanan yang ingin dilacak, lalu lihat status dan nomor resi pengiriman di detail pesanan.',
    },
    {
      question: "Apakah saya bisa mengubah alamat pengiriman setelah checkout?",
      answer:
        "Alamat pengiriman dapat diubah selama pesanan masih berstatus \"Diproses\" dan belum dikirim. Setelah status berubah menjadi \"Dikirim\", alamat tidak dapat diubah.",
    },
    {
      question: "Apa yang harus dilakukan jika pesanan belum sampai sesuai estimasi?",
      answer:
        "Cek dulu status resi di halaman detail pesanan. Jika sudah melewati estimasi lebih dari 2 hari kerja, hubungi tim kami lewat form kontak di bawah halaman ini.",
    },
    {
      question: "Apakah tersedia pengiriman same-day atau instan?",
      answer:
        "Untuk sebagian area di kota besar, opsi pengiriman instan/same-day tersedia dan bisa dipilih saat checkout jika ongkos kirimnya muncul di daftar kurir.",
    },
  ],
  pembayaran: [
    {
      question: "Apa saja metode pembayaran yang tersedia?",
      answer:
        "BelanjAI mendukung transfer bank, kartu kredit/debit, e-wallet, dan QRIS. Semua opsi yang tersedia akan muncul otomatis di halaman checkout.",
    },
    {
      question: "Kenapa pembayaran saya gagal padahal saldo cukup?",
      answer:
        "Kegagalan biasanya disebabkan sesi pembayaran kedaluwarsa atau gangguan sementara dari penyedia pembayaran. Coba ulangi transaksi, atau gunakan metode pembayaran lain.",
    },
    {
      question: "Apakah transaksi di BelanjAI aman?",
      answer:
        "Ya. Seluruh transaksi diproses melalui kanal pembayaran terenkripsi dan BelanjAI tidak menyimpan data kartu Anda secara langsung.",
    },
    {
      question: "Bagaimana cara mendapatkan invoice atau bukti pembayaran?",
      answer:
        'Invoice otomatis tersedia di halaman detail pesanan pada tab "Pesanan Saya" setelah pembayaran berhasil dikonfirmasi.',
    },
    {
      question: "Apakah bisa membayar dengan cicilan?",
      answer:
        "Opsi cicilan tersedia untuk kartu kredit tertentu dan akan ditampilkan otomatis di halaman checkout jika kartu Anda memenuhi syarat dari penyedia pembayaran.",
    },
  ],
  "retur-pengembalian-dana": [
    {
      question: "Bagaimana cara mengajukan retur barang rusak?",
      answer:
        'Buka detail pesanan terkait, pilih "Ajukan Retur", unggah foto/video kondisi barang, lalu ikuti instruksi hingga pengajuan terkirim ke tim kami.',
    },
    {
      question: "Bagaimana cara pakai fitur AI Damage/Defect Pre-Screening untuk klaim retur?",
      answer:
        'Sebelum mengajukan retur, Anda bisa memakai fitur "AI Defect Pre-Screening" untuk memindai foto produk. Sistem akan mendeteksi tanda kerusakan secara otomatis dan membantu mempercepat proses verifikasi klaim retur Anda.',
    },
    {
      question: "Berapa lama proses pengembalian dana (refund)?",
      answer:
        "Setelah retur disetujui, dana biasanya dikembalikan dalam 3-7 hari kerja ke metode pembayaran asal, tergantung kebijakan masing-masing penyedia pembayaran.",
    },
    {
      question: "Barang apa saja yang tidak bisa diretur?",
      answer:
        "Produk yang sudah dipakai di luar kondisi cacat, produk higienis (mis. kosmetik yang segelnya dibuka), dan barang custom umumnya tidak dapat diretur.",
    },
    {
      question: "Apakah ongkos kirim retur ditanggung BelanjAI?",
      answer:
        "Untuk klaim barang rusak atau salah kirim, ongkos kirim retur ditanggung penuh oleh BelanjAI. Untuk retur di luar alasan tersebut, ongkos kirim ditanggung pembeli.",
    },
  ],
  "akun-keamanan": [
    {
      question: "Bagaimana cara mengubah email atau password akun saya?",
      answer:
        'Buka "Pengaturan" lalu pilih tab "Akun". Di sana tersedia form untuk mengubah email dan password akun Anda.',
    },
    {
      question: "Saya lupa password, bagaimana cara reset?",
      answer:
        'Gunakan opsi "Lupa Password" di halaman masuk untuk menerima tautan reset password ke email yang terdaftar.',
    },
    {
      question: "Bagaimana cara menghapus akun saya secara permanen?",
      answer:
        'Buka "Pengaturan" > "Akun", lalu gunakan opsi "Hapus Akun" di bagian bawah. Anda perlu mengetik kata konfirmasi sebelum penghapusan diproses.',
    },
    {
      question: "Apakah data pribadi saya aman di BelanjAI?",
      answer:
        'Ya, seluruh data pribadi dikelola sesuai kebijakan privasi kami. Anda juga bisa mengatur visibilitas riwayat belanja lewat "Pengaturan" > "Privasi".',
    },
    {
      question: "Bagaimana cara mengaktifkan notifikasi keamanan akun?",
      answer:
        'Notifikasi terkait aktivitas akun dapat diatur lewat "Pengaturan" > "Notifikasi".',
    },
  ],
  "kebijakan-produk": [
    {
      question: "Apakah semua produk di BelanjAI asli/original?",
      answer:
        "Ya, seluruh penjual di BelanjAI wajib memenuhi standar keaslian produk kami, dan produk yang terindikasi palsu akan langsung diturunkan dari katalog.",
    },
    {
      question: "Apakah produk elektronik mendapat garansi resmi?",
      answer:
        "Produk elektronik dengan label garansi resmi pada halaman produk akan mendapat garansi sesuai ketentuan pabrikan/distributor resmi di Indonesia.",
    },
    {
      question: "Bagaimana BelanjAI memastikan kualitas produk sebelum dikirim?",
      answer:
        "Sebagian mitra penjual menggunakan fitur AI Defect Pre-Screening kami untuk memindai potensi cacat produk sebelum barang dikemas dan dikirim ke pembeli.",
    },
    {
      question: "Apa yang terjadi jika review produk terindikasi palsu?",
      answer:
        "BelanjAI memakai fitur AI Fake Review Detector untuk menyaring ulasan mencurigakan, sehingga rating dan review yang tampil lebih dapat dipercaya.",
    },
    {
      question: "Bagaimana jika deskripsi produk tidak sesuai dengan barang yang diterima?",
      answer:
        'Ajukan retur dengan alasan "tidak sesuai deskripsi" melalui halaman detail pesanan, sertakan foto barang agar proses verifikasi lebih cepat.',
    },
  ],
};
