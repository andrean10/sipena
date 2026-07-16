import { computed, reactive, ref } from 'vue';

export type Pegawai = {
    id: number;
    nama: string;
    nip: string;
    jabatan: string;
    unit: string;
};

export type KlasifikasiSurat = {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string;
};

export type PengambilanNomor = {
    id: number;
    nipPengambil: string;
    namaKonseptor: string;
    hal: string;
    klasifikasi: KlasifikasiSurat;
    nomor: string;
    tanggal: string;
};

const pegawai = ref<Pegawai[]>([
    { id: 1, nama: 'Andi Pratama', nip: '198904122010121001', jabatan: 'Analis Keimigrasian', unit: 'Divisi Keimigrasian' },
    { id: 2, nama: 'Rina Kartika', nip: '199102082014032002', jabatan: 'Pranata Komputer', unit: 'Bagian Program dan Humas' },
    { id: 3, nama: 'Budi Santoso', nip: '198711202009011004', jabatan: 'Pengelola Arsip', unit: 'Bagian Tata Usaha' },
    { id: 4, nama: 'Maya Lestari', nip: '199405162018012001', jabatan: 'Perancang Peraturan', unit: 'Divisi Administrasi' },
]);

const klasifikasi = ref<KlasifikasiSurat[]>([
    {
        id: 1,
        kode: 'PR.01.01',
        nama: 'Rencana Pembangunan Jangka Panjang',
        deskripsi: 'Digunakan untuk naskah terkait rencana strategis, perencanaan jangka panjang, dan dokumen arah kebijakan.',
    },
    {
        id: 2,
        kode: 'KP.03.02',
        nama: 'Mutasi dan Kepangkatan Pegawai',
        deskripsi: 'Digunakan untuk usulan, telaah, atau pemberitahuan mengenai status kepegawaian dan pengembangan karier.',
    },
    {
        id: 3,
        kode: 'HK.02.01',
        nama: 'Pertimbangan Hukum',
        deskripsi: 'Digunakan untuk naskah yang memuat analisis, pendapat, atau koordinasi hukum kedinasan.',
    },
    {
        id: 4,
        kode: 'UM.01.03',
        nama: 'Pengelolaan Surat Keluar',
        deskripsi: 'Digunakan untuk administrasi tata naskah, registrasi nomor, distribusi, dan pengendalian surat keluar.',
    },
]);

const riwayat = ref<PengambilanNomor[]>([]);
const sequence = reactive<Record<string, number>>({
    'PR.01.01': 5,
    'KP.03.02': 11,
    'HK.02.01': 8,
    'UM.01.03': 18,
});

export const useSipenaMock = () => {
    const isLoading = ref(false);
    const toast = ref<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    const validateNip = (nip: string) => /^\d{18}$/.test(nip);

    const createNomor = async (payload: {
        nipPengambil: string;
        namaKonseptor: string;
        hal: string;
        klasifikasi: KlasifikasiSurat;
    }) => {
        isLoading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 800));

        const current = sequence[payload.klasifikasi.kode] || 0;
        const next = current + 1;
        sequence[payload.klasifikasi.kode] = next;

        const nomor = `${payload.klasifikasi.kode}.${next}`;
        riwayat.value.unshift({
            id: Date.now(),
            ...payload,
            nomor,
            tanggal: new Date().toISOString(),
        });

        isLoading.value = false;
        toast.value = { type: 'success', message: 'Nomor surat berhasil diterbitkan.' };
        return nomor;
    };

    const clearToast = () => {
        toast.value = null;
    };

    return {
        pegawai: computed(() => pegawai.value),
        klasifikasi: computed(() => klasifikasi.value),
        riwayat: computed(() => riwayat.value),
        isLoading,
        toast,
        validateNip,
        createNomor,
        clearToast,
    };
};
