<template>
  <footer
    class="border-t border-gray-200 bg-gray-50 mt-auto"
    @click="closeNonAiStatement"
  >
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-col items-center text-sm text-gray-600 space-y-2">
        <!-- 版权信息 -->
        <div class="flex items-center space-x-2">
          <img
            src="/Apex.png"
            alt="ApexBlog Logo"
            class="w-6 h-6 object-cover"
          />
          <p>© {{ currentYear }} ApexBlog. All rights reserved.</p>

          <div class="relative" @click.stop>
            <button
              type="button"
              class="ml-1 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              :aria-expanded="isNonAiStatementOpen"
              aria-haspopup="dialog"
              @click="toggleNonAiStatement"
            >
              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white text-[11px] leading-none"
                aria-hidden="true"
              >
                :)
              </span>
              <span>非 AI 生成</span>
            </button>

            <div
              v-if="isNonAiStatementOpen"
              class="absolute bottom-full left-1/2 z-50 mb-3 w-[320px] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white shadow-xl"
              role="dialog"
              aria-label="非AI生成"
              @click.stop
            >
              <div class="px-5 py-4 text-gray-800">
                <div class="mb-3 flex items-center gap-3">
                  <div
                    class="flex items-center gap-2 rounded-2xl border-2 border-gray-900 px-4 py-2"
                  >
                    <span
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-900 text-sm font-bold"
                      aria-hidden="true"
                    >
                      :)
                    </span>
                    <div class="leading-tight">
                      <div class="text-xs font-semibold text-gray-700">
                        真人撰写
                      </div>
                      <div class="text-lg font-extrabold tracking-wide">
                        非AI生成
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-base leading-7">
                  除特别注明的引用内容外，本站文章没有任何一句话由 AI 生成。
                </div>

                <div class="mt-4">
                  <RouterLink
                    to="/about"
                    class="inline-flex items-center gap-1 text-base font-semibold text-gray-900 hover:underline"
                    @click="closeNonAiStatement"
                  >
                    了解更多 <span aria-hidden="true">↗</span>
                  </RouterLink>
                </div>
              </div>

              <div
                class="absolute left-1/2 top-full z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-white"
                aria-hidden="true"
              />
              <div
                class="absolute left-1/2 top-full z-0 h-0 w-0 -translate-x-1/2 border-x-[9px] border-t-[9px] border-x-transparent border-t-gray-200"
                style="margin-top: 1px"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <!-- 备案信息 -->
        <div
          class="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-6 text-xs text-gray-500"
        >
          <!-- ICP备案 -->
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-gray-700 transition-colors"
          >
            黔ICP备2021010295号
          </a>

          <!-- 公安备案 -->
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=52052402000190"
            target="_blank"
            class="flex items-center space-x-1"
          >
            <img src="/an.png" alt="公安备案图标" class="w-3 h-3" />
            <b
              class="font-extrabold border-b-2 border-gray-500 hover:text-gray-700 text-gray-500"
            >
              贵公安备52052402000190号
            </b>
          </a>

          <!-- 赞助广告 -->
          <a
            href="https://www.effectivegatecpm.com/guvgbqy6?key=a3cdb29d42de224641aa927b06170887"
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            class="hover:text-gray-700 transition-colors"
          >
            赞助广告
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref } from "vue";

const currentYear = computed(() => new Date().getFullYear());

const isNonAiStatementOpen = ref(false);

const toggleNonAiStatement = () => {
  isNonAiStatementOpen.value = !isNonAiStatementOpen.value;
};

const closeNonAiStatement = () => {
  isNonAiStatementOpen.value = false;
};
</script>
