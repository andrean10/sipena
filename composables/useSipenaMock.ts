// import { computed, reactive, ref } from 'vue';

// export type Pegawai = {
//     id: number;
//     nama: string;
//     nip: string;
//     jabatan: string;
// };

// export type KlasifikasiSurat = {
//     id: number;
//     kode: string;
//     nama: string;
// };

// export type PengambilanNomor = {
//     id: number;
//     nipPengambil: string;
//     namaKonseptor: string;
//     hal: string;
//     klasifikasi: KlasifikasiSurat;
//     nomor: string;
//     tanggal: string;
// };

// const pegawai = ref<Pegawai[]>([
//     { id: 1, nama: 'Andrean Ramadhan', nip: '199812302025061007', jabatan: 'Pranata Komputer Ahli Pertama' },
//     { id: 2, nama: 'Yudhistira Syofyan', nip: '198306202009121004', jabatan: 'Arisparis Ahli Muda' },
//     { id: 3, nama: 'Rizky Pratama', nip: '199209132019011001', jabatan: 'Pengelola Layanan Operasional' },
// ]);

// const klasifikasi = ref<KlasifikasiSurat[]>([
//     {
//         id: 1,
//         kode: 'PR.01.01',
//         nama: 'Rencana Pembangunan Jangka Panjang',
//     },
//     {
//         id: 2,
//         kode: 'KP.03.02',
//         nama: 'Mutasi dan Kepangkatan Pegawai',
//     },
//     {
//         id: 3,
//         kode: 'HK.02.01',
//         nama: 'Pertimbangan Hukum',
//     },
//     {
//         id: 4,
//         kode: 'UM.01.03',
//         nama: 'Pengelolaan Surat Keluar',
//     },
// ]);

// const riwayat = ref<PengambilanNomor[]>([]);
// const sequence = reactive<Record<string, number>>({
//     'PR.01.01': 5,
//     'KP.03.02': 11,
//     'HK.02.01': 8,
//     'UM.01.03': 18,
// });

// export const useSipenaMock = () => {
//     const isLoading = ref(false);
//     const toast = ref<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

//     const validateNip = (nip: string) => /^\d{18}$/.test(nip);

//     const createNomor = async (payload: { nipPengambil: string; namaKonseptor: string; hal: string; klasifikasi: KlasifikasiSurat }) => {
//         isLoading.value = true;
//         await new Promise((resolve) => setTimeout(resolve, 800));

//         const current = sequence[payload.klasifikasi.kode] || 0;
//         const next = current + 1;
//         sequence[payload.klasifikasi.kode] = next;

//         const nomor = `${payload.klasifikasi.kode}.${next}`;
//         riwayat.value.unshift({
//             id: Date.now(),
//             ...payload,
//             nomor,
//             tanggal: new Date().toISOString(),
//         });

//         isLoading.value = false;
//         toast.value = { type: 'success', message: 'Nomor surat berhasil diterbitkan.' };
//         return nomor;
//     };

//     const clearToast = () => {
//         toast.value = null;
//     };

//     return {
//         pegawai: computed(() => pegawai.value),
//         klasifikasi: computed(() => klasifikasi.value),
//         riwayat: computed(() => riwayat.value),
//         isLoading,
//         toast,
//         validateNip,
//         createNomor,
//         clearToast,
//     };
// };
