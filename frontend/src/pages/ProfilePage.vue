<template>
	<div class="min-h-screen flex items-center justify-center p-6">
		<div class="max-w-md w-full bg-white dark:bg-gray-900 border rounded-xl p-6 text-center">
			<h1 class="text-2xl font-medium mb-4">Profile</h1>
			<p class="text-lg text-gray-700 dark:text-gray-200">Username: <span class="font-semibold">{{ username || '—' }}</span></p>

			<div class="mt-6">
				<button
					type="button"
					@click="logout"
					class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
				>Log out</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref(localStorage.getItem('username'))

function onAuthChanged() {
	username.value = localStorage.getItem('username')
}

function logout() {
	localStorage.removeItem('token')
	localStorage.removeItem('username')
	window.dispatchEvent(new Event('authChanged'))
	router.push({ name: 'Home' })
}

onMounted(() => {
	window.addEventListener('authChanged', onAuthChanged)
})
onUnmounted(() => {
	window.removeEventListener('authChanged', onAuthChanged)
})
</script>