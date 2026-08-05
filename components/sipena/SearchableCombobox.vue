<template>
    <div class="relative">
        <label v-if="label" class="mb-1.5 block font-semibold text-black dark:text-white-light">{{ label }}</label>
        <div class="relative">
            <input
                ref="inputEl"
                v-model="query"
                type="text"
                class="form-input pr-10"
                :class="[error ? 'border-danger focus:border-danger' : selected ? 'border-success focus:border-success' : '']"
                :placeholder="placeholder"
                role="combobox"
                :aria-expanded="isOpen"
                :aria-controls="listId"
                :aria-activedescendant="activeId"
                @focus="open"
                @input="onInput"
                @keydown.down.prevent="move(1)"
                @keydown.up.prevent="move(-1)"
                @keydown.enter.prevent="selectActive"
                @keydown.esc.prevent="close"
            />
            <button
                v-if="query"
                type="button"
                class="absolute top-1/2 -translate-y-1/2 text-white-dark hover:text-danger ltr:right-3 rtl:left-3"
                @click="clear"
            >
                <icon-x-circle class="h-5 w-5" />
            </button>
        </div>

        <p v-if="helper && !error" class="mt-1.5 text-xs text-white-dark">{{ helper }}</p>
        <p v-if="error" class="mt-1.5 text-xs font-semibold text-danger">{{ error }}</p>
        <p v-if="selected && success" class="mt-1.5 text-xs font-semibold text-success">{{ success }}</p>

        <transition name="sipena-dropdown">
            <div
                v-if="isOpen"
                :id="listId"
                class="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-md border border-white-light bg-white py-2 shadow-lg dark:border-[#1b2e4b] dark:bg-[#0e1726]"
                role="listbox"
            >
                <template v-if="filteredItems.length">
                    <button
                        v-for="(item, index) in filteredItems"
                        :id="`${listId}-${index}`"
                        :key="getKey(item)"
                        type="button"
                        class="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-primary-light focus:bg-primary-light focus:outline-none dark:hover:bg-[#1b2e4b] dark:focus:bg-[#1b2e4b]"
                        :class="{ 'bg-primary-light dark:bg-[#1b2e4b]': index === activeIndex }"
                        role="option"
                        @mousedown.prevent="selectItem(item)"
                    >
                        <div
                            class="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-primary-light text-primary dark:bg-primary dark:text-primary-light"
                        >
                            <slot name="icon" :item="item">
                                <icon-file class="h-4.5 w-4.5" />
                            </slot>
                        </div>
                        <div class="min-w-0 flex-1">
                            <slot name="item" :item="item">
                                <div class="truncate font-semibold text-black dark:text-white-light">{{ getTitle(item) }}</div>
                                <div v-if="getSubtitle(item)" class="truncate text-xs text-white-dark">{{ getSubtitle(item) }}</div>
                            </slot>
                        </div>
                    </button>
                </template>

                <div v-else class="px-5 py-8 text-center">
                    <div class="mx-auto mb-3 grid h-14 w-14 place-content-center rounded-full bg-info-light text-info">
                        <icon-info-circle :fill="true" class="h-7 w-7" />
                    </div>
                    <h5 class="mb-1 text-base font-semibold dark:text-white-light">Tidak ada data ditemukan</h5>
                    <p class="text-xs text-white-dark">Coba gunakan kata kunci lain.</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';

    const props = defineProps({
        modelValue: { type: [Object, String, null], default: null },
        items: { type: Array, default: () => [] },
        label: { type: String, default: '' },
        placeholder: { type: String, default: 'Cari data...' },
        helper: { type: String, default: '' },
        error: { type: String, default: '' },
        success: { type: String, default: '' },
        itemKey: { type: String, default: 'id' },
        titleKey: { type: String, default: 'nama' },
        subtitleKey: { type: String, default: '' },
        searchKeys: { type: Array, default: () => ['nama'] },
        allowCustom: { type: Boolean, default: false },
    });

    const emit = defineEmits(['update:modelValue', 'empty-action']);
    const inputEl = ref<HTMLInputElement | null>(null);
    const query = ref('');
    const isOpen = ref(false);
    const activeIndex = ref(0);
    const listId = `combobox-${Math.random().toString(36).slice(2)}`;

    const selected = computed(() => props.modelValue);
    const activeId = computed(() => (isOpen.value ? `${listId}-${activeIndex.value}` : undefined));

    const getValue = (item: any, key: string) => item?.[key] || '';
    const getKey = (item: any) => getValue(item, props.itemKey) || getTitle(item);
    const getTitle = (item: any) => (typeof item === 'string' ? item : getValue(item, props.titleKey));
    const getSubtitle = (item: any) => (props.subtitleKey ? getValue(item, props.subtitleKey) : '');

    const filteredItems = computed(() => {
        const keyword = query.value.toLowerCase().trim();
        if (!keyword) return props.items as any[];
        return (props.items as any[]).filter((item) => {
            return (props.searchKeys as string[]).some((key) => String(getValue(item, key)).toLowerCase().includes(keyword));
        });
    });

    watch(
        () => props.modelValue,
        (value: any) => {
            if (!value) query.value = '';
            else query.value = typeof value === 'string' ? value : getTitle(value);
        },
        { immediate: true },
    );

    const open = () => {
        isOpen.value = true;
        activeIndex.value = 0;
    };

    const close = () => {
        isOpen.value = false;
        if (props.allowCustom && query.value.trim()) emit('update:modelValue', query.value.trim());
    };

    const onInput = () => {
        open();
        if (props.allowCustom) emit('update:modelValue', query.value);
    };

    const move = (step: number) => {
        open();
        const total = filteredItems.value.length;
        if (!total) return;
        activeIndex.value = (activeIndex.value + step + total) % total;
    };

    const selectActive = () => {
        if (filteredItems.value[activeIndex.value]) selectItem(filteredItems.value[activeIndex.value]);
        else close();
    };

    const selectItem = (item: any) => {
        emit('update:modelValue', item);
        query.value = getTitle(item);
        close();
    };

    const clear = () => {
        query.value = '';
        emit('update:modelValue', null);
        inputEl.value?.focus();
        open();
    };
</script>

<style scoped>
    .sipena-dropdown-enter-active,
    .sipena-dropdown-leave-active {
        transition: all 160ms ease;
    }
    .sipena-dropdown-enter-from,
    .sipena-dropdown-leave-to {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
    }
</style>
