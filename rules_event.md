# Aturan Umum - Gen AI Academy APAC Cohort 3 Ideathon
### Build a Secure "Personal Gemini Journal" - Hackathon Challenge

> Sumber: `data-rules.md` - Ringkasan aturan resmi Gen AI Academy Cohort 3 Ideathon

---

## 1. Tentang Event

Gen AI Academy Cohort 3 Ideathon adalah kompetisi lanjutan dari program Gen AI Academy. Jika Academy mengajarkan cara membangun aplikasi AI, Ideathon adalah tempat peserta membangun dan memamerkan solusi nyata milik sendiri yang di-deploy ke production.

**Tema Challenge:** Membangun aplikasi web AI **"Personal Gemini Journal"** - aplikasi jurnal personal berbasis AI yang aman, ter-autentikasi, dan di-deploy live di **Google Cloud Run**.

Tagline tantangan: *Most AI-generated apps look great in a demo and fall apart in production — hardcoded keys, no auth boundaries, shared databases with zero isolation. Your challenge is to fix that at the source.*

---

## 2. Siapa yang Bisa Ikut (Eligibility)

- Terbuka untuk **semua developer & builders**.
- Syarat mutlak: **Harus terdaftar sebagai peserta Gen AI Academy Cohort 3**.
- Sudah di Cohort 3? Langsung bisa ikut.
- Belum terdaftar? Wajib registrasi sebelum **31 Agustus 2026**.

---

## 3. Timeline Resmi

| Tahap | Tanggal |
| :--- | :--- |
| **Registrations Close** | 31 Agustus 2026 |
| **Build, Post & Submit** | 31 Agustus – 06 September 2026 |
| **Submissions Close (Dashboard Lock)** | **06 September 2026 - No Extensions** |
| **Evaluation** | 07 – 28 September 2026 |
| **Winners Announced** | Akhir September 2026 |

> **Peraturan Keras:** Dashboard adalah *single source of truth* untuk semua submission. Pada 06 September dashboard akan terkunci. Tidak ada perpanjangan waktu.

---

## 4. Tantangan Utama (The Challenge)

Peserta wajib membangun aplikasi web AI production-ready yang memenuhi arsitektur production-grade, bukan sekadar demo. Sebelum menulis kode, peserta diminta mengkonfigurasi **Google AI Studio dengan Custom Instructions** yang berpikir layaknya security engineer (threat modeling, secure coding standards, database isolation, secret management) sebagai konstitusi pembangunan.

Aplikasi yang dibangun adalah **Personal Gemini Journal**: pengguna login, melakukan jurnal/brainstorming multi-turn dengan Gemini, dan semua percakapan tersimpan di ruang privat masing-masing pengguna.

---

## 5. Persyaratan Teknis Wajib (4 Pilar Utama)

Aplikasi **WAJIB** menggunakan stack berikut dan di-deploy di **Cloud Run**:

1.  **User Authentication (Firebase Authentication)**
    - Fitur login pengguna yang aman menggunakan Firebase Auth.
    - Wajib ada batasan akses (auth boundaries) antar pengguna.

2.  **Integrasi AI (Gemini API via AI Studio)**
    - Menggunakan Gemini API untuk percakapan **multi-turn** (bukan single prompt).
    - Fitur: brainstorming, refleksi, pembuatan jurnal.

3.  **Isolated Data Storage (Cloud Firestore)**
    - Semua interaksi pengguna dengan Gemini harus disimpan secara privat per-user di Cloud Firestore.
    - **Zero cross-user leakage** - mencegah kebocoran data antar pengguna. Wajib konfigurasi security rules Firestore dengan benar.

4.  **Secure Key Management (Google Cloud Secret Manager)**
    - API keys dan semua data rahasia **DILARANG hardcode**.
    - Wajib ditarik secara aman menggunakan Google Cloud Secret Manager.

> Template/starter app disediakan di Google AI Studio sebagai panduan dasar, namun **tidak boleh hanya mengumpulkan template tersebut**.

---

## 6. Syarat Pengumpulan Wajib (Mandatory Submission Rules)

Semua submission dikumpulkan melalui **Academy Programme Dashboard (Hack2skill)** dan wajib mencakup **3 deliverables utama**:

### A. Deployment Link / App Walkthrough
- Link URL aplikasi yang sudah live dan dapat diakses publik di **Cloud Run**.
- Alternatif jika tidak bisa publik: link ke blog/video yang menunjukkan walkthrough lengkap aplikasi.

### B. Demo Social Post Link
- Link postingan publik di **LinkedIn, X (Twitter), Facebook, Instagram, atau Medium** yang menampilkan video/blog demo aplikasi.
- **WAJIB mencantumkan hashtag `#AccelerateAIwithCloudRun`** - tanpanya submission dianggap tidak eligible.
- Postingan harus menyertakan link ke public code repository.

### C. Public Code Repository Link
- Link repository **GitHub atau GitLab yang publik dan dapat diakses**.
- Harus mencakup: kode frontend, backend, konfigurasi keamanan Firestore, dan file README yang jelas tentang cara menjalankan aplikasi.
- Deskripsi singkat (brief description) wajib menjelaskan apa yang dibangun dan bagaimana memanfaatkan Firebase, Firestore, Cloud Run, dan Gemini.

### Instruksi Tambahan:
- Pastikan **semua link bekerja dan dapat diakses publik** serta mencakup semua teknologi yang disebutkan.
- Ikuti codelab: *Build a User-Authenticated AI Application with Custom Instructions on Google AI Studio & Cloud Run* untuk instruksi detail.

**Rangkuman Format Submit di Dashboard:**
1. Public GitHub/GitLab repository link
2. Demo blog post / video social media post dengan hashtag `#AccelerateAIwithCloudRun`
3. Working prototype link (deployed Cloud Run URL)

---

## 7. Tantangan Sebenarnya: Inovasi & Autentisitas (Make it Yours)

Panitia (Rohan) menekankan bahwa nilai bagus **tidak akan didapat** jika hanya mengumpulkan aplikasi dasar sesuai template. Peserta diharapkan:

- Mengembangkan aplikasi lebih jauh dengan **minimal 1 fitur original enhancement** di luar spesifikasi dasar (dibangun menggunakan AI Studio).
- Mengintegrasikan **API pihak ketiga** (Contoh: Google Maps untuk geo-tagging jurnal, atau Slack/Email untuk notifikasi pengingat menulis jurnal).
- Membangun **UI/UX yang imersif dan orisinal** sesuai interpretasi masing-masing terhadap kebutuhan pengguna (Contoh: jurnal khusus untuk profesional yang rentan burnout).

---

## 8. Kriteria Penilaian (Judging Criteria)

Setiap submission akan dinilai berdasarkan 4 kriteria:

| Kriteria | Penjelasan |
| :--- | :--- |
| **1. Authenticity (Autentisitas)** | Apakah aplikasi orisinal dan benar-benar karya sendiri, bukan hanya menyalin starter app? |
| **2. Usability (Kegunaan)** | Apakah aplikasi menyelesaikan masalah nyata untuk pengguna nyata? Apakah UX lancar dan navigasi mudah? |
| **3. Stability (Stabilitas)** | Apakah aplikasi benar-benar berjalan stabil, mampu menangani error tanpa crash? |
| **4. Security (Keamanan)** | Apakah dibangun secara bertanggung jawab? Apakah autentikasi bekerja benar, isolasi data Firestore benar, dan tidak ada API key yang terekspos? |

---

## 9. Aturan Umum & Ketentuan Penting

1.  **Production-Ready Wajib:** Aplikasi harus production-ready, authenticated, dan di-deploy di Cloud Run.
2.  **Stack Wajib Lengkap:** Firebase Authentication + Firestore + Gemini API (AI Studio) + Cloud Run + Secret Manager harus ada semua.
3.  **No Hardcoded Secrets:** Pelanggaran keamanan (hardcoded API key) akan dinilai buruk pada kriteria Security.
4.  **Public & Accessible:** Semua link (Deploy, Repo, Sosmed) harus publik dan dapat diverifikasi juri.
5.  **Single Source of Truth:** Hanya submission di Academy programme dashboard yang dianggap sah.
6.  **No Extension:** Keterlambatan submission setelah 06 September 2026 tidak akan diterima dengan alasan apapun.
7.  **Originalitas:** Plagiarisme atau hanya submit starter app tanpa modifikasi akan gagal di kriteria Authenticity.
8.  **Hashtag Mandatory:** Hashtag `#AccelerateAIwithCloudRun` bersifat wajib untuk eligibility.

---

## 10. Hadiah (Rewards)

Top 3 Winners dan 5 Runners-up akan mendapat pengakuan di seluruh program:

- **Featured on Google Cloud's Official Social Media Channels** - Karya dan nama ditampilkan di audiens developer global Google Cloud.
- **USD 10,000 Cash Pool Prize** - Untuk peserta dengan performa terbaik.
- **Exclusive Goodies & Swags** - Untuk peserta dengan performa terbaik.
- **Invitation to the Gen AI Elite Club** - Bagi yang unggul di Academy dan Ideathon.

---

## 11. Kesimpulan Panitia

Video briefing teknis menekankan bahwa panitia ingin menguji **kemampuan software engineering yang matang**, bukan hanya kemampuan memanggil Gemini API. Peserta dinilai dari kemampuan merancang arsitektur keamanan, manajemen database terisolasi, integrasi AI tingkat lanjut, hingga deployment ke level produksi.

> *The Academy teaches you to build. The Ideathon is where you build and showcase something of your own.*

---
*File ini dirangkum dari `data-rules.md` per 03 September 2026. Untuk detail teknis lengkap, ikuti Codelab resmi Google AI Studio & Cloud Run.*
