<template>
    <div class="min-h-screen bg-[#f7f8fb] text-black dark:bg-[#060818] dark:text-white-light">
        <header class="sticky top-0 z-30 border-b border-white-light/70 bg-white/90 backdrop-blur dark:border-[#1b2e4b] dark:bg-[#0e1726]/90">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <NuxtLink to="/" class="flex items-center gap-3">
                    <img src="/assets/images/logo_instansi.png" alt="" class="h-14 object-contain" />
                    <div class="h-14 w-1 bg-white-light/100 dark:bg-[#1b2e4b]"></div>
                    <img src="/assets/images/logo.png" alt="Logo SIPENA" class="h-14 object-contain" />
                </NuxtLink>
                <nav class="hidden items-center gap-8 font-semibold text-white-dark md:flex">
                    <a href="#fitur" class="hover:text-primary">Fitur</a>
                    <a href="#alur" class="hover:text-primary">Alur</a>
                    <a href="#faq" class="hover:text-primary">FAQ</a>
                </nav>
            </div>
        </header>

        <main>
            <section class="relative overflow-hidden bg-white dark:bg-[#0e1726]">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-info to-secondary"></div>
                <div class="mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <div
                            class="mb-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary-light px-4 pb-2 text-sm font-semibold text-primary dark:bg-primary-dark-light"
                        >
                            <icon-circle-check :fill="true" class="h-4 w-4" />
                            Sistem Layanan Pengambilan Nomor Naskah Internal
                        </div>
                        <img src="/assets/images/logo.png" alt="Logo SIPENA" class="h-28 w-auto md:h-36" />
                        <p class="mt-6 max-w-2xl text-lg leading-8 text-white-dark">
                            Platform modern untuk membantu pegawai mengambil nomor naskah secara cepat, tertib, dan terdokumentasi dengan klasifikasi arsip yang
                            konsisten.
                        </p>
                        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                            <NuxtLink to="/ambil-nomor-surat" class="btn btn-primary gap-2 px-6 py-3">
                                <icon-file class="h-5 w-5" />
                                Ambil Nomor Surat
                            </NuxtLink>
                            <button @click="modalRiwayat = true" class="btn btn-outline-primary gap-2 px-6 py-3">
                                <icon-search class="h-5 w-5" />
                                Cek Nomor Surat
                            </button>
                            <a href="#alur" class="btn btn-outline-primary gap-2 px-6 py-3">
                                <icon-open-book class="h-5 w-5" />
                                Panduan
                            </a>
                        </div>
                    </div>

                    <div class="relative">
                        <img class="p-24" src="/assets/images/gamir.png" alt="gamir" />
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

        <!-- Modal -->
        <!-- <client-only>
            <TransitionRoot appear :show="modalRiwayat" as="template">
                <Dialog as="div" @close="modalRiwayat = false" class="relative z-[51]">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay class="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>

                    <div class="fixed inset-0 overflow-y-auto">
                        <div class="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as="template"
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <DialogPanel class="panel w-full max-w-sm overflow-hidden rounded-lg border-0 px-4 py-1 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        class="absolute top-7 text-white-dark outline-none hover:text-dark ltr:right-9 rtl:left-9"
                                        @click="modalRiwayat = false"
                                    >
                                        <icon-x />
                                    </button>
                                    <div class="py-5 text-lg font-semibold ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">Lacak Riwayat Anda</div>
                                    <div class="ps-5 pb-5 pe-5">
                                        <form class="space-y-6" @submit.prevent="openVerification">
                                            <div>
                                                <label class="mb-1.5 block font-semibold text-black dark:text-white-light">NIP Pengambil</label>
                                                <div class="relative">
                                                    <input
                                                        ref="nipInput"
                                                        v-model="form.nipPengambil"
                                                        type="text"
                                                        inputmode="numeric"
                                                        maxlength="18"
                                                        class="form-input ps-10"
                                                        :class="nipStateClass"
                                                        placeholder="Masukkan 18 digit NIP"
                                                        @input="touchNip = true"
                                                    />
                                                    <span class="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark">
                                                        <icon-user class="h-4.5 w-4.5" />
                                                    </span>
                                                </div>
                                                <p v-if="!touchNip" class="mt-1.5 text-xs text-white-dark">NIP digunakan untuk memvalidasi pengambil nomor</p>
                                                <p v-else-if="isNipValid" class="mt-1.5 text-xs font-semibold text-success">NIP valid dan siap diverifikasi.</p>
                                                <p v-else class="mt-1.5 text-xs font-semibold text-danger">NIP harus 18 digit angka</p>
                                            </div>

                                            <div>
                                                <label class="mb-1.5 block font-semibold text-black dark:text-white-light">Nama Konseptor</label>
                                                <div class="relative">
                                                    <input
                                                        type="text"
                                                        class="form-input ps-10 disabled:cursor-not-allowed disabled:bg-white-light/60 disabled:text-white-dark dark:disabled:bg-[#1b2e4b]/60"
                                                        :value="konseptorName"
                                                        disabled
                                                        placeholder="Nama konseptor akan tampil otomatis setelah NIP valid"
                                                    />
                                                    <span class="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark">
                                                        <icon-user class="h-4.5 w-4.5" />
                                                    </span>
                                                </div>
                                                <p v-if="touchNip && isNipValid && !konseptorName" class="mt-1.5 text-xs font-semibold text-danger">
                                                    NIP tidak ditemukan dalam data pegawai.
                                                </p>
                                                <p v-else class="mt-1.5 text-xs text-white-dark">
                                                    Nama konseptor terisi otomatis berdasarkan NIP pengambil yang valid.
                                                </p>
                                            </div>

                                            <div
                                                v-if="showVerification"
                                                class="fixed inset-0 z-50 grid place-content-center bg-black/60 px-4"
                                                @keydown.esc="showVerification = false"
                                            >
                                                <div class="panel w-full max-w-md" role="dialog" aria-modal="true">
                                                    <div class="mb-5">
                                                        <h2 class="text-xl font-extrabold">Verifikasi Pengambilan Nomor Surat</h2>
                                                        <p class="mt-1 text-sm text-white-dark">Masukkan Kata Kunci Internal</p>
                                                    </div>
                                                    <label class="mb-1.5 block font-semibold">Kata Kunci</label>
                                                    <div class="relative">
                                                        <input
                                                            ref="passwordInput"
                                                            v-model="internalKeyword"
                                                            :type="showPassword ? 'text' : 'password'"
                                                            class="form-input pe-11"
                                                            placeholder="Masukkan kata kunci"
                                                            @keydown.enter.prevent="verifyAndGenerate"
                                                        />
                                                        <button
                                                            type="button"
                                                            class="absolute end-4 top-1/2 -translate-y-1/2 text-white-dark hover:text-primary"
                                                            @click="showPassword = !showPassword"
                                                        >
                                                            <icon-eye class="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <p v-if="verifyError" class="mt-2 text-xs font-semibold text-danger">{{ verifyError }}</p>
                                                    <div class="mt-6 flex justify-end gap-3">
                                                        <button type="button" class="btn btn-outline-dark" @click="showVerification = false">Batal</button>
                                                        <button type="button" class="btn btn-primary gap-2" :disabled="isLoading" @click="verifyAndGenerate">
                                                            <span
                                                                v-if="isLoading"
                                                                class="h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent"
                                                            ></span>
                                                            Verifikasi
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex flex-col gap-3 pt-1 sm:flex-row">
                                                <button type="submit" class="btn btn-primary flex-1 gap-2" :disabled="!canSubmit || isLoading">
                                                    <span
                                                        v-if="isLoading"
                                                        class="h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent"
                                                    ></span>
                                                    <icon-save v-else class="h-4.5 w-4.5" />
                                                    {{ isLoading ? 'Memproses...' : 'Cari Nomor Surat' }}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>
        </client-only> -->

        <!-- Modal Cek Nomor Surat -->
        <client-only>
            <TransitionRoot appear :show="modalRiwayat" as="template">
                <Dialog as="div" @close="closeRiwayatModal" class="relative z-[51]">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay class="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div class="fixed inset-0 overflow-y-auto">
                        <div class="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as="template"
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <DialogPanel
                                    class="panel relative w-full overflow-hidden rounded-lg border-0 px-4 py-1 text-black transition-all duration-300 dark:text-white-dark"
                                    :class="riwayatStep === 'result' ? 'max-w-5xl' : 'max-w-sm'"
                                >
                                    <button
                                        type="button"
                                        class="absolute top-7 z-10 text-white-dark outline-none hover:text-dark ltr:right-9 rtl:left-9"
                                        @click="closeRiwayatModal"
                                    >
                                        <icon-x />
                                    </button>
                                    <div class="py-5 text-lg font-semibold ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                        {{ riwayatStepTitle }}
                                    </div>

                                    <div class="ps-5 pb-5 pe-5">
                                        <!-- Stepper -->
                                        <div class="mb-6 flex items-center justify-center px-2">
                                            <template v-for="(step, idx) in riwayatSteps" :key="step.key">
                                                <div class="flex flex-col items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        class="grid h-8 w-8 place-content-center rounded-full text-sm font-bold transition-colors"
                                                        :class="stepCircleClass(idx)"
                                                        :disabled="idx >= currentStepIndex"
                                                        @click="goToRiwayatStep(step.key, idx)"
                                                    >
                                                        <icon-checks v-if="idx < currentStepIndex" class="h-5 w-5" />
                                                        <span v-else>{{ idx + 1 }}</span>
                                                    </button>
                                                    <span
                                                        class="text-[11px] font-semibold"
                                                        :class="idx <= currentStepIndex ? 'text-primary' : 'text-white-dark'"
                                                    >
                                                        {{ step.label }}
                                                    </span>
                                                </div>
                                                <div
                                                    v-if="idx < riwayatSteps.length - 1"
                                                    class="mb-4 h-0.5 w-10 rounded transition-colors sm:w-16"
                                                    :class="idx < currentStepIndex ? 'bg-primary' : 'bg-white-light dark:bg-[#1b2e4b]'"
                                                ></div>
                                            </template>
                                        </div>

                                        <!-- Content Body -->
                                        <Transition name="sipena-step" mode="out-in">
                                            <!-- STEP 1: Input NIP -->
                                            <form v-if="riwayatStep === 'search'" key="search" class="space-y-6" @submit.prevent="goToVerifyStep">
                                                <div>
                                                    <label class="mb-1.5 block font-semibold text-black dark:text-white-light">NIP Pengambil</label>
                                                    <div class="relative">
                                                        <input
                                                            ref="nipInput"
                                                            v-model="form.nipPengambil"
                                                            type="text"
                                                            inputmode="numeric"
                                                            maxlength="18"
                                                            class="form-input ps-10"
                                                            :class="nipStateClass"
                                                            placeholder="Masukkan 18 digit NIP"
                                                            @input="touchNip = true"
                                                        />
                                                        <span class="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark">
                                                            <icon-user class="h-4.5 w-4.5" />
                                                        </span>
                                                    </div>
                                                    <p v-if="!touchNip" class="mt-1.5 text-xs text-white-dark">
                                                        NIP digunakan untuk memvalidasi pengambil nomor
                                                    </p>
                                                    <p v-else-if="isNipValid" class="mt-1.5 text-xs font-semibold text-success">
                                                        NIP valid dan siap diverifikasi.
                                                    </p>
                                                    <p v-else class="mt-1.5 text-xs font-semibold text-danger">NIP harus 18 digit angka</p>
                                                </div>

                                                <div>
                                                    <label class="mb-1.5 block font-semibold text-black dark:text-white-light">Nama Konseptor</label>
                                                    <div class="relative">
                                                        <input
                                                            type="text"
                                                            class="form-input ps-10 disabled:cursor-not-allowed disabled:bg-white-light/60 disabled:text-white-dark dark:disabled:bg-[#1b2e4b]/60"
                                                            :value="konseptorName"
                                                            disabled
                                                            placeholder="Nama konseptor akan tampil otomatis setelah NIP valid"
                                                        />
                                                        <span class="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark">
                                                            <icon-user class="h-4.5 w-4.5" />
                                                        </span>
                                                    </div>
                                                    <p v-if="touchNip && isNipValid && !konseptorName" class="mt-1.5 text-xs font-semibold text-danger">
                                                        NIP tidak ditemukan dalam data pegawai.
                                                    </p>
                                                    <p v-else class="mt-1.5 text-xs text-white-dark">
                                                        Nama konseptor terisi otomatis berdasarkan NIP pengambil yang valid
                                                    </p>
                                                </div>

                                                <button type="submit" class="btn btn-primary w-full gap-2" :disabled="!canSubmit">
                                                    <icon-search class="h-4.5 w-4.5" />
                                                    Lanjut Verifikasi
                                                </button>
                                            </form>

                                            <!-- STEP 2: Verifikasi kata kunci -->
                                            <div v-else-if="riwayatStep === 'verify'" key="verify" class="space-y-6">
                                                <div>
                                                    <label class="mb-1.5 block font-semibold">Kata Kunci Internal</label>
                                                    <div class="relative">
                                                        <input
                                                            ref="passwordInput"
                                                            v-model="internalKeyword"
                                                            :type="showPassword ? 'text' : 'password'"
                                                            class="form-input pe-11"
                                                            placeholder="Masukkan kata kunci"
                                                            @keydown.enter.prevent="submitVerifyAndFetch"
                                                        />
                                                        <button
                                                            type="button"
                                                            class="absolute end-4 top-1/2 -translate-y-1/2 text-white-dark hover:text-primary"
                                                            @click="showPassword = !showPassword"
                                                        >
                                                            <icon-eye class="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <p v-if="verifyError" class="mt-2 text-xs font-semibold text-danger">{{ verifyError }}</p>
                                                </div>
                                                <div class="flex gap-3">
                                                    <button type="button" class="btn btn-outline-dark flex-1" @click="riwayatStep = 'search'">Kembali</button>
                                                    <button
                                                        type="button"
                                                        class="btn btn-primary flex-1 gap-2"
                                                        :disabled="isLoading"
                                                        @click="submitVerifyAndFetch"
                                                    >
                                                        <span
                                                            v-if="isLoading"
                                                            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent"
                                                        ></span>
                                                        Verifikasi
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- STEP 3: Tabel riwayat + pagination -->
                                            <div v-else key="result" class="space-y-4 pb-5">
                                                <div class="flex items-center justify-between">
                                                    <div class="text-sm text-white-dark">
                                                        Riwayat surat atas nama
                                                        <span class="font-semibold text-black dark:text-white-light">{{ konseptorName }}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        class="text-xs font-semibold text-primary hover:underline"
                                                        @click="riwayatStep = 'search'"
                                                    >
                                                        Cari NIP Lain
                                                    </button>
                                                </div>

                                                <div v-if="isLoading" class="space-y-2">
                                                    <div v-for="i in 4" :key="i" class="h-12 animate-pulse rounded bg-white-light dark:bg-[#1b2e4b]"></div>
                                                </div>

                                                <div
                                                    v-else-if="riwayatList.length === 0"
                                                    class="rounded-md bg-white-light/50 p-8 text-center text-sm text-white-dark dark:bg-[#1b2e4b]"
                                                >
                                                    Belum ada riwayat surat untuk NIP ini.
                                                </div>

                                                <div v-else class="overflow-x-auto rounded-md border border-white-light dark:border-[#1b2e4b]">
                                                    <table class="w-full text-sm">
                                                        <thead class="bg-white-light/60 text-left dark:bg-[#1b2e4b]">
                                                            <tr>
                                                                <th class="px-4 py-3 font-semibold">Nomor Surat</th>
                                                                <th class="px-4 py-3 font-semibold">Hal</th>
                                                                <th class="px-4 py-3 font-semibold">Klasifikasi</th>
                                                                <th class="px-4 py-3 font-semibold">Tanggal Surat</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr
                                                                v-for="item in riwayatList"
                                                                :key="item.id"
                                                                class="border-t border-white-light dark:border-[#1b2e4b]"
                                                            >
                                                                <td class="px-4 py-3 font-semibold text-primary">{{ item.nomorLengkap }}</td>
                                                                <td class="px-4 py-3">{{ item.hal }}</td>
                                                                <td class="px-4 py-3 text-xs text-white-dark">
                                                                    {{ item.kodeKlasifikasi }} — {{ item.namaKlasifikasi }}
                                                                </td>
                                                                <td class="px-4 py-3 text-xs text-white-dark">{{ formatTanggalSurat(item.tanggalSurat) }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div v-if="totalPages > 1" class="flex items-center justify-between pt-2">
                                                    <span class="text-xs text-white-dark">Halaman {{ riwayatPage }} dari {{ totalPages }}</span>
                                                    <div class="flex gap-2">
                                                        <button
                                                            type="button"
                                                            class="btn btn-outline-dark btn-sm"
                                                            :disabled="riwayatPage <= 1 || isLoading"
                                                            @click="changeRiwayatPage(riwayatPage - 1)"
                                                        >
                                                            Sebelumnya
                                                        </button>
                                                        <button
                                                            type="button"
                                                            class="btn btn-outline-dark btn-sm"
                                                            :disabled="riwayatPage >= totalPages || isLoading"
                                                            @click="changeRiwayatPage(riwayatPage + 1)"
                                                        >
                                                            Berikutnya
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Transition>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>
        </client-only>
    </div>
</template>

<script setup lang="ts">
    useHead({ title: 'SIPENA' });

    import { ref } from 'vue';
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue';
    import type { RiwayatSurat } from '~/composables/useSipena';

    const { isLoading, toast, fetchKlasifikasi, validateNip, findPegawaiByNip, fetchRiwayatSurat } = useSipena();

    const features = [
        {
            title: 'Pengambilan Nomor Otomatis',
            text: 'Nomor dibuat berdasarkan kode klasifikasi surat dari urutan terakhir pengambilan.',
            icon: resolveComponent('icon-bolt'),
        },
        { title: 'Validasi Pegawai', text: 'NIP konseptor memiliki status validasi sebelum proses lanjut.', icon: resolveComponent('icon-user-plus') },
        {
            title: 'Klasifikasi Kode Surat',
            text: 'Pencarian kode klasifikasi surat lebih cepat hanya memasukkan kode klasifikasi surat atau nama klasifikasi kode surat.',
            icon: resolveComponent('icon-folder'),
        },
        { title: 'Riwayat Pengambilan', text: 'Aktivitas riwayat akan tersimpan.', icon: resolveComponent('icon-clock') },
        { title: 'Cepat & Aman', text: 'Interaksi ringan dengan verifikasi langsung dari sistem.', icon: resolveComponent('icon-lock-dots') },
    ];

    const steps = [
        { title: 'Isi Data', text: 'Masukkan NIP, hal surat dan pilih kode klasifikasi surat.' },
        { title: 'Pilih Klasifikasi', text: 'Cari kode berdasarkan kode, nama, atau deskripsi.' },
        { title: 'Verifikasi', text: 'Masukkan kata kunci internal.' },
        { title: 'Nomor Surat Terbit', text: 'Nomor dapat disalin atau dibuat ulang.' },
    ];

    const faqs = [
        {
            question: 'Apakah pegawai harus login?',
            answer: 'Tidak. Halaman pengambilan nomor dibuat untuk pegawai internal pada Kantor Wilayah Direktorat Jenderal Imigrasi Riau.',
        },
        { question: 'Apakah sistem ini sudah terintegrasi dengan database sistem?', answer: 'Sudah. Sistem ini sudah terintegrasi dengan database sistem.' },
        {
            question: 'Bagaimana nomor surat dibuat?',
            answer: 'Nomor dibuat dari kode klasifikasi surat yang dipilih oleh pegawai sebelumnya dan akan mengambil dengan nomor urut terbaru dari terakhir pengambilan kode klasifikasi surat.',
        },
    ];

    const activeFaq = ref<number | null>(0);
    const modalRiwayat = ref(false);
    const bootLoading = ref(true);
    const touchNip = ref(false);
    const nipChecking = ref(false);
    const showPassword = ref(false);
    const internalKeyword = ref('');
    const verifyError = ref('');
    const nipInput = ref<HTMLInputElement | null>(null);
    const passwordInput = ref<HTMLInputElement | null>(null);
    const riwayatStep = ref<'search' | 'verify' | 'result'>('search');
    const riwayatList = ref<RiwayatSurat[]>([]);
    const riwayatPage = ref(1);
    const riwayatPageSize = 10;
    const riwayatTotal = ref(0);

    const totalPages = computed(() => Math.max(1, Math.ceil(riwayatTotal.value / riwayatPageSize)));

    const form = reactive<{
        nipPengambil: string;
        konseptor: Pegawai | null;
        hal: string;
        klasifikasi: KlasifikasiSurat | null;
    }>({
        nipPengambil: '',
        konseptor: null,
        hal: '',
        klasifikasi: null,
    });

    const riwayatSteps = [
        { key: 'search', label: 'Cari NIP' },
        { key: 'verify', label: 'Verifikasi' },
        { key: 'result', label: 'Riwayat' },
    ] as const;

    const currentStepIndex = computed(() => riwayatSteps.findIndex((s) => s.key === riwayatStep.value));

    onMounted(async () => {
        await fetchKlasifikasi();
        bootLoading.value = false;
        nextTick(() => nipInput.value?.focus());
    });

    const isNipValid = computed(() => validateNip(form.nipPengambil));

    // token dipakai buat cegah race condition kalau user ngetik ulang NIP
    // sebelum request lookup sebelumnya selesai
    let nipLookupToken = 0;

    // Otomatis mengisi Nama Konseptor begitu NIP Pengambil valid,
    // dicek langsung ke tabel pegawai di Supabase
    watch(
        () => [form.nipPengambil, isNipValid.value] as const,
        async ([nip, valid]) => {
            if (!valid) {
                form.konseptor = null;
                return;
            }

            const token = ++nipLookupToken;
            nipChecking.value = true;

            const result = await findPegawaiByNip(nip as string);

            if (token !== nipLookupToken) return; // hasil basi, diabaikan

            form.konseptor = result;
            nipChecking.value = false;
        },
    );

    const konseptorName = computed(() => form.konseptor?.nama ?? '');

    const canSubmit = computed(() => isNipValid.value && !nipChecking.value);

    const nipStateClass = computed(() => {
        if (!touchNip.value) return '';
        return isNipValid.value ? 'border-success focus:border-success' : 'border-danger focus:border-danger';
    });

    const formatTanggalSurat = (tanggal: string) => {
        return new Date(tanggal).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const riwayatStepTitle = computed(() => {
        if (riwayatStep.value === 'search') return 'Lacak Riwayat Anda';
        if (riwayatStep.value === 'verify') return 'Verifikasi Kata Kunci';
        return 'Riwayat Nomor Surat';
    });

    const goToVerifyStep = async () => {
        touchNip.value = true;
        if (!canSubmit.value) return;
        verifyError.value = '';
        riwayatStep.value = 'verify';
        await nextTick();
        passwordInput.value?.focus();
    };

    const submitVerifyAndFetch = async () => {
        if (!internalKeyword.value.trim()) {
            verifyError.value = 'Kata kunci wajib diisi.';
            return;
        }
        if (!form.konseptor) return;

        riwayatPage.value = 1;
        const result = await fetchRiwayatSurat(form.konseptor.id, internalKeyword.value.trim(), riwayatPage.value, riwayatPageSize);

        if (!result) {
            verifyError.value = 'Kata kunci tidak sesuai atau gagal memuat data.';
            return;
        }

        riwayatList.value = result.data;
        riwayatTotal.value = result.total;
        riwayatStep.value = 'result';
    };

    const changeRiwayatPage = async (page: number) => {
        if (!form.konseptor || page < 1 || page > totalPages.value) return;
        riwayatPage.value = page;
        const result = await fetchRiwayatSurat(form.konseptor.id, internalKeyword.value.trim(), page, riwayatPageSize);
        if (result) {
            riwayatList.value = result.data;
            riwayatTotal.value = result.total;
        }
    };

    const closeRiwayatModal = () => {
        modalRiwayat.value = false;
        // reset state biar bersih pas dibuka lagi
        riwayatStep.value = 'search';
        form.nipPengambil = '';
        form.konseptor = null;
        internalKeyword.value = '';
        verifyError.value = '';
        touchNip.value = false;
        riwayatList.value = [];
    };

    const stepCircleClass = (idx: number) => {
        if (idx < currentStepIndex.value) return 'bg-primary text-white cursor-pointer';
        if (idx === currentStepIndex.value) return 'bg-primary-light text-primary ring-2 ring-primary dark:bg-primary-dark-light';
        return 'bg-white-light text-white-dark dark:bg-[#1b2e4b] cursor-not-allowed';
    };

    // cuma boleh mundur ke step yang udah dilewatin, gak boleh loncat maju
    const goToRiwayatStep = (key: 'search' | 'verify' | 'result', idx: number) => {
        if (idx >= currentStepIndex.value) return;
        riwayatStep.value = key;
    };
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
