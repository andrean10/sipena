<template>
    <div class="min-h-screen bg-[#f7f8fb] px-4 py-8 text-black dark:bg-[#060818] dark:text-white-light sm:px-6 lg:px-8">
        <transition name="sipena-toast">
            <div
                v-if="toast"
                class="fixed right-5 top-5 z-50 flex w-[calc(100%-40px)] max-w-sm items-start gap-3 rounded-md border bg-white p-4 shadow-lg dark:bg-[#0e1726] sm:w-full"
                :class="toastClass"
            >
                <icon-circle-check v-if="toast.type === 'success'" :fill="true" class="mt-0.5 h-5 w-5 text-success" />
                <icon-info-circle v-else-if="toast.type === 'info'" :fill="true" class="mt-0.5 h-5 w-5 text-info" />
                <icon-info-triangle v-else class="mt-0.5 h-5 w-5 text-danger" />
                <div class="flex-1">
                    <div class="font-semibold">{{ toastTitle }}</div>
                    <div class="text-sm text-white-dark">{{ toast.message }}</div>
                </div>
                <button type="button" class="text-white-dark hover:text-danger" @click="clearToast">
                    <icon-x-circle class="h-5 w-5" />
                </button>
            </div>
        </transition>

        <div class="mx-auto max-w-5xl">
            <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <NuxtLink to="/" class="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                    <icon-arrow-left class="h-4.5 w-4.5" />
                    Kembali ke Beranda
                </NuxtLink>
                <span class="badge badge-outline-primary w-max">Layanan Publik Internal</span>
            </div>

            <div class="mb-8 text-center">
                <h1 class="text-3xl font-extrabold md:text-4xl">Pengambilan Nomor Surat</h1>
                <p class="mx-auto mt-3 max-w-2xl text-white-dark">
                    Lengkapi data naskah, pilih klasifikasi, lalu lakukan verifikasi untuk menerbitkan nomor surat.
                </p>
            </div>

            <div class="panel mx-auto max-w-3xl">
                <div v-if="bootLoading" class="space-y-5">
                    <div class="h-6 w-48 animate-pulse rounded bg-white-light dark:bg-[#1b2e4b]"></div>
                    <div v-for="item in 4" :key="item" class="space-y-2">
                        <div class="h-4 w-40 animate-pulse rounded bg-white-light dark:bg-[#1b2e4b]"></div>
                        <div class="h-11 animate-pulse rounded bg-white-light dark:bg-[#1b2e4b]"></div>
                    </div>
                </div>

                <form v-else class="space-y-6" @submit.prevent="openVerification">
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
                        <p v-if="!touchNip" class="mt-1.5 text-xs text-white-dark">NIP digunakan untuk validasi pengambil nomor.</p>
                        <p v-else-if="isNipValid" class="mt-1.5 text-xs font-semibold text-success">NIP valid dan siap diverifikasi.</p>
                        <p v-else class="mt-1.5 text-xs font-semibold text-danger">NIP harus berisi tepat 18 digit angka.</p>
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
                        <p v-else class="mt-1.5 text-xs text-white-dark">Nama konseptor terisi otomatis berdasarkan NIP pengambil yang valid.</p>
                    </div>

                    <div>
                        <label class="mb-1.5 block font-semibold text-black dark:text-white-light">Hal</label>
                        <textarea
                            ref="halInput"
                            v-model="form.hal"
                            class="form-textarea min-h-[110px] resize-none"
                            placeholder="Tuliskan hal surat secara singkat dan jelas"
                            @input="autoResize"
                        ></textarea>
                        <p class="mt-1.5 text-xs text-white-dark">Gunakan kalimat yang ringkas agar mudah ditelusuri kembali.</p>
                    </div>

                    <sipena-searchable-combobox
                        v-model="form.klasifikasi"
                        label="Kode Klasifikasi Surat"
                        placeholder="Cari kode atau nama klasifikasi"
                        helper="Ketik kode atau nama untuk mencari klasifikasi."
                        success="Klasifikasi terpilih."
                        :items="klasifikasi"
                        :search-keys="['kode', 'nama', 'deskripsi']"
                        item-key="id"
                        title-key="nama"
                    >
                        <template #icon>
                            <icon-folder class="h-4.5 w-4.5" />
                        </template>
                        <template #item="{ item }">
                            <div>
                                <div class="font-extrabold text-primary">{{ item.kode }}</div>
                                <div class="text-sm font-semibold text-black dark:text-white-light">{{ item.nama }}</div>
                            </div>
                        </template>
                        <template #empty-action="{ query }">
                            {{ query }}
                        </template>
                    </sipena-searchable-combobox>

                    <transition name="sipena-soft">
                        <div v-if="selectedClassification" class="rounded-md border border-primary/20 bg-primary-light/60 p-4 dark:bg-primary-dark-light">
                            <div class="mb-3 flex items-center gap-2 font-bold text-primary">
                                <icon-circle-check :fill="true" class="h-5 w-5" />
                                Selected Classification
                            </div>
                            <div class="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <div class="text-xs uppercase text-white-dark">Kode</div>
                                    <div class="text-lg font-extrabold">{{ selectedClassification.kode }}</div>
                                </div>
                                <div>
                                    <div class="text-xs uppercase text-white-dark">Nama</div>
                                    <div class="font-semibold">{{ selectedClassification.nama }}</div>
                                </div>
                            </div>
                        </div>
                    </transition>

                    <div class="flex flex-col gap-3 border-t border-white-light pt-6 dark:border-[#1b2e4b] sm:flex-row">
                        <button type="submit" class="btn btn-primary flex-1 gap-2" :disabled="!canSubmit || isLoading">
                            <span v-if="isLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent"></span>
                            <icon-save v-else class="h-4.5 w-4.5" />
                            {{ isLoading ? 'Memproses...' : 'Ambil Nomor Surat' }}
                        </button>
                        <button type="button" class="btn btn-outline-dark flex-1 gap-2" @click="resetForm">
                            <icon-restore class="h-4.5 w-4.5" />
                            Reset Form
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <transition name="sipena-modal">
            <div v-if="showVerification" class="fixed inset-0 z-50 grid place-content-center bg-black/60 px-4" @keydown.esc="showVerification = false">
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
                            <span v-if="isLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent"></span>
                            Verifikasi
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="sipena-modal">
            <div v-if="showSuccess" class="fixed inset-0 z-50 grid place-content-center bg-black/60 px-4">
                <div class="panel w-full max-w-md text-center" role="dialog" aria-modal="true">
                    <div class="mx-auto mb-5 grid h-20 w-20 place-content-center rounded-full bg-success-light text-success">
                        <icon-circle-check :fill="true" class="h-12 w-12" />
                    </div>
                    <h2 class="text-xl font-extrabold">Nomor Surat Berhasil Dibuat</h2>
                    <div class="my-6 rounded-md bg-primary-light px-5 py-4 text-4xl font-extrabold text-primary dark:bg-primary-dark-light">
                        {{ generatedNumber }}
                    </div>
                    <div class="grid gap-3 sm:grid-cols-3">
                        <button type="button" class="btn btn-primary gap-2" @click="copyNumber">
                            <icon-copy class="h-4.5 w-4.5" />
                            Salin Nomor
                        </button>
                        <button type="button" class="btn btn-outline-primary" @click="generateAgain">Ambil Nomor Surat Lagi</button>
                        <button type="button" class="btn btn-outline-dark" @click="showSuccess = false">Close</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
    import type { KlasifikasiSurat, Pegawai } from '@/composables/useSipena';

    useHead({ title: 'Pengambilan Nomor Surat' });

    const {
        klasifikasi,
        isLoading,
        toast,
        clearToast,
        fetchKlasifikasi,
        validateNip,
        findPegawaiByNip,
        verifyKodeUnik,
        createNomor,
    } = useSipena();

    const bootLoading = ref(true);
    const touchNip = ref(false);
    const nipChecking = ref(false);
    const showVerification = ref(false);
    const showSuccess = ref(false);
    const showPassword = ref(false);
    const internalKeyword = ref('');
    const verifyError = ref('');
    const generatedNumber = ref('');
    const nipInput = ref<HTMLInputElement | null>(null);
    const halInput = ref<HTMLTextAreaElement | null>(null);
    const passwordInput = ref<HTMLInputElement | null>(null);

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

    onMounted(async () => {
        await fetchKlasifikasi();
        bootLoading.value = false;
        nextTick(() => nipInput.value?.focus());
    });

    const isNipValid = computed(() => validateNip(form.nipPengambil));
    const selectedClassification = computed(() => form.klasifikasi);

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

    const canSubmit = computed(
        () => isNipValid.value && !!form.konseptor && !!form.hal.trim() && !!form.klasifikasi && !nipChecking.value,
    );

    const nipStateClass = computed(() => {
        if (!touchNip.value) return '';
        return isNipValid.value ? 'border-success focus:border-success' : 'border-danger focus:border-danger';
    });

    const toastClass = computed(() => ({
        'border-success/30': toast.value?.type === 'success',
        'border-danger/30': toast.value?.type === 'error',
        'border-info/30': toast.value?.type === 'info',
    }));

    const toastTitle = computed(() => {
        if (toast.value?.type === 'success') return 'Berhasil';
        if (toast.value?.type === 'error') return 'Gagal';
        return 'Informasi';
    });

    const autoResize = () => {
        if (!halInput.value) return;
        halInput.value.style.height = 'auto';
        halInput.value.style.height = `${halInput.value.scrollHeight}px`;
    };

    const openVerification = async () => {
        touchNip.value = true;
        if (!canSubmit.value) return;
        showVerification.value = true;
        verifyError.value = '';
        await nextTick();
        passwordInput.value?.focus();
    };

    const verifyAndGenerate = async () => {
        if (!internalKeyword.value.trim()) {
            verifyError.value = 'Kata kunci wajib diisi.';
            return;
        }

        // Verifikasi kata kunci dulu ke server -- kalau salah, STOP di sini,
        // nomor surat tidak akan pernah di-generate
        const isValidKeyword = await verifyKodeUnik(internalKeyword.value.trim());

        if (!isValidKeyword) {
            verifyError.value = 'Kata kunci tidak sesuai.';
            return;
        }

        if (!form.konseptor || !form.klasifikasi) return;

        const nomor = await createNomor({
            pegawaiId: form.konseptor.id,
            hal: form.hal,
            klasifikasi: form.klasifikasi,
        });

        if (!nomor) {
            verifyError.value = 'Gagal membuat nomor surat, silakan coba lagi.';
            return;
        }

        generatedNumber.value = nomor;
        showVerification.value = false;
        showSuccess.value = true;
        internalKeyword.value = '';
    };

    const resetForm = () => {
        form.nipPengambil = '';
        form.konseptor = null;
        form.hal = '';
        form.klasifikasi = null;
        touchNip.value = false;
        nextTick(() => nipInput.value?.focus());
    };

    const generateAgain = () => {
        showSuccess.value = false;
        resetForm();
    };

    const copyNumber = async () => {
        await navigator.clipboard?.writeText(generatedNumber.value);
    };
</script>

<style scoped>
    .sipena-soft-enter-active,
    .sipena-soft-leave-active,
    .sipena-modal-enter-active,
    .sipena-modal-leave-active,
    .sipena-toast-enter-active,
    .sipena-toast-leave-active {
        transition: all 180ms ease;
    }
    .sipena-soft-enter-from,
    .sipena-soft-leave-to {
        opacity: 0;
        transform: translateY(-6px);
    }
    .sipena-modal-enter-from,
    .sipena-modal-leave-to {
        opacity: 0;
        transform: scale(0.98);
    }
    .sipena-toast-enter-from,
    .sipena-toast-leave-to {
        opacity: 0;
        transform: translateY(-8px);
    }
</style>
