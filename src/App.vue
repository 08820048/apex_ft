<template>
  <div id="app">
    <AppHeader />
    <ServerTip />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />

    <!-- 查询统计文本条 -->
    <QueryStatsToast />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import QueryStatsToast from "./components/QueryStatsToast.vue";
import ServerTip from "./components/ServerTip.vue";
import { useTheme } from "./composables/useTheme.js";

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>
