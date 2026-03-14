<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Workflows</h1>
      <router-link
        to="/workflows/new"
        class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        + New Workflow
      </router-link>
    </div>

    <div v-if="store.loading" class="text-center py-12 text-gray-400">Loading...</div>

    <div v-else-if="store.workflows.length === 0" class="text-center py-16 text-gray-400">
      <p class="text-lg">No workflows yet.</p>
      <router-link to="/workflows/new" class="mt-3 inline-block text-indigo-600 hover:underline">
        Create your first workflow →
      </router-link>
    </div>

    <div v-else class="space-y-8">
      <div v-for="[category, workflows] in grouped" :key="category">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          {{ category || 'Uncategorized' }}
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            v-for="workflow in workflows"
            :key="workflow._id"
            :to="`/workflows/${workflow._id}`"
            class="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <h3 class="font-semibold text-gray-900">{{ workflow.title }}</h3>
            <p v-if="workflow.description" class="mt-1.5 text-sm text-gray-500 line-clamp-2">
              {{ workflow.description }}
            </p>
            <p class="mt-3 text-xs text-gray-400">{{ workflow.steps?.length || 0 }} steps</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useWorkflowStore } from '../stores/workflows.js'

const store = useWorkflowStore()
onMounted(() => store.fetchAll())

const grouped = computed(() => {
  const map = new Map()
  for (const w of store.workflows) {
    const key = w.category || ''
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(w)
  }
  // Sort: named categories alphabetically, uncategorized last
  return [...map.entries()].sort(([a], [b]) => {
    if (!a) return 1
    if (!b) return -1
    return a.localeCompare(b)
  })
})
</script>
