// composables/useSipena.ts
import { ref } from 'vue';

export interface Pegawai {
    id: number;
    nip: string;
    nama: string;
}

export interface KlasifikasiSurat {
    id: number;
    kode: string;
    nama: string;
    deskripsi?: string;
}

export interface RiwayatSurat {
    id: number;
    nomorLengkap: string;
    hal: string;
    tanggalSurat: string;
    tanggalPengambilan: string;
    kodeKlasifikasi: string;
    namaKlasifikasi: string;
}

interface CreateNomorPayload {
    pegawaiId: number;
    hal: string;
    klasifikasi: KlasifikasiSurat;
}

interface ToastState {
    type: 'success' | 'error' | 'info';
    message: string;
}

export const useSipena = () => {
    const supabase = useSupabase();

    const klasifikasi = ref<KlasifikasiSurat[]>([]);
    const isLoading = ref(false);
    const toast = ref<ToastState | null>(null);

    const showToast = (type: ToastState['type'], message: string) => {
        toast.value = { type, message };
        setTimeout(() => {
            if (toast.value?.message === message) toast.value = null;
        }, 4000);
    };

    const clearToast = () => {
        toast.value = null;
    };

    // Ambil daftar kode klasifikasi surat (buat search dropdown)
    const fetchKlasifikasi = async () => {
        const { data, error } = await supabase.from('kode_surat').select('id, kode, nama').eq('aktif', true).order('kode', { ascending: true });

        if (error) {
            showToast('error', 'Gagal memuat data klasifikasi surat.');
            return;
        }

        klasifikasi.value = data ?? [];
    };

    // Validasi format NIP di sisi client (18 digit angka)
    const validateNip = (nip: string) => /^\d{18}$/.test(nip);

    // Cari pegawai berdasarkan NIP, dipanggil begitu NIP genap 18 digit
    const findPegawaiByNip = async (nip: string): Promise<Pegawai | null> => {
        if (!validateNip(nip)) return null;

        const { data, error } = await supabase.from('pegawai').select('id, nip, nama').eq('nip', nip).maybeSingle();

        if (error) {
            showToast('error', 'Gagal memeriksa NIP pegawai.');
            return null;
        }

        return data;
    };

    // Verifikasi kata kunci internal lewat RPC (perbandingan hash dilakukan di server,
    // bukan di client, jadi hash-nya gak pernah keluar ke browser)
    const verifyKodeUnik = async (kode: string): Promise<boolean> => {
        const { data, error } = await supabase.rpc('verifikasi_kode_unik', {
            p_kode: kode,
        });

        if (error) {
            showToast('error', 'Gagal memverifikasi kata kunci.');
            return false;
        }

        return data === true;
    };

    // Generate nomor surat lewat RPC ambil_nomor_surat (atomik, aman race condition)

    const createNomor = async (payload: CreateNomorPayload): Promise<{ nomor: string; tanggalSurat: string } | null> => {
        isLoading.value = true;
        try {
            const { data, error } = await supabase
                .rpc('ambil_nomor_surat', {
                    p_kode_surat_id: payload.klasifikasi.id,
                    p_pegawai_id: payload.pegawaiId,
                    p_hal: payload.hal,
                })
                .single();

            if (error) {
                showToast('error', error.message || 'Gagal mengambil nomor surat.');
                return null;
            }

            const result = data as { out_nomor_lengkap: string; out_tanggal_surat: string } | null;
            showToast('success', 'Nomor surat berhasil dibuat.');
            return result ? { nomor: result.out_nomor_lengkap, tanggalSurat: result.out_tanggal_surat } : null;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchRiwayatSurat = async (
        pegawaiId: number,
        kodeUnik: string,
        page: number,
        pageSize = 10,
    ): Promise<{ data: RiwayatSurat[]; total: number } | null> => {
        isLoading.value = true;
        try {
            const { data, error } = await supabase.rpc('get_riwayat_surat', {
                p_pegawai_id: pegawaiId,
                p_kode_unik: kodeUnik,
                p_page: page,
                p_page_size: pageSize,
            });

            if (error) {
                showToast('error', error.message || 'Gagal memuat riwayat surat.');
                return null;
            }

            const rows = (data ?? []) as any[];
            return {
                data: rows.map((r) => ({
                    id: r.id,
                    nomorLengkap: r.nomor_lengkap,
                    hal: r.hal,
                    tanggalSurat: r.tanggal_surat,
                    tanggalPengambilan: r.tanggal_pengambilan,
                    kodeKlasifikasi: r.kode_klasifikasi,
                    namaKlasifikasi: r.nama_klasifikasi,
                })),
                total: rows.length > 0 ? Number(rows[0].total_count) : 0,
            };
        } finally {
            isLoading.value = false;
        }
    };

    return {
        klasifikasi,
        isLoading,
        toast,
        clearToast,
        fetchKlasifikasi,
        validateNip,
        findPegawaiByNip,
        verifyKodeUnik,
        createNomor,
        fetchRiwayatSurat,
    };
};
