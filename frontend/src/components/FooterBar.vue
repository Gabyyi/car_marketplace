<template>
  <footer class="mt-10 border-t border-gray-200 bg-white">
    <div class="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <h2 class="text-sm font-medium uppercase tracking-wide text-gray-900">Language</h2>
        <select
          class="mt-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          aria-label="Language"
        >
          <option>English</option>
          <option>Romanian</option>
          <option>French</option>
        </select>

        <h2 class="mt-5 text-sm font-medium uppercase tracking-wide text-gray-900">Appearance</h2>
        <select
          class="mt-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          aria-label="Appearance"
        >
          <option>System</option>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>

      <div>
        <h2 class="text-sm font-medium uppercase tracking-wide text-gray-900">Company</h2>
        <ul class="mt-3 space-y-2 text-sm text-gray-600">
          <li>About</li>
          <li>Careers</li>
          <li>Contact</li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-medium uppercase tracking-wide text-gray-900">Legal</h2>
        <ul class="mt-3 space-y-2 text-sm text-gray-600">
          <li>Terms</li>
          <li>Privacy</li>
          <li>Cookies</li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-medium uppercase tracking-wide text-gray-900">Dealer</h2>
        <ul class="mt-3 space-y-2 text-sm text-gray-600">
          <li>Dealer Login</li>
          <li>List Inventory</li>
          <li>Dealer Support</li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterBar'
}
</script>