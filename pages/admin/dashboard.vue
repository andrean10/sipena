<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <ul class="mb-2 flex space-x-2 rtl:space-x-reverse">
                    <li><span class="text-primary">SIPENA</span></li>
                    <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"><span>Dashboard</span></li>
                </ul>
                <h1 class="text-2xl font-extrabold text-black dark:text-white-light">Dashboard Admin</h1>
                <p class="mt-1 text-white-dark">Ringkasan aktivitas pengambilan nomor surat dan master data SIPENA.</p>
            </div>
            <button type="button" class="btn btn-primary gap-2" :disabled="loading" @click="fetchDashboardData">
                <icon-refresh class="h-4.5 w-4.5" />
                Refresh Data
            </button>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div v-for="card in summaryCards" :key="card.label" class="panel">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white-dark">{{ card.label }}</p>
                        <h2 class="mt-2 text-3xl font-extrabold text-black dark:text-white-light">{{ card.value }}</h2>
                    </div>
                    <div class="grid h-12 w-12 place-content-center rounded-md" :class="card.boxClass">
                        <component :is="card.icon" class="h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 grid gap-6 xl:grid-cols-3">
            <div class="panel xl:col-span-2">
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-black dark:text-white-light">Riwayat Surat Terbaru</h2>
                    <NuxtLink to="/riwayat-surat" class="btn btn-outline-primary btn-sm">Kelola Riwayat</NuxtLink>
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Nomor</th>
                                <th>Pegawai</th>
                                <th>Hal</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in latestSurat" :key="item.id">
                                <td class="font-semibold text-primary">{{ item.nomor_lengkap }}</td>
                                <td>{{ item.pegawai?.nama || '-' }}</td>
                                <td class="max-w-xs truncate">{{ item.hal }}</td>
                                <td>{{ formatDate(item.tanggal_surat) }}</td>
                            </tr>
                            <tr v-if="!latestSurat.length">
                                <td colspan="4" class="text-center text-white-dark">Belum ada riwayat surat.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="panel">
                <h2 class="mb-5 text-lg font-semibold text-black dark:text-white-light">Status Sistem</h2>
                <div class="space-y-4">
                    <div class="rounded-md border border-white-light p-4 dark:border-[#1b2e4b]">
                        <div class="text-xs uppercase text-white-dark">Periode Aktif</div>
                        <div class="mt-1 font-bold">{{ activePeriode?.nama_periode || 'Belum ada periode aktif' }}</div>
                    </div>
                    <div class="rounded-md border border-white-light p-4 dark:border-[#1b2e4b]">
                        <div class="text-xs uppercase text-white-dark">Kode Surat Aktif</div>
                        <div class="mt-1 font-bold">{{ activeKodeCount }} kode tersedia</div>
                    </div>
                    <div class="rounded-md border border-white-light p-4 dark:border-[#1b2e4b]">
                        <div class="text-xs uppercase text-white-dark">Aksi Cepat</div>
                        <div class="mt-3 grid gap-2">
                            <NuxtLink to="/pegawai" class="btn btn-outline-primary btn-sm gap-2">
                                <icon-users class="h-4.5 w-4.5" />
                                Kelola Pegawai
                            </NuxtLink>
                            <NuxtLink to="/ambil-nomor-surat" class="btn btn-outline-info btn-sm gap-2">
                                <icon-file class="h-4.5 w-4.5" />
                                Halaman Ambil Nomor
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, resolveComponent } from 'vue';

    definePageMeta({ layout: 'dashboard-layout' });
    useHead({ title: 'Dashboard Admin' });

    const { loading, pegawai, kodeSurat, surat, totalSuratBulanIni, activePeriode, fetchDashboardData } = useSipenaAdmin();

    onMounted(fetchDashboardData);

    const latestSurat = computed(() => surat.value.slice(0, 6));
    const activeKodeCount = computed(() => kodeSurat.value.filter((item) => item.aktif).length);

    const summaryCards = computed(() => [
        { label: 'Total Surat', value: surat.value.length, icon: resolveComponent('icon-notes'), boxClass: 'bg-primary-light text-primary' },
        { label: 'Surat Bulan Ini', value: totalSuratBulanIni.value, icon: resolveComponent('icon-calendar'), boxClass: 'bg-success-light text-success' },
        { label: 'Total Pegawai', value: pegawai.value.length, icon: resolveComponent('icon-users'), boxClass: 'bg-info-light text-info' },
        { label: 'Kode Surat Aktif', value: activeKodeCount.value, icon: resolveComponent('icon-folder'), boxClass: 'bg-warning-light text-warning' },
    ]);

    const formatDate = (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };
</script>
