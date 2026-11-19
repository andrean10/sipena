<template>
    <header class="sticky top-0 z-30 border-b border-default bg-default/90 backdrop-blur">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <NuxtLink to="/" class="flex items-center gap-3">
                <img src="/assets/images/logo_instansi.png" alt="Logo Imigrasi" class="h-10 object-contain sm:h-12" />
                <div class="h-10 w-px bg-accented sm:h-12"></div>
                <img src="/assets/images/logo.png" alt="Logo SIPENA" class="h-9 object-contain sm:h-11 dark:brightness-0 dark:invert" />
            </NuxtLink>
            <div class="flex items-center gap-1">
                <slot />
                <UColorModeButton />
            </div>
        </div>
    </header>
</template>
