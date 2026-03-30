import { ref, watch } from "vue"

const theme = ref(localStorage.getItem("theme") || "system")

function updateTheme(value) {
  const roots = [document.documentElement, document.body]

  if (value === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    roots.forEach((el) => el.classList.toggle('dark', prefersDark))
    console.debug('[useTheme] set system - prefersDark?', prefersDark, 'html/body have dark?', document.documentElement.classList.contains('dark'), document.body.classList.contains('dark'))
    return
  }

  const shouldDark = value === 'dark'
  roots.forEach((el) => el.classList.toggle('dark', shouldDark))
  console.debug('[useTheme] set', value, '- html/body have dark?', document.documentElement.classList.contains('dark'), document.body.classList.contains('dark'))
}

watch(theme, (value) => {
  localStorage.setItem("theme", value)
  console.debug('[useTheme] theme changed ->', value)
  updateTheme(value)
}, { immediate: true })

// Sync theme across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'theme') {
    theme.value = e.newValue || 'system'
  }
})

export function useTheme() {
  return { theme }
}