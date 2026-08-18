<template>
    <div :class="{ 'dark text-white-dark': store.semidark }">
        <nav class="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300">
            <div class="flex h-full flex-col bg-white dark:bg-[#0e1726]">
                <div class="flex items-center justify-between px-4 py-3">
                    <NuxtLink to="/admin/dashboard" class="main-logo flex shrink-0 items-center gap-3">
                        <img class="h-10 w-10 rounded-md object-contain" src="/favicon.png" alt="SIPENA" />
                        <span>
                            <span class="block text-lg font-extrabold text-primary">SIPENA</span>
                            <span class="block text-xs font-semibold text-white-dark">Admin Panel</span>
                        </span>
                    </NuxtLink>
                    <button
                        type="button"
                        class="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 hover:text-primary rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                        @click="store.toggleSidebar()"
                    >
                        <icon-carets-down class="m-auto rotate-90" />
                    </button>
                </div>

                <client-only>
                    <perfect-scrollbar :options="{ swipeEasing: true, wheelPropagation: false }" class="relative h-[calc(100vh-150px)]">
                        <ul class="relative space-y-0.5 p-4 py-0 font-semibold">
                            <h2 class="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <icon-minus class="hidden h-5 w-4 flex-none" />
                                <span>Menu Admin</span>
                            </h2>

                            <li v-for="item in menuItems" :key="item.to" class="nav-item">
                                <NuxtLink :to="item.to" class="group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <component :is="item.icon" class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {{ item.label }}
                                        </span>
                                    </div>
                                </NuxtLink>
                            </li>
                        </ul>
                    </perfect-scrollbar>
                </client-only>

                <div class="mt-auto border-t border-white-light p-4 dark:border-[#1b2e4b]">
                    <button type="button" class="nav-link group w-full text-danger" @click="showLogoutModal = true">
                        <div class="flex items-center">
                            <icon-logout class="shrink-0 group-hover:!text-danger" />
                            <span class="ltr:pl-3 rtl:pr-3">Logout</span>
                        </div>
                    </button>
                </div>
            </div>
        </nav>

        <transition name="sipena-modal">
            <div v-if="showLogoutModal" class="fixed inset-0 z-[60] grid place-content-center bg-black/60 px-4">
                <div class="panel w-full max-w-md" role="dialog" aria-modal="true">
                    <div class="mx-auto mb-5 grid h-14 w-14 place-content-center rounded-full bg-danger-light text-danger">
                        <icon-logout class="h-7 w-7" />
                    </div>
                    <h3 class="text-center text-xl font-extrabold text-black dark:text-white-light">Keluar dari akun?</h3>
                    <p class="mt-2 text-center text-sm text-white-dark">Apakah kamu yakin ingin keluar dari akun admin SIPENA?</p>
                    <div class="mt-6 grid gap-3 sm:grid-cols-2">
                        <button type="button" class="btn btn-outline-dark" @click="showLogoutModal = false">Tidak</button>
                        <button type="button" class="btn btn-danger" @click="logout">Ya, Keluar</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
    import { ref, resolveComponent } from 'vue';
    import { useAppStore } from '@/stores/index';

    const store = useAppStore();
    const showLogoutModal = ref(false);

    const menuItems = [
        { label: 'Dashboard', to: '/admin/dashboard', icon: resolveComponent('icon-menu-dashboard') },
        { label: 'Riwayat Surat', to: '/admin/riwayat-surat', icon: resolveComponent('icon-notes') },
        { label: 'Kode Surat', to: '/admin/kode-surat', icon: resolveComponent('icon-folder') },
        { label: 'Pegawai', to: '/admin/pegawai', icon: resolveComponent('icon-users') },
    ];

    const toggleMobileMenu = () => {
        if (window.innerWidth < 1024) {
            store.toggleSidebar();
        }
    };

    const logout = async () => {
        const supabase = useSupabase();
        await supabase.auth.signOut();
        showLogoutModal.value = false;
        await navigateTo('/auth/cover-login');
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
