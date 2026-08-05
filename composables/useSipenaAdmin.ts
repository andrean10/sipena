import { computed, ref } from 'vue';

export type AdminPegawai = {
    id: number;
    nip: string;
    nama: string;
    jabatan: string | null;
    created_at?: string;
    updated_at?: string;
};

export type AdminKodeSurat = {
    id: number;
    kode: string;
    nama: string;
    aktif: boolean;
    created_at?: string;
    updated_at?: string;
};

export type AdminPeriode = {
    id: number;
    nama_periode: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    aktif: boolean;
};

export type AdminSurat = {
    id: number;
    nomor_lengkap: string;
    kode_surat_id: number;
    periode_id: number;
    nomor_urut: number;
    pegawai_id: number;
    hal: string;
    tanggal_pengambilan: string;
    tanggal_surat: string;
    pegawai?: Pick<AdminPegawai, 'id' | 'nip' | 'nama' | 'jabatan'> | null;
    kode_surat?: Pick<AdminKodeSurat, 'id' | 'kode' | 'nama'> | null;
    periode?: Pick<AdminPeriode, 'id' | 'nama_periode'> | null;
};

type ToastState = {
    type: 'success' | 'error' | 'info';
    message: string;
};

export const useSipenaAdmin = () => {
    const supabase = useSupabase();
    const loading = ref(false);
    const toast = ref<ToastState | null>(null);
    const pegawai = ref<AdminPegawai[]>([]);
    const kodeSurat = ref<AdminKodeSurat[]>([]);
    const periode = ref<AdminPeriode[]>([]);
    const surat = ref<AdminSurat[]>([]);

    const showToast = (type: ToastState['type'], message: string) => {
        toast.value = { type, message };
        setTimeout(() => {
            if (toast.value?.message === message) toast.value = null;
        }, 3500);
    };

    const run = async <T>(callback: () => Promise<T>) => {
        loading.value = true;
        try {
            return await callback();
        } finally {
            loading.value = false;
        }
    };

    const fetchPegawai = async () => {
        await run(async () => {
            const { data, error } = await supabase.from('pegawai').select('*').order('nama', { ascending: true });
            if (error) return showToast('error', 'Gagal memuat data pegawai.');
            pegawai.value = data ?? [];
        });
    };

    const fetchKodeSurat = async () => {
        const { data, error } = await supabase.from('kode_surat').select('id, kode, nama, aktif').order('kode', { ascending: true });
        if (error) return showToast('error', 'Gagal memuat kode surat.');
        kodeSurat.value = data ?? [];
    };

    const fetchPeriode = async () => {
        const { data, error } = await supabase.from('periode').select('id, nama_periode, tanggal_mulai, tanggal_selesai, aktif').order('tanggal_mulai', { ascending: false });
        if (error) return showToast('error', 'Gagal memuat periode.');
        periode.value = data ?? [];
    };

    const fetchSurat = async () => {
        await run(async () => {
            const { data, error } = await supabase
                .from('surat')
                .select('*, pegawai(id,nip,nama,jabatan), kode_surat(id,kode,nama), periode(id,nama_periode)')
                .order('tanggal_pengambilan', { ascending: false });

            if (error) return showToast('error', 'Gagal memuat riwayat surat.');
            surat.value = (data ?? []) as AdminSurat[];
        });
    };

    const fetchDashboardData = async () => {
        await Promise.all([fetchSurat(), fetchPegawai(), fetchKodeSurat(), fetchPeriode()]);
    };

    const savePegawai = async (payload: Partial<AdminPegawai> & Pick<AdminPegawai, 'nip' | 'nama'>) => {
        await run(async () => {
            const body = { nip: payload.nip, nama: payload.nama, jabatan: payload.jabatan || null, updated_at: new Date().toISOString() };
            const query = payload.id ? supabase.from('pegawai').update(body).eq('id', payload.id) : supabase.from('pegawai').insert(body);
            const { error } = await query;
            if (error) return showToast('error', error.message || 'Gagal menyimpan pegawai.');
            showToast('success', 'Data pegawai berhasil disimpan.');
            await fetchPegawai();
        });
    };

    const deletePegawai = async (id: number) => {
        await run(async () => {
            const { error } = await supabase.from('pegawai').delete().eq('id', id);
            if (error) return showToast('error', error.message || 'Gagal menghapus pegawai.');
            showToast('success', 'Data pegawai berhasil dihapus.');
            await fetchPegawai();
        });
    };

    const saveKodeSurat = async (payload: Partial<AdminKodeSurat> & Pick<AdminKodeSurat, 'kode' | 'nama' | 'aktif'>) => {
        await run(async () => {
            const body = {
                kode: payload.kode.trim().toUpperCase(),
                nama: payload.nama.trim(),
                aktif: payload.aktif,
                updated_at: new Date().toISOString(),
            };
            const query = payload.id ? supabase.from('kode_surat').update(body).eq('id', payload.id) : supabase.from('kode_surat').insert(body);
            const { error } = await query;
            if (error) return showToast('error', error.message || 'Gagal menyimpan kode surat.');
            showToast('success', 'Kode surat berhasil disimpan.');
            await fetchKodeSurat();
        });
    };

    const deleteKodeSurat = async (id: number) => {
        await run(async () => {
            const { error } = await supabase.from('kode_surat').delete().eq('id', id);
            if (error) return showToast('error', error.message || 'Gagal menghapus kode surat.');
            showToast('success', 'Kode surat berhasil dihapus.');
            await fetchKodeSurat();
        });
    };

    const saveSurat = async (payload: Partial<AdminSurat> & Pick<AdminSurat, 'kode_surat_id' | 'periode_id' | 'nomor_urut' | 'pegawai_id' | 'hal' | 'tanggal_surat'>) => {
        await run(async () => {
            const kode = kodeSurat.value.find((item) => item.id === Number(payload.kode_surat_id));
            const nomorLengkap = payload.nomor_lengkap?.trim() || `${kode?.kode ?? ''}.${payload.nomor_urut}`;
            const body = {
                nomor_lengkap: nomorLengkap,
                kode_surat_id: Number(payload.kode_surat_id),
                periode_id: Number(payload.periode_id),
                nomor_urut: Number(payload.nomor_urut),
                pegawai_id: Number(payload.pegawai_id),
                hal: payload.hal,
                tanggal_surat: payload.tanggal_surat,
            };
            const query = payload.id ? supabase.from('surat').update(body).eq('id', payload.id) : supabase.from('surat').insert(body);
            const { error } = await query;
            if (error) return showToast('error', error.message || 'Gagal menyimpan surat.');
            showToast('success', 'Data surat berhasil disimpan.');
            await fetchSurat();
        });
    };

    const deleteSurat = async (id: number) => {
        await run(async () => {
            const { error } = await supabase.from('surat').delete().eq('id', id);
            if (error) return showToast('error', error.message || 'Gagal menghapus surat.');
            showToast('success', 'Data surat berhasil dihapus.');
            await fetchSurat();
        });
    };

    const totalSuratBulanIni = computed(() => {
        const now = new Date();
        return surat.value.filter((item) => {
            const tanggal = new Date(item.tanggal_pengambilan);
            return tanggal.getMonth() === now.getMonth() && tanggal.getFullYear() === now.getFullYear();
        }).length;
    });

    const activePeriode = computed(() => periode.value.find((item) => item.aktif));

    return {
        loading,
        toast,
        pegawai,
        kodeSurat,
        periode,
        surat,
        totalSuratBulanIni,
        activePeriode,
        fetchPegawai,
        fetchKodeSurat,
        fetchPeriode,
        fetchSurat,
        fetchDashboardData,
        savePegawai,
        deletePegawai,
        saveKodeSurat,
        deleteKodeSurat,
        saveSurat,
        deleteSurat,
    };
};
