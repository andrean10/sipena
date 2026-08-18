<template>
    <div>
        <div
            v-if="toast"
            class="fixed right-5 top-5 z-[70] w-[calc(100%-40px)] max-w-sm rounded-md border bg-white p-4 shadow-lg dark:bg-[#0e1726]"
            :class="toastClass"
        >
            <div class="font-semibold">{{ toast.type === 'success' ? 'Berhasil' : 'Informasi' }}</div>
            <div class="text-sm text-white-dark">{{ toast.message }}</div>
        </div>

        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <ul class="mb-2 flex space-x-2 rtl:space-x-reverse">
                    <li><NuxtLink to="/admin/dashboard" class="text-primary hover:underline">Dashboard</NuxtLink></li>
                    <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"><span>Pegawai</span></li>
                </ul>
                <h1 class="text-2xl font-extrabold text-black dark:text-white-light">Pegawai</h1>
                <p class="mt-1 text-white-dark">Kelola NIP, nama, dan jabatan pegawai yang bisa mengambil nomor surat.</p>
            </div>
            <button type="button" class="btn btn-primary gap-2" @click="openForm()">
                <icon-plus class="h-4.5 w-4.5" />
                Tambah Pegawai
            </button>
        </div>

        <div class="panel">
            <div class="mb-5">
                <input v-model="search" type="text" class="form-input max-w-sm" placeholder="Cari NIP, nama, atau jabatan..." />
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>NIP</th>
                            <th>Nama</th>
                            <th>Jabatan</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredPegawai" :key="item.id">
                            <td class="font-semibold">{{ item.nip }}</td>
                            <td>{{ item.nama }}</td>
                            <td>{{ item.jabatan || '-' }}</td>
                            <td>
                                <div class="flex items-center justify-center gap-4">
                                    <button type="button" class="hover:text-info" @click="openForm(item)">
                                        <icon-edit class="h-4.5 w-4.5" />
                                    </button>
                                    <button type="button" class="hover:text-danger" @click="confirmDelete(item)">
                                        <icon-trash-lines class="h-4.5 w-4.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredPegawai.length">
                            <td colspan="4" class="text-center text-white-dark">Data pegawai belum tersedia.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <transition name="sipena-modal">
            <div v-if="showForm" class="fixed inset-0 z-[60] grid place-content-center bg-black/60 px-4">
                <form class="panel w-full max-w-lg" @submit.prevent="submitForm">
                    <div class="mb-5 flex items-center justify-between">
                        <h2 class="text-xl font-extrabold">{{ form.id ? 'Edit Pegawai' : 'Tambah Pegawai' }}</h2>
                        <button type="button" class="text-white-dark hover:text-danger" @click="showForm = false"><icon-x class="h-5 w-5" /></button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="mb-1.5 block font-semibold">NIP</label>
                            <input v-model="form.nip" type="text" maxlength="18" class="form-input" placeholder="18 digit NIP" required />
                        </div>
                        <div>
                            <label class="mb-1.5 block font-semibold">Nama</label>
                            <input v-model="form.nama" type="text" class="form-input" placeholder="Nama pegawai" required />
                        </div>
                        <div>
                            <label class="mb-1.5 block font-semibold">Jabatan</label>
                            <input v-model="form.jabatan" type="text" class="form-input" placeholder="Jabatan pegawai" />
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" class="btn btn-outline-dark" @click="showForm = false">Batal</button>
                        <button type="submit" class="btn btn-primary" :disabled="loading">Simpan</button>
                    </div>
                </form>
            </div>
        </transition>

        <transition name="sipena-modal">
            <div v-if="deleteTarget" class="fixed inset-0 z-[60] grid place-content-center bg-black/60 px-4">
                <div class="panel w-full max-w-md">
                    <h2 class="text-xl font-extrabold">Hapus pegawai?</h2>
                    <p class="mt-2 text-sm text-white-dark">Data {{ deleteTarget.nama }} akan dihapus dari master pegawai.</p>
                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" class="btn btn-outline-dark" @click="deleteTarget = null">Tidak</button>
                        <button type="button" class="btn btn-danger" :disabled="loading" @click="removePegawai">Ya, Hapus</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, reactive, ref } from 'vue';
    import type { AdminPegawai } from '@/composables/useSipenaAdmin';

    definePageMeta({ layout: 'dashboard-layout' });
    useHead({ title: 'Pegawai' });

    const { loading, toast, pegawai, fetchPegawai, savePegawai, deletePegawai } = useSipenaAdmin();
    const search = ref('');
    const showForm = ref(false);
    const deleteTarget = ref<AdminPegawai | null>(null);
    const form = reactive({ id: 0, nip: '', nama: '', jabatan: '' });

    onMounted(fetchPegawai);

    const filteredPegawai = computed(() => {
        const keyword = search.value.toLowerCase();
        return pegawai.value.filter((item) => [item.nip, item.nama, item.jabatan || ''].join(' ').toLowerCase().includes(keyword));
    });

    const toastClass = computed(() => ({
        'border-success/30': toast.value?.type === 'success',
        'border-danger/30': toast.value?.type === 'error',
        'border-info/30': toast.value?.type === 'info',
    }));

    const openForm = (item?: AdminPegawai) => {
        form.id = item?.id ?? 0;
        form.nip = item?.nip ?? '';
        form.nama = item?.nama ?? '';
        form.jabatan = item?.jabatan ?? '';
        showForm.value = true;
    };

    const submitForm = async () => {
        await savePegawai({ ...form, id: form.id || undefined });
        showForm.value = false;
    };

    const confirmDelete = (item: AdminPegawai) => {
        deleteTarget.value = item;
    };

    const removePegawai = async () => {
        if (!deleteTarget.value) return;
        await deletePegawai(deleteTarget.value.id);
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
