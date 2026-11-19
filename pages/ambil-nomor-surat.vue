<template>
    <div class="min-h-screen bg-muted">
        <SipenaAppHeader>
            <UButton to="/" icon="i-lucide-arrow-left" color="neutral" variant="ghost" label="Beranda" />
        </SipenaAppHeader>

        <main class="mx-auto max-w-2xl px-4 py-10 sm:px-6">
            <div class="mb-8 text-center">
                <UBadge variant="subtle" label="Layanan Internal" class="mb-3" />
                <h1 class="text-3xl font-extrabold text-highlighted">Pengambilan Nomor Surat</h1>
                <p class="mt-2 text-muted">Lengkapi data naskah, pilih klasifikasi, lalu verifikasi untuk menerbitkan nomor surat.</p>
            </div>

            <UCard>
                <div v-if="bootLoading" class="space-y-5">
                    <USkeleton v-for="n in 4" :key="n" class="h-11 w-full" />
                </div>

                <form v-else class="space-y-5" @submit.prevent="openVerification">
                    <UFormField
                        label="NIP Pengambil"
                        :help="touchNip ? undefined : 'NIP digunakan untuk validasi pengambil nomor.'"
                        :error="nipError"
                    >
                        <UInput
                            ref="nipInput"
                            v-model="form.nipPengambil"
                            class="w-full"
                            size="lg"
                            icon="i-lucide-user"
                            inputmode="numeric"
                            :maxlength="18"
                            placeholder="Masukkan 18 digit NIP"
                            :color="touchNip && isNipValid ? 'success' : undefined"
                            :loading="nipChecking"
                            @update:model-value="touchNip = true"
                        />
                        <template v-if="touchNip && isNipValid && form.konseptor" #hint>
                            <span class="text-success">NIP valid</span>
                        </template>
                    </UFormField>

                    <UFormField
                        label="Nama Konseptor"
                        :help="konseptorMissing ? undefined : 'Terisi otomatis berdasarkan NIP yang valid.'"
                        :error="konseptorMissing ? 'NIP tidak ditemukan dalam data pegawai.' : undefined"
                    >
                        <UInput :model-value="konseptorName" class="w-full" size="lg" icon="i-lucide-badge-check" disabled placeholder="Tampil otomatis setelah NIP valid" />
                    </UFormField>

                    <UFormField label="Hal" help="Gunakan kalimat ringkas agar mudah ditelusuri kembali.">
                        <UTextarea v-model="form.hal" class="w-full" size="lg" autoresize :rows="3" placeholder="Tuliskan hal surat secara singkat dan jelas" />
                    </UFormField>

                    <UFormField label="Kode Klasifikasi Surat" help="Ketik kode atau nama untuk mencari klasifikasi.">
                        <USelectMenu
                            v-model="form.klasifikasi"
                            :items="klasifikasiItems"
                            class="w-full"
                            size="lg"
                            icon="i-lucide-folder"
                            placeholder="Cari kode atau nama klasifikasi"
                            :search-input="{ placeholder: 'Cari kode atau nama...' }"
                        >
                            <template #item-label="{ item }">
                                <span class="font-bold text-primary">{{ item.kode }}</span>
                                <span class="ms-2 text-default">{{ item.nama }}</span>
                            </template>
                            <template #empty>Tidak ada data ditemukan</template>
                        </USelectMenu>
                    </UFormField>

                    <UAlert
                        v-if="form.klasifikasi"
                        color="primary"
                        variant="subtle"
                        icon="i-lucide-circle-check"
                        :title="form.klasifikasi.kode"
                        :description="form.klasifikasi.nama"
                    />

                    <div class="flex flex-col gap-3 border-t border-default pt-5 sm:flex-row">
                        <UButton type="submit" size="lg" class="flex-1 justify-center" icon="i-lucide-save" :disabled="!canSubmit" :loading="isLoading" label="Ambil Nomor Surat" />
                        <UButton type="button" size="lg" class="flex-1 justify-center" color="neutral" variant="outline" icon="i-lucide-rotate-ccw" label="Reset Form" @click="resetForm" />
                    </div>
                </form>
            </UCard>
        </main>

        <!-- Verifikasi kata kunci -->
        <UModal v-model:open="showVerification" title="Verifikasi Pengambilan Nomor Surat" description="Masukkan kata kunci internal">
            <template #body>
                <UFormField label="Kata Kunci" :error="verifyError || undefined">
                    <UInput
                        v-model="internalKeyword"
                        class="w-full"
                        size="lg"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Masukkan kata kunci"
                        autofocus
                        @keydown.enter.prevent="verifyAndGenerate"
                    >
                        <template #trailing>
                            <UButton color="neutral" variant="link" size="sm" :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" :aria-label="showPassword ? 'Sembunyikan' : 'Tampilkan'" @click="showPassword = !showPassword" />
                        </template>
                    </UInput>
                </UFormField>
            </template>
            <template #footer>
                <div class="flex w-full justify-end gap-2">
                    <UButton color="neutral" variant="outline" label="Batal" @click="showVerification = false" />
                    <UButton label="Verifikasi" :loading="isLoading" @click="verifyAndGenerate" />
                </div>
            </template>
        </UModal>

        <!-- Berhasil -->
        <UModal v-model:open="showSuccess" title="Nomor Surat Berhasil Dibuat">
            <template #body>
                <div class="text-center">
                    <div class="mx-auto mb-4 grid size-16 place-content-center rounded-full bg-success/10 text-success">
                        <UIcon name="i-lucide-circle-check" class="size-10" />
                    </div>
                    <div class="rounded-lg bg-primary/10 px-5 py-4 text-3xl font-extrabold text-primary break-all">{{ generatedNumber }}</div>
                    <p v-if="isWeekendSubmission" class="mt-4 text-sm text-muted">
                        Diambil di akhir pekan — tanggal surat otomatis disesuaikan ke <span class="font-semibold text-default">{{ tanggalSuratDisplay }}</span>
                    </p>
                </div>
            </template>
            <template #footer>
                <div class="grid w-full gap-2 sm:grid-cols-3">
                    <UButton :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" :label="copied ? 'Tersalin' : 'Salin Nomor'" class="justify-center" @click="copyNumber" />
                    <UButton variant="outline" label="Ambil Lagi" class="justify-center" @click="generateAgain" />
                    <UButton color="neutral" variant="outline" label="Tutup" class="justify-center" @click="showSuccess = false" />
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
    import type { KlasifikasiSurat, Pegawai } from '@/composables/useSipena';

    useHead({ title: 'Pengambilan Nomor Surat' });

    const { klasifikasi, isLoading, toast: sipenaToast, clearToast, fetchKlasifikasi, validateNip, findPegawaiByNip, verifyKodeUnik, createNomor } = useSipena();
    const toaster = useToast();

    const bootLoading = ref(true);
    const touchNip = ref(false);
    const nipChecking = ref(false);
    const showVerification = ref(false);
    const showSuccess = ref(false);
    const showPassword = ref(false);
    const internalKeyword = ref('');
    const verifyError = ref('');
    const generatedNumber = ref('');
    const tanggalSuratDisplay = ref('');
    const isWeekendSubmission = ref(false);
    const copied = ref(false);
    const nipInput = ref<{ inputRef?: HTMLInputElement } | null>(null);

    const form = reactive<{ nipPengambil: string; konseptor: Pegawai | null; hal: string; klasifikasi: (KlasifikasiSurat & { label: string }) | null }>({
        nipPengambil: '',
        konseptor: null,
        hal: '',
        klasifikasi: null,
    });

    // label dipakai USelectMenu untuk pencarian: gabungan kode + nama
    const klasifikasiItems = computed(() => klasifikasi.value.map((k) => ({ ...k, label: `${k.kode} ${k.nama}` })));

    // Toast dari composable diteruskan ke toast Nuxt UI
    watch(sipenaToast, (t) => {
        if (!t) return;
        toaster.add({
            title: t.type === 'success' ? 'Berhasil' : t.type === 'error' ? 'Gagal' : 'Informasi',
            description: t.message,
            color: t.type === 'success' ? 'success' : t.type === 'error' ? 'error' : 'info',
        });
        clearToast();
    });

    onMounted(async () => {
        await fetchKlasifikasi();
        bootLoading.value = false;
        await nextTick();
        nipInput.value?.inputRef?.focus();
    });

    const isNipValid = computed(() => validateNip(form.nipPengambil));
    const nipError = computed(() => (touchNip.value && !isNipValid.value ? 'NIP harus berisi tepat 18 digit angka' : undefined));
    const konseptorName = computed(() => form.konseptor?.nama ?? '');
    const konseptorMissing = computed(() => touchNip.value && isNipValid.value && !nipChecking.value && !form.konseptor);
    const canSubmit = computed(() => isNipValid.value && !!form.konseptor && !!form.hal.trim() && !!form.klasifikasi && !nipChecking.value);

    // token dipakai buat cegah race condition kalau user ngetik ulang NIP
    // sebelum request lookup sebelumnya selesai
    let nipLookupToken = 0;

    watch(
        () => form.nipPengambil,
        async (nip) => {
            if (!validateNip(nip)) {
                nipLookupToken++;
                nipChecking.value = false;
                form.konseptor = null;
                return;
            }
            const token = ++nipLookupToken;
            nipChecking.value = true;
            const result = await findPegawaiByNip(nip);
            if (token !== nipLookupToken) return; // hasil basi, diabaikan
            form.konseptor = result;
            nipChecking.value = false;
        },
    );

    const formatTanggalSurat = (tanggal: string) =>
        new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const openVerification = () => {
        touchNip.value = true;
        if (!canSubmit.value) return;
        verifyError.value = '';
        showVerification.value = true;
    };

    const verifyAndGenerate = async () => {
        if (!internalKeyword.value.trim()) {
            verifyError.value = 'Kata kunci wajib diisi.';
            return;
        }

        // Verifikasi kata kunci ke server dulu. Kalau salah, berhenti di sini.
        const isValidKeyword = await verifyKodeUnik(internalKeyword.value.trim());
        if (!isValidKeyword) {
            verifyError.value = 'Kata kunci tidak sesuai.';
            return;
        }

        if (!form.konseptor || !form.klasifikasi) return;

        const result = await createNomor({ pegawaiId: form.konseptor.id, hal: form.hal, klasifikasi: form.klasifikasi });
        if (!result) {
            verifyError.value = 'Gagal membuat nomor surat, silakan coba lagi.';
            return;
        }

        generatedNumber.value = result.nomor;
        tanggalSuratDisplay.value = formatTanggalSurat(result.tanggalSurat);

        // Notice "tanggal digeser" kalau diambil di Sabtu/Minggu
        const hariIni = new Date().getDay();
        isWeekendSubmission.value = hariIni === 0 || hariIni === 6;

        showVerification.value = false;
        showSuccess.value = true;
        copied.value = false;
        internalKeyword.value = '';
    };

    const resetForm = async () => {
        form.nipPengambil = '';
        form.konseptor = null;
        form.hal = '';
        form.klasifikasi = null;
        touchNip.value = false;
        await nextTick();
        nipInput.value?.inputRef?.focus();
    };

    const generateAgain = () => {
        showSuccess.value = false;
        resetForm();
    };

    const copyNumber = async () => {
        try {
            await navigator.clipboard.writeText(generatedNumber.value);
            copied.value = true;
            setTimeout(() => (copied.value = false), 2000);
        } catch {
            toaster.add({ title: 'Gagal menyalin', description: 'Salin nomor secara manual.', color: 'error' });
        }
    };
</script>
