import { ref, watch } from "vue"

const theme = ref(localStorage.getItem("theme") || "system")

function updateTheme(value) {
  const html = document.documentElement

  if (value === "dark") {
    html.classList.add("dark")
  } 
  else if (value === "light") {
    html.classList.remove("dark")
  } 
  else if (value === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    html.classList.toggle("dark", prefersDark)
  }
}

watch(theme, (value) => {
  localStorage.setItem("theme", value)
  updateTheme(value)
}, { immediate: true })

export function useTheme() {
  return { theme }
}