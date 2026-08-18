<template>
    <div>
        <div v-if="toast" class="fixed right-5 top-5 z-[70] w-[calc(100%-40px)] max-w-sm rounded-md border bg-white p-4 shadow-lg dark:bg-[#0e1726]" :class="toastClass">
            <div class="font-semibold">{{ toast.type === 'success' ? 'Berhasil' : 'Informasi' }}</div>
            <div class="text-sm text-white-dark">{{ toast.message }}</div>
        </div>

        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <ul class="mb-2 flex space-x-2 rtl:space-x-reverse">
                    <li><NuxtLink to="/admin/dashboard" class="text-primary hover:underline">Dashboard</NuxtLink></li>
                    <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"><span>Riwayat Surat</span></li>
                </ul>
                <h1 class="text-2xl font-extrabold text-black dark:text-white-light">Riwayat Surat</h1>
                <p class="mt-1 text-white-dark">Pantau, tambah, ubah, dan hapus data nomor surat yang sudah diterbitkan.</p>
            </div>
            <button type="button" class="btn btn-primary gap-2" :disabled="!canOpenForm" @click="openForm()">
                <icon-plus class="h-4.5 w-4.5" />
                Tambah Riwayat
            </button>
        </div>

        <div class="mb-6 grid gap-6 sm:grid-cols-3">
            <div class="panel">
                <p class="text-white-dark">Total Surat</p>
                <h2 class="mt-2 text-3xl font-extrabold text-primary">{{ surat.length }}</h2>
            </div>
            <div class="panel">
                <p class="text-white-dark">Surat Bulan Ini</p>
                <h2 class="mt-2 text-3xl font-extrabold text-success">{{ totalSuratBulanIni }}</h2>
            </div>
            <div class="panel">
                <p class="text-white-dark">Periode Aktif</p>
                <h2 class="mt-2 truncate text-xl font-extrabold text-black dark:text-white-light">{{ activePeriode?.nama_periode || '-' }}</h2>
            </div>
        </div>

        <div class="panel">
            <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
                <input v-model="search" type="text" class="form-input max-w-sm" placeholder="Cari nomor, pegawai, kode, atau hal..." />
                <button type="button" class="btn btn-outline-primary gap-2 md:ml-auto" :disabled="loading" @click="fetchAll">
                    <icon-refresh class="h-4.5 w-4.5" />
                    Refresh
                </button>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Nomor Surat</th>
                            <th>Kode</th>
                            <th>Pegawai</th>
                            <th>Hal</th>
                            <th>Tanggal Surat</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredSurat" :key="item.id">
                            <td class="font-semibold text-primary">{{ item.nomor_lengkap }}</td>
                            <td>
                                <span class="badge badge-outline-info">{{ item.kode_surat?.kode || '-' }}</span>
                            </td>
                            <td>
                                <div class="font-semibold">{{ item.pegawai?.nama || '-' }}</div>
                                <div class="text-xs text-white-dark">{{ item.pegawai?.nip || '-' }}</div>
                            </td>
                            <td class="max-w-sm truncate">{{ item.hal }}</td>
                            <td>{{ formatDate(item.tanggal_surat) }}</td>
                            <td>
                                <div class="flex items-center justify-center gap-4">
                                    <button type="button" class="hover:text-primary" @click="openDetail(item)">
                                        <icon-eye class="h-4.5 w-4.5" />
                                    </button>
                                    <button type="button" class="hover:text-info" @click="openForm(item)">
                                        <icon-edit class="h-4.5 w-4.5" />
                                    </button>
                                    <button type="button" class="hover:text-danger" @click="confirmDelete(item)">
                                        <icon-trash-lines class="h-4.5 w-4.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredSurat.length">
                            <td colspan="6" class="text-center text-white-dark">Riwayat surat belum tersedia.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <transition name="sipena-modal">
            <div v-if="detailTarget" class="fixed inset-0 z-[60] grid place-content-center bg-black/60 px-4">
                <div class="panel w-full max-w-2xl">
                    <div class="mb-5 flex items-center justify-between">
                        <h2 class="text-xl font-extrabold">Rincian Surat</h2>
                        <button type="button" class="text-white-dark hover:text-danger" @click="detailTarget = null"><icon-x class="h-5 w-5" /></button>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div v-for="item in detailRows" :key="item.label" class="rounded-md border border-white-light p-4 dark:border-[#1b2e4b]">
                            <div class="text-xs uppercase text-white-dark">{{ item.label }}</div>
                            <div class="mt-1 font-semibold">{{ item.value }}</div>
                        </div>
                    </div>
                    <div class="mt-4 rounded-md border border-white-light p-4 dark:border-[#1b2e4b]">
                        <div class="text-xs uppercase text-white-dark">Hal</div>
                        <div class="mt-1 leading-6">{{ detailTarget.hal }}</div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="sipena-modal">
            <div v-if="showForm" class="fixed inset-0 z-[60] grid place-content-center overflow-y-auto bg-black/60 px-4 py-8">
                <form class="panel w-full max-w-2xl" @submit.prevent="submitForm">
                    <div class="mb-5 flex items-center justify-between">
                        <h2 class="text-xl font-extrabold">{{ form.id ? 'Edit Riwayat Surat' : 'Tambah Riwayat Surat' }}</h2>
                        <button type="button" class="text-white-dark hover:text-danger" @click="showForm = false"><icon-x class="h-5 w-5" /></button>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block font-semibold">Pegawai</label>
                            <select v-model.number="form.pegawai_id" class="form-select" required>
                                <option :value="0" disabled>Pilih pegawai</option>
                                <option v-for="item in pegawai" :key="item.id" :value="item.id">{{ item.nama }} - {{ item.nip }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="mb-1.5 block font-semibold">Kode Surat</label>
                            <select v-model.number="form.kode_surat_id" class="form-select" required>
                                <option :value="0" disabled>Pilih kode</option>
                                <option v-for="item in kodeSurat" :key="item.id" :value="item.id">{{ item.kode }} - {{ item.nama }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="mb-1.5 block font-semibold">Periode</label>
                            <select v-model.number="form.periode_id" class="form-select" required>
                                <option :value="0" disabled>Pilih periode</option>
                                <option v-for="item in periode" :key="item.id" :value="item.id">{{ item.nama_periode }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="mb-1.5 block font-semibold">Nomor Urut</label>
                            <input v-model.number="form.nomor_urut" type="number" min="1" class="form-input" required />
                        </div>
                        <div>
                            <label class="mb-1.5 block font-semibold">Nomor Lengkap</label>
                            <input v-model="form.nomor_lengkap" type="text" class="form-input" placeholder="Kosongkan untuk auto dari kode + urut" />
                        </div>
                        <div>
                            <label class="mb-1.5 block font-semibold">Tanggal Surat</label>
                            <input v-model="form.tanggal_surat" type="date" class="form-input" required />
                        </div>
                    </div>

                    <div class="mt-4">
                        <label class="mb-1.5 block font-semibold">Hal</label>
                        <textarea v-model="form.hal" class="form-textarea min-h-[100px]" placeholder="Hal surat" required></textarea>
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" class="btn btn-outline-dark" @click="showForm = false">Batal</button>
                        <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">Simpan</button>
                    </div>
                </form>
            </div>
        </transition>

        <transition name="sipena-modal">
            <div v-if="deleteTarget" class="fixed inset-0 z-[60] grid place-content-center bg-black/60 px-4">
                <div class="panel w-full max-w-md">
                    <h2 class="text-xl font-extrabold">Hapus riwayat surat?</h2>
                    <p class="mt-2 text-sm text-white-dark">Nomor {{ deleteTarget.nomor_lengkap }} akan dihapus dari riwayat.</p>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" class="btn btn-outline-dark" @click="deleteTarget = null">Tidak</button>
                        <button type="button" class="btn btn-danger" :disabled="loading" @click="removeSurat">Ya, Hapus</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, reactive, ref } from 'vue';
    import type { AdminSurat } from '@/composables/useSipenaAdmin';

    definePageMeta({ layout: 'dashboard-layout' });
    useHead({ title: 'Riwayat Surat' });

    const {
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
        saveSurat,
        deleteSurat,
    } = useSipenaAdmin();

    const search = ref('');
    const showForm = ref(false);
    const detailTarget = ref<AdminSurat | null>(null);
    const deleteTarget = ref<AdminSurat | null>(null);
    const form = reactive({
        id: 0,
        nomor_lengkap: '',
        kode_surat_id: 0,
        periode_id: 0,
        nomor_urut: 1,
        pegawai_id: 0,
        hal: '',
        tanggal_surat: '',
    });

    onMounted(() => {
        fetchAll();
    });

    const fetchAll = async () => {
        await Promise.all([fetchPegawai(), fetchKodeSurat(), fetchPeriode(), fetchSurat()]);
    };

    const canOpenForm = computed(() => pegawai.value.length > 0 && kodeSurat.value.length > 0 && periode.value.length > 0);
    const isFormValid = computed(() => form.pegawai_id && form.kode_surat_id && form.periode_id && form.nomor_urut > 0 && form.hal.trim() && form.tanggal_surat);

    const filteredSurat = computed(() => {
        const keyword = search.value.toLowerCase();
        return surat.value.filter((item) =>
            [
                item.nomor_lengkap,
                item.kode_surat?.kode || '',
                item.kode_surat?.nama || '',
                item.pegawai?.nama || '',
                item.pegawai?.nip || '',
                item.hal,
            ]
                .join(' ')
                .toLowerCase()
                .includes(keyword),
        );
    });

    const detailRows = computed(() => {
        if (!detailTarget.value) return [];
        return [
            { label: 'Nomor Lengkap', value: detailTarget.value.nomor_lengkap },
            { label: 'Nomor Urut', value: detailTarget.value.nomor_urut },
            { label: 'Kode Surat', value: `${detailTarget.value.kode_surat?.kode || '-'} - ${detailTarget.value.kode_surat?.nama || '-'}` },
            { label: 'Pegawai', value: `${detailTarget.value.pegawai?.nama || '-'} (${detailTarget.value.pegawai?.nip || '-'})` },
            { label: 'Periode', value: detailTarget.value.periode?.nama_periode || '-' },
            { label: 'Tanggal Surat', value: formatDate(detailTarget.value.tanggal_surat) },
            { label: 'Tanggal Pengambilan', value: formatDateTime(detailTarget.value.tanggal_pengambilan) },
        ];
    });

    const toastClass = computed(() => ({
        'border-success/30': toast.value?.type === 'success',
        'border-danger/30': toast.value?.type === 'error',
        'border-info/30': toast.value?.type === 'info',
    }));

    const resetForm = () => {
        form.id = 0;
        form.nomor_lengkap = '';
        form.kode_surat_id = kodeSurat.value.find((item) => item.aktif)?.id ?? 0;
        form.periode_id = activePeriode.value?.id ?? periode.value[0]?.id ?? 0;
        form.nomor_urut = 1;
        form.pegawai_id = pegawai.value[0]?.id ?? 0;
        form.hal = '';
        form.tanggal_surat = new Date().toISOString().slice(0, 10);
    };

    const openForm = (item?: AdminSurat) => {
        if (item) {
            form.id = item.id;
            form.nomor_lengkap = item.nomor_lengkap;
            form.kode_surat_id = item.kode_surat_id;
            form.periode_id = item.periode_id;
            form.nomor_urut = item.nomor_urut;
            form.pegawai_id = item.pegawai_id;
            form.hal = item.hal;
            form.tanggal_surat = item.tanggal_surat;
        } else {
            resetForm();
        }
        showForm.value = true;
    };

    const openDetail = (item: AdminSurat) => {
        detailTarget.value = item;
    };

    const submitForm = async () => {
        await saveSurat({ ...form, id: form.id || undefined });
        showForm.value = false;
    };

    const confirmDelete = (item: AdminSurat) => {
        deleteTarget.value = item;
    };

    const removeSurat = async () => {
        if (!deleteTarget.value) return;
        await deleteSurat(deleteTarget.value.id);
        deleteTarget.value = null;
    };

    const formatDate = (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatDateTime = (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };
</script>

<style scoped>
    .sipena-modal-enter-active,
    .sipena-modal-leave-active {
        transition: all 180ms ease;
    }
    .sipena-modal-enter-from,
    .sipena-modal-leave-to {
        opacity: 0;
        transform: scale(0.98);
    }
</style>
