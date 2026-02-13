<template>
  <section class="safe-page px-4 py-10 sm:px-6 lg:px-8">
    <div class="safe-container mx-auto max-w-5xl rounded-2xl p-6 sm:p-10">
      <h1 class="safe-title mb-6">网络安全管理方案</h1>
      <div class="safe-markdown prose prose-slate max-w-none" v-html="renderedContent"></div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { renderMarkdown } from "../utils/markdown";
import safePlanMarkdown from "../../网络安全管理方案.md?raw";

const renderedContent = computed(() => renderMarkdown(safePlanMarkdown));
</script>

<style scoped>
.safe-page {
  min-height: calc(100vh - 4rem);
}

.safe-container {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(17, 24, 39, 0.08);
  box-shadow: 0 12px 32px -20px rgba(17, 24, 39, 0.45);
}

.safe-title {
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 700;
  color: #111827;
}

.safe-markdown :deep(h1),
.safe-markdown :deep(h2),
.safe-markdown :deep(h3),
.safe-markdown :deep(h4),
.safe-markdown :deep(h5),
.safe-markdown :deep(h6) {
  color: #111827;
  margin-top: 1.6em;
}

.safe-markdown :deep(p),
.safe-markdown :deep(li) {
  color: #1f2937;
  line-height: 1.8;
}

.safe-markdown :deep(a) {
  color: #0751cf;
  text-decoration: underline;
}

.safe-markdown :deep(code:not(pre code)) {
  background: #eef2ff;
  color: #1e3a8a;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
}

.safe-markdown :deep(pre) {
  border-radius: 0.5rem;
  overflow-x: auto;
}

.safe-markdown :deep(.table-wrapper) {
  overflow-x: auto;
  margin: 1rem 0;
}

.safe-markdown :deep(table) {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

.safe-markdown :deep(th),
.safe-markdown :deep(td) {
  border: 1px solid #d1d5db;
  padding: 0.6rem 0.75rem;
  text-align: left;
}

.safe-markdown :deep(blockquote) {
  border-left: 4px solid #60a5fa;
  padding-left: 1rem;
  color: #374151;
}
</style>
