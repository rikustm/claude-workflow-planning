<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <router-link to="/" class="text-lg font-semibold text-gray-900 hover:text-indigo-600">
          Workflow Planner
        </router-link>
        <router-link
          to="/workflows/new"
          class="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Workflow
        </router-link>
      </div>
    </nav>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>
