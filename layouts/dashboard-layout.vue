<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
            <template #header="{ collapsed }">
                <NuxtLink to="/admin/dashboard" class="flex items-center gap-2">
                    <img src="/assets/images/logo.png" alt="SIPENA" :class="collapsed ? 'h-6' : 'h-9'" class="object-contain" />
                </NuxtLink>
            </template>

            <template #default="{ collapsed }">
                <UNavigationMenu :collapsed="collapsed" :items="items" orientation="vertical" />
            </template>

            <template #footer="{ collapsed }">
                <UButton :label="collapsed ? undefined : 'Halaman Ambil Nomor'" icon="i-lucide-external-link" color="neutral" variant="ghost" to="/ambil-nomor-surat" block />
            </template>
        </UDashboardSidebar>

        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
            <slot />
        </div>
    </UDashboardGroup>
</template>

<script setup lang="ts">
    const items = [
        { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/admin/dashboard' },
        { label: 'Pegawai', icon: 'i-lucide-users', to: '/admin/pegawai' },
        { label: 'Kode Surat', icon: 'i-lucide-folder-tree', to: '/admin/kode-surat' },
        { label: 'Riwayat Surat', icon: 'i-lucide-history', to: '/admin/riwayat-surat' },
    ];
</script>
