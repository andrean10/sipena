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
    const createNomor = async (payload: CreateNomorPayload): Promise<string | null> => {
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

            showToast('success', 'Nomor surat berhasil dibuat.');
            return (data as { out_nomor_lengkap: string } | null)?.out_nomor_lengkap ?? null;
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
    };
};
