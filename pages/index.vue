<template>
    <div class="min-h-screen bg-default">
        <SipenaAppHeader>
            <nav class="hidden items-center md:flex">
                <UButton href="#fitur" color="neutral" variant="ghost" label="Fitur" />
                <UButton href="#alur" color="neutral" variant="ghost" label="Alur" />
                <UButton href="#faq" color="neutral" variant="ghost" label="FAQ" />
            </nav>
        </SipenaAppHeader>

        <main>
            <!-- Hero -->
            <section class="relative overflow-hidden">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-success"></div>
                <div class="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
                    <div>
                        <UBadge variant="subtle" size="lg" icon="i-lucide-circle-check" label="Sistem Layanan Pengambilan Nomor Naskah Internal" class="mb-6" />
                        <img src="/assets/images/logo.png" alt="Logo SIPENA" class="h-24 w-auto md:h-32 dark:brightness-0 dark:invert" />
                        <p class="mt-6 max-w-2xl text-lg leading-8 text-muted">
                            Platform modern untuk membantu pegawai mengambil nomor naskah secara cepat, tertib, dan terdokumentasi dengan klasifikasi arsip yang konsisten.
                        </p>
                        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                            <UButton to="/ambil-nomor-surat" size="xl" icon="i-lucide-file-plus" label="Ambil Nomor Surat" />
                            <UButton size="xl" variant="outline" icon="i-lucide-search" label="Cek Nomor Surat" @click="openRiwayat" />
                            <UButton href="#alur" size="xl" color="neutral" variant="ghost" icon="i-lucide-book-open" label="Panduan" />
                        </div>
                    </div>
                    <div class="hidden justify-center lg:flex">
                        <img src="/assets/images/gamir.png" alt="Ilustrasi SIPENA" class="max-h-96 w-auto object-contain" />
                    </div>
                </div>
            </section>

            <!-- Fitur -->
            <section id="fitur" class="bg-muted px-4 py-16 sm:px-6">
                <div class="mx-auto max-w-7xl">
                    <div class="mb-10 max-w-2xl">
                        <h2 class="text-3xl font-extrabold text-highlighted">Fitur Utama</h2>
                        <p class="mt-2 text-muted">Dirancang untuk proses administrasi naskah yang cepat, rapi, dan mudah digunakan.</p>
                    </div>
                    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                        <UCard v-for="feature in features" :key="feature.title" class="transition hover:-translate-y-1 hover:shadow-lg">
                            <div class="mb-4 grid size-11 place-content-center rounded-lg bg-primary/10 text-primary">
                                <UIcon :name="feature.icon" class="size-5" />
                            </div>
                            <h3 class="font-bold text-highlighted">{{ feature.title }}</h3>
                            <p class="mt-2 text-sm leading-6 text-muted">{{ feature.text }}</p>
                        </UCard>
                    </div>
                </div>
            </section>

            <!-- Alur -->
            <section id="alur" class="px-4 py-16 sm:px-6">
                <div class="mx-auto max-w-7xl">
                    <div class="mb-10 text-center">
                        <h2 class="text-3xl font-extrabold text-highlighted">Cara Kerja</h2>
                        <p class="mt-2 text-muted">Empat langkah sederhana sampai nomor naskah terbit.</p>
                    </div>
                    <div class="grid gap-5 md:grid-cols-4">
                        <UCard v-for="(step, index) in steps" :key="step.title" class="text-center">
                            <div class="mx-auto mb-4 grid size-14 place-content-center rounded-full bg-primary text-xl font-extrabold text-inverted">
                                {{ index + 1 }}
                            </div>
                            <h3 class="font-bold text-highlighted">{{ step.title }}</h3>
                            <p class="mt-2 text-sm text-muted">{{ step.text }}</p>
                        </UCard>
                    </div>
                </div>
            </section>

            <!-- FAQ -->
            <section id="faq" class="bg-muted px-4 py-16 sm:px-6">
                <div class="mx-auto max-w-3xl">
                    <div class="mb-8 text-center">
                        <h2 class="text-3xl font-extrabold text-highlighted">FAQ</h2>
                        <p class="mt-2 text-muted">Pertanyaan yang sering muncul terkait penggunaan SIPENA.</p>
                    </div>
                    <UAccordion :items="faqs" default-value="0" type="single" collapsible />
                </div>
            </section>
        </main>

        <footer class="border-t border-default px-4 py-6 text-center text-sm text-muted">
            © {{ new Date().getFullYear() }} Kantor Wilayah Direktorat Jenderal Imigrasi Riau.
        </footer>

        <!-- Modal Cek Nomor Surat -->
        <UModal v-model:open="modalRiwayat" :title="stepTitle" :ui="{ content: step === 'result' ? 'sm:max-w-4xl' : 'sm:max-w-md' }" @after:leave="resetRiwayat">
            <template #body>
                <UStepper v-model="stepIndex" :items="stepItems" size="sm" disabled class="mb-6" />

                <!-- Langkah 1: NIP -->
                <form v-if="step === 'search'" class="space-y-5" @submit.prevent="goToVerify">
                    <UFormField label="NIP Pengambil" :help="touchNip ? undefined : 'NIP digunakan untuk memvalidasi pengambil nomor.'" :error="nipError">
                        <UInput
                            v-model="nip"
                            class="w-full"
                            size="lg"
                            icon="i-lucide-user"
                            inputmode="numeric"
                            :maxlength="18"
                            placeholder="Masukkan 18 digit NIP"
                            :loading="nipChecking"
                            :color="touchNip && isNipValid ? 'success' : undefined"
                            @update:model-value="touchNip = true"
                        />
                    </UFormField>
                    <UFormField
                        label="Nama Konseptor"
                        :help="konseptorMissing ? undefined : 'Terisi otomatis berdasarkan NIP yang valid.'"
                        :error="konseptorMissing ? 'NIP tidak ditemukan dalam data pegawai.' : undefined"
                    >
                        <UInput :model-value="konseptor?.nama ?? ''" class="w-full" size="lg" icon="i-lucide-badge-check" disabled placeholder="Tampil otomatis setelah NIP valid" />
                    </UFormField>
                    <UButton type="submit" block size="lg" icon="i-lucide-arrow-right" trailing label="Lanjut Verifikasi" :disabled="!canContinue" />
                </form>

                <!-- Langkah 2: kata kunci -->
                <div v-else-if="step === 'verify'" class="space-y-5">
                    <UFormField label="Kata Kunci Internal" :error="verifyError || undefined">
                        <UInput
                            v-model="keyword"
                            class="w-full"
                            size="lg"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Masukkan kata kunci"
                            autofocus
                            @keydown.enter.prevent="submitVerify"
                        >
                            <template #trailing>
                                <UButton color="neutral" variant="link" size="sm" :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" :aria-label="showPassword ? 'Sembunyikan' : 'Tampilkan'" @click="showPassword = !showPassword" />
                            </template>
                        </UInput>
                    </UFormField>
                    <div class="flex gap-3">
                        <UButton color="neutral" variant="outline" class="flex-1 justify-center" label="Kembali" @click="step = 'search'" />
                        <UButton class="flex-1 justify-center" label="Verifikasi" :loading="isLoading" @click="submitVerify" />
                    </div>
                </div>

                <!-- Langkah 3: riwayat -->
                <div v-else class="space-y-4">
                    <div class="flex items-center justify-between gap-3">
                        <p class="text-sm text-muted">
                            Riwayat surat atas nama <span class="font-semibold text-highlighted">{{ konseptor?.nama }}</span>
                        </p>
                        <UButton size="xs" variant="link" label="Cari NIP Lain" @click="step = 'search'" />
                    </div>

                    <div v-if="isLoading" class="space-y-2">
                        <USkeleton v-for="i in 4" :key="i" class="h-12 w-full" />
                    </div>
                    <UAlert v-else-if="!riwayatList.length" color="neutral" variant="subtle" icon="i-lucide-inbox" title="Belum ada riwayat surat untuk NIP ini." />
                    <UTable v-else :data="riwayatList" :columns="columns" class="rounded-lg border border-default" />

                    <div v-if="totalPages > 1" class="flex items-center justify-between pt-1">
                        <span class="text-xs text-muted">Halaman {{ page }} dari {{ totalPages }}</span>
                        <UPagination :page="page" :items-per-page="pageSize" :total="total" size="sm" @update:page="changePage" />
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import type { TableColumn } from '@nuxt/ui';
    import type { Pegawai, RiwayatSurat } from '@/composables/useSipena';

    useHead({ title: 'SIPENA' });

    const { isLoading, toast: sipenaToast, clearToast, validateNip, findPegawaiByNip, fetchRiwayatSurat } = useSipena();
    const toaster = useToast();

    watch(sipenaToast, (t) => {
        if (!t) return;
        toaster.add({ title: t.type === 'error' ? 'Gagal' : 'Informasi', description: t.message, color: t.type === 'error' ? 'error' : 'info' });
        clearToast();
    });

    const features = [
        { title: 'Pengambilan Nomor Otomatis', text: 'Nomor dibuat berdasarkan kode klasifikasi surat dari urutan terakhir pengambilan.', icon: 'i-lucide-zap' },
        { title: 'Validasi Pegawai', text: 'NIP konseptor memiliki status validasi sebelum proses lanjut.', icon: 'i-lucide-user-check' },
        { title: 'Klasifikasi Kode Surat', text: 'Cari kode klasifikasi surat lebih cepat cukup dengan kode atau nama klasifikasinya.', icon: 'i-lucide-folder-search' },
        { title: 'Riwayat Pengambilan', text: 'Aktivitas pengambilan nomor tersimpan dan dapat ditelusuri kembali.', icon: 'i-lucide-history' },
        { title: 'Cepat & Aman', text: 'Interaksi ringan dengan verifikasi langsung dari sistem.', icon: 'i-lucide-shield-check' },
    ];

    const steps = [
        { title: 'Isi Data', text: 'Masukkan NIP dan hal surat.' },
        { title: 'Pilih Klasifikasi', text: 'Cari kode berdasarkan kode atau nama klasifikasi.' },
        { title: 'Verifikasi', text: 'Masukkan kata kunci internal.' },
        { title: 'Nomor Surat Terbit', text: 'Nomor dapat disalin atau dibuat ulang.' },
    ];

    const faqs = [
        { label: 'Apakah pegawai harus login?', content: 'Tidak. Halaman pengambilan nomor dibuat untuk pegawai internal pada Kantor Wilayah Direktorat Jenderal Imigrasi Riau.' },
        { label: 'Apakah sistem ini sudah terintegrasi dengan database sistem?', content: 'Sudah. Sistem ini sudah terintegrasi dengan database sistem.' },
        {
            label: 'Bagaimana nomor surat dibuat?',
            content: 'Nomor dibuat dari kode klasifikasi surat yang dipilih pegawai, dengan nomor urut terbaru setelah pengambilan terakhir pada kode klasifikasi tersebut.',
        },
    ];

    // --- Modal cek riwayat ---
    const modalRiwayat = ref(false);
    const step = ref<'search' | 'verify' | 'result'>('search');
    const stepItems = [{ title: 'Cari NIP' }, { title: 'Verifikasi' }, { title: 'Riwayat' }];
    const stepIndex = computed({
        get: () => ['search', 'verify', 'result'].indexOf(step.value),
        set: () => {},
    });
    const stepTitle = computed(() => ({ search: 'Lacak Riwayat Anda', verify: 'Verifikasi Kata Kunci', result: 'Riwayat Nomor Surat' })[step.value]);

    const nip = ref('');
    const konseptor = ref<Pegawai | null>(null);
    const touchNip = ref(false);
    const nipChecking = ref(false);
    const keyword = ref('');
    const showPassword = ref(false);
    const verifyError = ref('');

    const riwayatList = ref<RiwayatSurat[]>([]);
    const page = ref(1);
    const pageSize = 10;
    const total = ref(0);
    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));

    const isNipValid = computed(() => validateNip(nip.value));
    const nipError = computed(() => (touchNip.value && !isNipValid.value ? 'NIP harus berisi tepat 18 digit angka' : undefined));
    const konseptorMissing = computed(() => touchNip.value && isNipValid.value && !nipChecking.value && !konseptor.value);
    const canContinue = computed(() => isNipValid.value && !!konseptor.value && !nipChecking.value);

    // token mencegah race condition kalau NIP diketik ulang sebelum lookup sebelumnya selesai
    let lookupToken = 0;
    watch(nip, async (value) => {
        if (!validateNip(value)) {
            lookupToken++;
            nipChecking.value = false;
            konseptor.value = null;
            return;
        }
        const token = ++lookupToken;
        nipChecking.value = true;
        const result = await findPegawaiByNip(value);
        if (token !== lookupToken) return;
        konseptor.value = result;
        nipChecking.value = false;
    });

    const formatTanggal = (tanggal: string) =>
        new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const columns: TableColumn<RiwayatSurat>[] = [
        { accessorKey: 'nomorLengkap', header: 'Nomor Surat', cell: ({ row }) => h('span', { class: 'font-semibold text-primary' }, row.original.nomorLengkap) },
        { accessorKey: 'hal', header: 'Hal' },
        { id: 'klasifikasi', header: 'Klasifikasi', cell: ({ row }) => `${row.original.kodeKlasifikasi} — ${row.original.namaKlasifikasi}` },
        { accessorKey: 'tanggalSurat', header: 'Tanggal Surat', cell: ({ row }) => formatTanggal(row.original.tanggalSurat) },
    ];

    const openRiwayat = () => {
        modalRiwayat.value = true;
    };

    const goToVerify = () => {
        touchNip.value = true;
        if (!canContinue.value) return;
        verifyError.value = '';
        step.value = 'verify';
    };

    const submitVerify = async () => {
        if (!keyword.value.trim()) {
            verifyError.value = 'Kata kunci wajib diisi.';
            return;
        }
        if (!konseptor.value) return;

        page.value = 1;
        const result = await fetchRiwayatSurat(konseptor.value.id, keyword.value.trim(), page.value, pageSize);
        if (!result) {
            verifyError.value = 'Kata kunci tidak sesuai atau gagal memuat data.';
            return;
        }
        riwayatList.value = result.data;
        total.value = result.total;
        step.value = 'result';
    };

    const changePage = async (next: number) => {
        if (!konseptor.value || next < 1 || next > totalPages.value) return;
        page.value = next;
        const result = await fetchRiwayatSurat(konseptor.value.id, keyword.value.trim(), next, pageSize);
        if (result) {
            riwayatList.value = result.data;
            total.value = result.total;
        }
    };

    // reset state setelah modal tertutup supaya bersih saat dibuka lagi
    const resetRiwayat = () => {
        step.value = 'search';
        nip.value = '';
        konseptor.value = null;
        keyword.value = '';
        verifyError.value = '';
        touchNip.value = false;
        riwayatList.value = [];
        total.value = 0;
    };
</script>
