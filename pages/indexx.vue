<template>
    <div class="min-h-screen bg-[#f7f8fb] text-black dark:bg-[#060818] dark:text-white-light">
        <!-- <header class="sticky top-0 z-30 border-b border-white-light/70 bg-white/90 backdrop-blur dark:border-[#1b2e4b] dark:bg-[#0e1726]/90">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <NuxtLink to="/" class="flex items-center gap-3">
                    <img src="/public/assets/images/logo.png" alt="Logo DJIM" class="h-10 rounded-md border-white-light object-cover" />
                </NuxtLink>
                <nav class="hidden items-center gap-8 font-semibold text-white-dark md:flex">
                    <a href="#fitur" class="hover:text-primary">Fitur</a>
                    <a href="#alur" class="hover:text-primary">Alur</a>
                    <a href="#faq" class="hover:text-primary">FAQ</a>
                </nav>
                <NuxtLink to="/auth/cover-login" class="btn btn-outline-primary btn-sm">Login Admin</NuxtLink>
            </div>
        </header> -->

        <main>
            <section class="relative overflow-hidden bg-white dark:bg-[#0e1726]">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-info to-secondary"></div>
                <div class="mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <div
                            class="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary dark:bg-primary-dark-light"
                        >
                            <icon-circle-check :fill="true" class="h-4 w-4" />
                            Sistem layanan nomor naskah internal
                        </div>
                        <h1 class="text-5xl font-extrabold leading-tight text-black dark:text-white-light md:text-6xl">
                            SIPENA
                            <span class="block text-2xl font-bold text-primary md:text-3xl">Sistem Pengambilan Nomor Naskah</span>
                        </h1>
                        <p class="mt-6 max-w-2xl text-lg leading-8 text-white-dark">
                            Platform modern untuk membantu pegawai mengambil nomor naskah secara cepat, tertib, dan terdokumentasi dengan klasifikasi arsip yang
                            konsisten.
                        </p>
                        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                            <NuxtLink to="/ambil-nomor-surat" class="btn btn-primary gap-2 px-6 py-3">
                                <icon-file class="h-5 w-5" />
                                Ambil Nomor Surat
                            </NuxtLink>
                            <a href="#alur" class="btn btn-outline-primary gap-2 px-6 py-3">
                                <icon-open-book class="h-5 w-5" />
                                Panduan
                            </a>
                        </div>
                    </div>

                    <div class="relative">
                        <div class="panel overflow-hidden p-0 shadow-3xl">
                            <div class="border-b border-white-light bg-gradient-to-r from-primary to-info p-6 text-white">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-sm opacity-80">Nomor Naskah Terakhir</div>
                                        <div class="mt-1 text-3xl font-extrabold">PR.01.01.6</div>
                                    </div>
                                    <div class="grid h-16 w-16 place-content-center rounded-xl bg-white/20">
                                        <icon-notes class="h-9 w-9" />
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-4 p-6">
                                <div
                                    v-for="item in previewRows"
                                    :key="item.label"
                                    class="flex items-center justify-between rounded-md bg-white-light/40 p-4 dark:bg-[#1b2e4b]"
                                >
                                    <div class="flex items-center gap-3">
                                        <span class="grid h-10 w-10 place-content-center rounded-md bg-primary-light text-primary">
                                            <component :is="item.icon" class="h-5 w-5" />
                                        </span>
                                        <div>
                                            <div class="font-semibold">{{ item.label }}</div>
                                            <div class="text-xs text-white-dark">{{ item.caption }}</div>
                                        </div>
                                    </div>
                                    <span class="badge badge-outline-success">{{ item.status }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="fitur" class="px-6 py-16">
                <div class="mx-auto max-w-7xl">
                    <div class="mb-10 max-w-2xl">
                        <h2 class="text-3xl font-extrabold">Fitur Utama</h2>
                        <p class="mt-2 text-white-dark">Dirancang untuk proses administrasi naskah yang cepat, rapi, dan mudah digunakan.</p>
                    </div>
                    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                        <div v-for="feature in features" :key="feature.title" class="panel transition hover:-translate-y-1 hover:shadow-lg">
                            <div class="mb-5 grid h-11 w-11 place-content-center rounded-md bg-primary-light text-primary">
                                <component :is="feature.icon" class="h-5 w-5" />
                            </div>
                            <h3 class="text-base font-bold dark:text-white-light">{{ feature.title }}</h3>
                            <p class="mt-2 text-sm leading-6 text-white-dark">{{ feature.text }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="alur" class="bg-white px-6 py-16 dark:bg-[#0e1726]">
                <div class="mx-auto max-w-7xl">
                    <div class="mb-10 text-center">
                        <h2 class="text-3xl font-extrabold">Cara Kerja</h2>
                        <p class="mt-2 text-white-dark">Empat langkah sederhana sampai nomor naskah terbit.</p>
                    </div>
                    <div class="grid gap-6 md:grid-cols-4">
                        <div v-for="(step, index) in steps" :key="step.title" class="relative panel text-center">
                            <div class="mx-auto mb-5 grid h-14 w-14 place-content-center rounded-full bg-primary text-xl font-extrabold text-white">
                                {{ index + 1 }}
                            </div>
                            <h3 class="font-bold">{{ step.title }}</h3>
                            <p class="mt-2 text-sm text-white-dark">{{ step.text }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" class="px-6 py-16">
                <div class="mx-auto max-w-4xl">
                    <div class="mb-8 text-center">
                        <h2 class="text-3xl font-extrabold">FAQ</h2>
                        <p class="mt-2 text-white-dark">Pertanyaan yang sering muncul terkait penggunaan SIPENA.</p>
                    </div>
                    <div class="space-y-3">
                        <div v-for="(item, index) in faqs" :key="item.question" class="panel p-0">
                            <button
                                type="button"
                                class="flex w-full items-center justify-between p-5 text-left font-semibold"
                                @click="activeFaq = activeFaq === index ? null : index"
                            >
                                {{ item.question }}
                                <icon-caret-down class="transition" :class="{ 'rotate-180': activeFaq === index }" />
                            </button>
                            <transition name="sipena-fade">
                                <p
                                    v-if="activeFaq === index"
                                    class="border-t border-white-light px-5 py-4 text-sm leading-6 text-white-dark dark:border-[#1b2e4b]"
                                >
                                    {{ item.answer }}
                                </p>
                            </transition>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="border-t border-white-light bg-white px-6 py-6 text-center text-sm text-white-dark dark:border-[#1b2e4b] dark:bg-[#0e1726]">
            © {{ new Date().getFullYear() }} Kantor Wilayah Direktorat Jenderal Imigrasi Riau.
        </footer>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    useHead({ title: 'SIPENA' });

    definePageMeta({
        layout: 'employee-layout',
    });

    const activeFaq = ref<number | null>(0);

    const previewRows = [
        { label: 'Klasifikasi Arsip', caption: 'PR.01.01', status: 'Valid', icon: resolveComponent('icon-folder') },
        { label: 'Data Pegawai', caption: 'NIP terverifikasi', status: 'Siap', icon: resolveComponent('icon-user') },
        { label: 'Riwayat Nomor', caption: 'Tersimpan lokal', status: 'Aktif', icon: resolveComponent('icon-notes') },
    ];

    const features = [
        { title: 'Pengambilan Nomor Otomatis', text: 'Nomor dibuat berdasarkan klasifikasi dan urutan terakhir.', icon: resolveComponent('icon-bolt') },
        { title: 'Validasi Pegawai', text: 'NIP memiliki status validasi visual sebelum proses lanjut.', icon: resolveComponent('icon-user-plus') },
        { title: 'Klasifikasi Arsip', text: 'Pencarian kode arsip lebih cepat dengan combobox.', icon: resolveComponent('icon-folder') },
        { title: 'Riwayat Pengambilan', text: 'Aktivitas mock tersimpan untuk kebutuhan UI.', icon: resolveComponent('icon-clock') },
        { title: 'Cepat & Aman', text: 'Interaksi ringan dengan verifikasi internal.', icon: resolveComponent('icon-lock-dots') },
    ];

    const steps = [
        { title: 'Isi Data', text: 'Masukkan NIP, konseptor, dan hal surat.' },
        { title: 'Pilih Klasifikasi', text: 'Cari kode berdasarkan kode, nama, atau deskripsi.' },
        { title: 'Verifikasi', text: 'Masukkan kata kunci internal.' },
        { title: 'Nomor Surat Terbit', text: 'Nomor dapat disalin atau dibuat ulang.' },
    ];

    const faqs = [
        {
            question: 'Apakah pegawai harus login?',
            answer: 'Tidak. Halaman pengambilan nomor dibuat publik untuk pegawai, sedangkan dashboard admin tetap dipisahkan.',
        },
        { question: 'Apakah ini sudah terhubung database?', answer: 'Belum. Implementasi ini khusus UI dan memakai mock data sesuai scope pekerjaan.' },
        { question: 'Bagaimana nomor surat dibuat?', answer: 'Nomor dibuat dari kode klasifikasi dan urutan mock agar flow UI dapat diuji end-to-end.' },
    ];
</script>

<style scoped>
    .sipena-fade-enter-active,
    .sipena-fade-leave-active {
        transition: all 180ms ease;
    }
    .sipena-fade-enter-from,
    .sipena-fade-leave-to {
        opacity: 0;
        transform: translateY(-4px);
    }
</style>
