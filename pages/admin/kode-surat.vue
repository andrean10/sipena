<template>
    <div>
        <div v-if="toast" class="fixed right-5 top-5 z-[70] w-[calc(100%-40px)] max-w-sm rounded-md border bg-white p-4 shadow-lg dark:bg-[#0e1726]" :class="toastClass">
            <div class="font-semibold">{{ toast.type === 'success' ? 'Berhasil' : 'Informasi' }}</div>
            <div class="text-sm text-white-dark">{{ toast.message }}</div>
        </div>

        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <ul class="mb-2 flex space-x-2 rtl:space-x-reverse">
                    <li><NuxtLink to="/dashboard" class="text-primary hover:underline">Dashboard</NuxtLink></li>
                    <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"><span>Kode Surat</span></li>
                </ul>
                <h1 class="text-2xl font-extrabold text-black dark:text-white-light">Kode Surat</h1>
                <p class="mt-1 text-white-dark">Kelola kode klasifikasi surat yang muncul di layanan pengambilan nomor.</p>
            </div>
            <button type="button" class="btn btn-primary gap-2" @click="openForm()">
                <icon-plus class="h-4.5 w-4.5" />
                Tambah Kode
            </button>
        </div>

        <div class="mb-6 grid gap-6 sm:grid-cols-3">
            <div class="panel">
                <p class="text-white-dark">Total Kode</p>
                <h2 class="mt-2 text-3xl font-extrabold text-primary">{{ kodeSurat.length }}</h2>
            </div>
            <div class="panel">
                <p class="text-white-dark">Kode Aktif</p>
                <h2 class="mt-2 text-3xl font-extrabold text-success">{{ activeCount }}</h2>
            </div>
            <div class="panel">
                <p class="text-white-dark">Kode Nonaktif</p>
                <h2 class="mt-2 text-3xl font-extrabold text-danger">{{ inactiveCount }}</h2>
            </div>
        </div>

        <div class="panel">
            <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
                <input v-model="search" type="text" class="form-input max-w-sm" placeholder="Cari kode atau nama klasifikasi..." />
                <select v-model="statusFilter" class="form-select max-w-[180px]">
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
                <button type="button" class="btn btn-outline-primary gap-2 md:ml-auto" :disabled="loading" @click="fetchKodeSurat">
                    <icon-refresh class="h-4.5 w-4.5" />
                    Refresh
                </button>
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Kode</th>
                            <th>Nama Klasifikasi</th>
                            <th>Status</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredKodeSurat" :key="item.id">
                            <td class="font-extrabold text-primary">{{ item.kode }}</td>
                            <td>{{ item.nama }}</td>
                            <td>
                                <span class="badge" :class="item.aktif ? 'badge-outline-success' : 'badge-outline-danger'">
                                    {{ item.aktif ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </td>
                            <td>
                                <div class="flex items-center justify-center gap-4">
                                    <button type="button" class="hover:text-info" @click="openForm(item)">
                                        <icon-edit class="h-4.5 w-4.5" />
                                    </button>
                                    <button type="button" class="hover:text-warning" @click="toggleStatus(item)">
                                        <icon-refresh class="h-4.5 w-4.5" />
                                    </button>
                                    <button type="button" class="hover:text-danger" @click="confirmDelete(item)">
                                        <icon-trash-lines class="h-4.5 w-4.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredKodeSurat.length">
                            <td colspan="4" class="text-center text-white-dark">Data kode surat belum tersedia.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <transition name="sipena-modal">
            <div v-if="showForm" class="fixed inset-0 z-[60] grid place-content-center bg-black/60 px-4">
                <form class="panel w-full max-w-lg" @submit.prevent="submitForm">
                    <div class="mb-5 flex items-center justify-between">
                        <h2 class="text-xl font-extrabold">{{ form.id ? 'Edit Kode Surat' : 'Tambah Kode Surat' }}</h2>
                        <button type="button" class="text-white-dark hover:text-danger" @click="showForm = false"><icon-x class="h-5 w-5" /></button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="mb-1.5 block font-semibold">Kode</label>
                            <input v-model="form.kode" type="text" class="form-input uppercase" placeholder="Contoh: PR.01.01" required />
                            <p class="mt-1.5 text-xs text-white-dark">Kode akan disimpan dengan huruf besar.</p>
                        </div>
                        <div>
                            <label class="mb-1.5 block font-semibold">Nama Klasifikasi</label>
                            <input v-model="form.nama" type="text" class="form-input" placeholder="Nama klasifikasi surat" required />
                        </div>
                        <label class="flex cursor-pointer items-center gap-3 rounded-md border border-white-light p-4 dark:border-[#1b2e4b]">
                            <input v-model="form.aktif" type="checkbox" class="form-checkbox" />
                            <span>
                                <span class="block font-semibold">Aktif</span>
                                <span class="block text-xs text-white-dark">Kode aktif akan tampil di dropdown pengambilan nomor surat.</span>
                            </span>
                        </label>
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
                    <h2 class="text-xl font-extrabold">Hapus kode surat?</h2>
                    <p class="mt-2 text-sm text-white-dark">Kode {{ deleteTarget.kode }} akan dihapus dari master klasifikasi.</p>
                    <p class="mt-2 text-xs text-danger">Jika kode sudah dipakai pada riwayat surat, Supabase akan menolak penghapusan karena relasi data.</p>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" class="btn btn-outline-dark" @click="deleteTarget = null">Tidak</button>
                        <button type="button" class="btn btn-danger" :disabled="loading" @click="removeKodeSurat">Ya, Hapus</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, reactive, ref } from 'vue';
    import type { AdminKodeSurat } from '@/composables/useSipenaAdmin';

    definePageMeta({ layout: 'dashboard-layout' });
    useHead({ title: 'Kode Surat' });

    const { loading, toast, kodeSurat, fetchKodeSurat, saveKodeSurat, deleteKodeSurat } = useSipenaAdmin();
    const search = ref('');
    const statusFilter = ref<'all' | 'active' | 'inactive'>('all');
    const showForm = ref(false);
    const deleteTarget = ref<AdminKodeSurat | null>(null);
    const form = reactive({ id: 0, kode: '', nama: '', aktif: true });

    onMounted(fetchKodeSurat);

    const activeCount = computed(() => kodeSurat.value.filter((item) => item.aktif).length);
    const inactiveCount = computed(() => kodeSurat.value.length - activeCount.value);
    const isFormValid = computed(() => form.kode.trim() && form.nama.trim());

    const filteredKodeSurat = computed(() => {
        const keyword = search.value.toLowerCase();
        return kodeSurat.value.filter((item) => {
            const matchKeyword = [item.kode, item.nama].join(' ').toLowerCase().includes(keyword);
            const matchStatus =
                statusFilter.value === 'all' || (statusFilter.value === 'active' && item.aktif) || (statusFilter.value === 'inactive' && !item.aktif);
            return matchKeyword && matchStatus;
        });
    });

    const toastClass = computed(() => ({
        'border-success/30': toast.value?.type === 'success',
        'border-danger/30': toast.value?.type === 'error',
        'border-info/30': toast.value?.type === 'info',
    }));

    const openForm = (item?: AdminKodeSurat) => {
        form.id = item?.id ?? 0;
        form.kode = item?.kode ?? '';
        form.nama = item?.nama ?? '';
        form.aktif = item?.aktif ?? true;
        showForm.value = true;
    };

    const submitForm = async () => {
        await saveKodeSurat({ ...form, id: form.id || undefined });
        showForm.value = false;
    };

    const toggleStatus = async (item: AdminKodeSurat) => {
        await saveKodeSurat({ ...item, aktif: !item.aktif });
    };

    const confirmDelete = (item: AdminKodeSurat) => {
        deleteTarget.value = item;
    };

    const removeKodeSurat = async () => {
        if (!deleteTarget.value) return;
        await deleteKodeSurat(deleteTarget.value.id);
        deleteTarget.value = null;
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
