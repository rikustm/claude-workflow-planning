<template>
  <div v-if="store.loading && !isNew" class="text-center py-12 text-gray-400">Loading...</div>

  <div v-else class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <router-link to="/" class="text-sm text-gray-400 hover:text-gray-600">← Back</router-link>
      <button
        v-if="!isNew"
        @click="handleDelete"
        class="text-sm text-red-400 hover:text-red-600 transition-colors"
      >
        Delete workflow
      </button>
    </div>

    <!-- Title
         View:  h1 with text-2xl bold, no padding → height = line-height (2rem = 32px)
         Edit:  input with same font, py-0 px-0 strips forms-plugin padding, shadow underline
                doesn't add to box size unlike border-b -->
    <div class="group relative mb-3">
      <input
        v-if="editingField === 'title' || isNew"
        v-auto-focus="editingField === 'title' || isNew"
        v-model="form.title"
        placeholder="Workflow title"
        class="w-full text-2xl font-bold text-gray-900 bg-transparent border-0 py-0 rounded-md outline-none [box-shadow:0_0_0_3px_#818cf8] px-1.5"
        @blur="saveField('title')"
        @keydown.enter.prevent="saveField('title')"
        @keydown.esc="cancelEdit('title')"
      />
      <div v-else class="flex items-center gap-2">
        <h1 @dblclick="startEdit('title')" class="text-2xl font-bold text-gray-900 cursor-default select-none">{{ form.title || 'Untitled' }}</h1>
        <button
          @click="startEdit('title')"
          class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
        </button>
      </div>
    </div>

    <!-- Category — outer div is always the flex row so both states share the same container -->
    <div class="group relative mb-5 flex items-center gap-2">
      <input
        v-if="editingField === 'category' || isNew"
        v-auto-focus="editingField === 'category'"
        v-model="form.category"
        placeholder="Category (optional)"
        class="min-w-0 flex-1 text-sm text-indigo-600 bg-transparent border-0 py-0 rounded-md outline-none [box-shadow:0_0_0_3px_#818cf8] px-1.5 placeholder:text-indigo-300"
        @blur="saveField('category')"
        @keydown.enter.prevent="saveField('category')"
        @keydown.esc="cancelEdit('category')"
      />
      <template v-else>
        <span v-if="form.category" @dblclick="startEdit('category')" class="text-sm text-indigo-600 cursor-default select-none">{{ form.category }}</span>
        <span v-else @dblclick="startEdit('category')" class="text-sm text-gray-300 italic cursor-default select-none">No category</span>
        <button
          @click="startEdit('category')"
          class="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
        >
          <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
        </button>
      </template>
    </div>

    <!-- Description — outer div is always the flex row so both states share the same container -->
    <div class="group relative mb-8 flex items-start gap-2">
      <textarea
        v-if="editingField === 'description' || isNew"
        v-auto-focus="editingField === 'description'"
        v-model="form.description"
        placeholder="Describe this workflow..."
        class="flex-1 text-sm text-gray-500 bg-transparent border-0 py-0 resize-none min-h-[60px] rounded-md outline-none [box-shadow:0_0_0_3px_#818cf8] px-1.5"
        @blur="saveField('description')"
        @keydown.esc="cancelEdit('description')"
      />
      <template v-else>
        <p
          v-if="form.description"
          @dblclick="startEdit('description')"
          class="flex-1 text-sm text-gray-500 min-h-[60px] cursor-default select-none"
        >{{ form.description }}</p>
        <p
          v-else
          @dblclick="startEdit('description')"
          class="flex-1 text-sm text-gray-300 italic min-h-[60px] cursor-default select-none"
        >Add a description...</p>
        <button
          @click="startEdit('description')"
          class="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
        >
          <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
        </button>
      </template>
    </div>

    <!-- Steps -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-semibold text-gray-900">Steps</h2>
        <button @click="addStep" class="text-sm text-indigo-600 hover:underline">+ Add Step</button>
      </div>

      <div class="space-y-3">
        <div
          v-for="(step, idx) in form.steps"
          :key="idx"
          class="group/step bg-white border border-gray-200 rounded-xl p-4 flex gap-4"
        >
          <div class="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
            {{ step.order }}
          </div>

          <div class="flex-1 min-w-0 space-y-2">

            <!-- Step title: font-semibold, no padding, shadow underline keeps same line height -->
            <div class="group relative">
              <input
                v-if="editingField === `step-${idx}-title` || isNew"
                v-auto-focus="editingField === `step-${idx}-title`"
                v-model="step.title"
                placeholder="Step title"
                class="w-full font-semibold text-gray-900 bg-transparent border-0 py-0 rounded-md outline-none [box-shadow:0_0_0_3px_#818cf8] px-1.5"
                @blur="saveField(`step-${idx}-title`)"
                @keydown.enter.prevent="saveField(`step-${idx}-title`)"
                @keydown.esc="cancelEdit(`step-${idx}-title`)"
              />
              <div v-else class="flex items-center gap-1.5">
                <span @dblclick="startEdit(`step-${idx}-title`)" class="font-semibold text-gray-900 cursor-default select-none">{{ step.title || 'Untitled step' }}</span>
                <button
                  @click="startEdit(`step-${idx}-title`)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
                >
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                </button>
              </div>
            </div>

            <!-- Step description: min-h-[40px] locks both states to 2 × text-sm lines -->
            <div class="group relative">
              <textarea
                v-if="editingField === `step-${idx}-description` || isNew"
                v-auto-focus="editingField === `step-${idx}-description`"
                v-model="step.description"
                placeholder="Description (optional)"
                class="w-full text-sm text-gray-500 bg-transparent border-0 py-0 resize-none min-h-[40px] rounded-md outline-none [box-shadow:0_0_0_3px_#818cf8] px-1.5"
                @blur="saveField(`step-${idx}-description`)"
                @keydown.esc="cancelEdit(`step-${idx}-description`)"
              />
              <div v-else class="flex items-start gap-1.5">
                <p v-if="step.description" @dblclick="startEdit(`step-${idx}-description`)" class="text-sm text-gray-500 flex-1 min-h-[40px] cursor-default select-none">{{ step.description }}</p>
                <p v-else @dblclick="startEdit(`step-${idx}-description`)" class="text-sm text-gray-300 italic flex-1 min-h-[40px] cursor-default select-none">Add description...</p>
                <button
                  @click="startEdit(`step-${idx}-description`)"
                  class="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
                >
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                </button>
              </div>
            </div>

            <!-- Step assignee: text-xs, same height in both states -->
            <div class="group relative">
              <input
                v-if="editingField === `step-${idx}-assignee` || isNew"
                v-auto-focus="editingField === `step-${idx}-assignee`"
                v-model="step.assignee"
                placeholder="Assignee (optional)"
                class="w-full text-xs text-gray-400 bg-transparent border-0 py-0 rounded outline-none [box-shadow:0_0_0_3px_#818cf8] px-1.5"
                @blur="saveField(`step-${idx}-assignee`)"
                @keydown.enter.prevent="saveField(`step-${idx}-assignee`)"
                @keydown.esc="cancelEdit(`step-${idx}-assignee`)"
              />
              <div v-else class="flex items-center gap-1.5">
                <span v-if="step.assignee" @dblclick="startEdit(`step-${idx}-assignee`)" class="text-xs text-gray-400 cursor-default select-none">{{ step.assignee }}</span>
                <span v-else @dblclick="startEdit(`step-${idx}-assignee`)" class="text-xs text-gray-300 italic cursor-default select-none">Assignee...</span>
                <button
                  @click="startEdit(`step-${idx}-assignee`)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
                >
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Remove step -->
          <button
            @click="removeStep(idx)"
            class="opacity-0 group-hover/step:opacity-100 transition-opacity self-start mt-0.5 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Create button (new workflow only) -->
    <div v-if="isNew" class="flex justify-end gap-3 mt-8">
      <router-link
        to="/"
        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        Cancel
      </router-link>
      <button
        @click="handleCreate"
        :disabled="!form.title.trim()"
        class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Create Workflow
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkflowStore } from '../stores/workflows.js'

// Only focus when the binding value is truthy — prevents all inputs grabbing focus simultaneously in new mode
const vAutoFocus = { mounted: (el, { value }) => { if (value !== false) el.focus({ preventScroll: true }) } }

const route = useRoute()
const router = useRouter()
const store = useWorkflowStore()

const isNew = computed(() => route.params.id === 'new')
const editingField = ref(null)
const previousValue = ref(null)
const form = ref({ title: '', description: '', category: '', steps: [] })

onMounted(async () => {
  if (!isNew.value) {
    await store.fetchOne(route.params.id)
    populateForm(store.current)
  }
})

function populateForm(w) {
  form.value = {
    title: w.title,
    description: w.description || '',
    category: w.category || '',
    steps: w.steps.map((s) => ({ ...s })),
  }
}

function parseStepField(field) {
  const match = field.match(/^step-(\d+)-(.+)$/)
  if (!match) return null
  return { idx: Number(match[1]), prop: match[2] }
}

function getFieldValue(field) {
  const step = parseStepField(field)
  if (step) return form.value.steps[step.idx]?.[step.prop]
  return form.value[field]
}

function setFieldValue(field, value) {
  const step = parseStepField(field)
  if (step) form.value.steps[step.idx][step.prop] = value
  else form.value[field] = value
}

function startEdit(field) {
  previousValue.value = getFieldValue(field)
  editingField.value = field
}

async function saveField(field) {
  if (isNew.value) return
  editingField.value = null
  previousValue.value = null
  await store.update(route.params.id, form.value)
}

function cancelEdit(field) {
  if (isNew.value) return
  setFieldValue(field, previousValue.value)
  editingField.value = null
  previousValue.value = null
}

async function addStep() {
  const idx = form.value.steps.length
  form.value.steps.push({ order: idx + 1, title: '', description: '', assignee: '' })
  if (!isNew.value) await store.update(route.params.id, form.value)
  editingField.value = `step-${idx}-title`
}

async function removeStep(idx) {
  form.value.steps.splice(idx, 1)
  form.value.steps.forEach((s, i) => (s.order = i + 1))
  if (!isNew.value) await store.update(route.params.id, form.value)
}

async function handleCreate() {
  if (!form.value.title.trim()) return
  const w = await store.create(form.value)
  router.push(`/workflows/${w._id}`)
}

async function handleDelete() {
  if (!confirm('Delete this workflow?')) return
  await store.remove(route.params.id)
  router.push('/')
}
</script>
