<template>
	<div class="min-h-screen flex items-center justify-center p-6">
		<div class="max-w-md w-full bg-white dark:bg-gray-900 border rounded-xl p-6 text-center">
			<h1 class="text-2xl font-medium mb-4">Profile</h1>
			<p class="text-lg text-gray-700 dark:text-gray-200">Username: <span class="font-semibold">{{ username || '—' }}</span></p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const username = ref(localStorage.getItem('username'))

function onAuthChanged() {
	username.value = localStorage.getItem('username')
}

onMounted(() => {
	window.addEventListener('authChanged', onAuthChanged)
})
onUnmounted(() => {
	window.removeEventListener('authChanged', onAuthChanged)
})
</script>