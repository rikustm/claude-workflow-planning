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

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="workflow in store.workflows"
        :key="workflow._id"
        :to="`/workflows/${workflow._id}`"
        class="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-300 transition-all"
      >
        <div class="flex items-start justify-between gap-2">
          <h2 class="font-semibold text-gray-900">{{ workflow.title }}</h2>
          <span
            v-if="workflow.category"
            class="shrink-0 text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full"
          >
            {{ workflow.category }}
          </span>
        </div>
        <p v-if="workflow.description" class="mt-1.5 text-sm text-gray-500 line-clamp-2">
          {{ workflow.description }}
        </p>
        <p class="mt-3 text-xs text-gray-400">{{ workflow.steps?.length || 0 }} steps</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useWorkflowStore } from '../stores/workflows.js'

const store = useWorkflowStore()
onMounted(() => store.fetchAll())
</script>
