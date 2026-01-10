import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);

// 全局错误处理
app.config.errorHandler = (err, _vm, info) => {
  console.error("Vue错误:", err, info);
};

// 未处理的Promise错误
window.addEventListener("unhandledrejection", (event) => {
  console.error("未处理的Promise错误:", event.reason);
  event.preventDefault();
});

app.use(router);
app.mount("#app");
