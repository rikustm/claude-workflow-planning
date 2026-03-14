<template>
  <div v-if="store.loading && !isNew" class="text-center py-12 text-gray-400">Loading...</div>

  <div v-else class="max-w-2xl mx-auto" :class="{ 'view-only': viewOnly }">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <router-link to="/" class="text-sm text-gray-400 hover:text-gray-600">← Back</router-link>
      <div class="flex items-center gap-4">
        <button
          @click="viewOnly = !viewOnly"
          class="view-toggle text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >{{ viewOnly ? 'Edit' : 'View' }}</button>
        <button
          v-if="!isNew"
          @click="handleDelete"
          class="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Delete workflow
        </button>
      </div>
    </div>

    <!-- Title
         View:  h1 with text-2xl bold, no padding → height = line-height (2rem = 32px)
         Edit:  input with same font, py-0 px-0 strips forms-plugin padding, shadow underline
                doesn't add to box size unlike border-b -->
    <div class="group relative mb-3">
      <input
        v-if="editingField === 'title'"
        v-auto-focus="editingField === 'title'"
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
        v-if="editingField === 'category'"
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
        v-if="editingField === 'description'"
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
        <div class="flex items-center gap-3">
          <button @click="addConditionStep" class="text-sm text-amber-600 hover:underline">+ Add Condition</button>
          <button @click="addStep" class="text-sm text-indigo-600 hover:underline">+ Add Step</button>
        </div>
      </div>

      <div class="relative space-y-3">
        <!-- Single vertical line at step column center; step cards (bg-white) cover it, condition nodes let it pass through -->
        <div class="absolute top-0 bottom-0 left-8 w-px bg-gray-300 pointer-events-none"></div>
        <template v-for="(step, idx) in form.steps" :key="idx">
        <!-- Condition node (no background — container line passes through it) -->
        <div v-if="step.type === 'condition'" class="group/step flex gap-4 pl-4">
          <!-- Left column: arrows + diamond, centered over the container line -->
          <div class="flex flex-col items-center w-8 shrink-0">
            <button @click="moveStep(idx, -1)" :disabled="idx === 0" class="p-0.5 rounded text-gray-300 hover:text-gray-500 disabled:opacity-0 disabled:pointer-events-none transition-opacity opacity-0 group-hover/step:opacity-100">
              <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" /></svg>
            </button>
            <div class="w-7 h-7 bg-amber-100 border-2 border-amber-400 rotate-45 shrink-0 my-1 flex items-center justify-center">
              <span class="-rotate-45 text-xs font-bold text-amber-700 leading-none">{{ step.order }}</span>
            </div>
            <button @click="moveStep(idx, 1)" :disabled="idx === form.steps.length - 1" class="p-0.5 rounded text-gray-300 hover:text-gray-500 disabled:opacity-0 disabled:pointer-events-none transition-opacity opacity-0 group-hover/step:opacity-100">
              <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" /></svg>
            </button>
          </div>
          <!-- Condition text -->
          <div class="flex-1 flex items-center py-1">
            <input
              v-if="editingField === `step-${idx}-condition`"
              v-auto-focus="editingField === `step-${idx}-condition`"
              v-model="step.condition"
              placeholder="Condition text"
              class="flex-1 text-sm text-amber-700 bg-amber-50 border-0 py-1 rounded-md outline-none [box-shadow:0_0_0_3px_#fbbf24] px-2"
              @blur="saveField(`step-${idx}-condition`)"
              @keydown.enter.prevent="saveField(`step-${idx}-condition`)"
              @keydown.esc="cancelEdit(`step-${idx}-condition`)"
            />
            <span
              v-else
              @dblclick="startEdit(`step-${idx}-condition`)"
              class="text-sm text-amber-700 italic cursor-default select-none"
            >{{ step.condition || 'Condition' }}</span>
          </div>
          <button @click="removeStep(idx)" class="opacity-0 group-hover/step:opacity-100 transition-opacity self-center p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        </div>

        <!-- Regular step (relative z-10 so bg-white stacks above the container line) -->
        <div v-else class="group/step relative z-10 bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
          <div class="flex flex-col items-center gap-0.5 shrink-0">
            <button @click="moveStep(idx, -1)" :disabled="idx === 0" class="p-0.5 rounded text-gray-300 hover:text-gray-500 disabled:opacity-0 disabled:pointer-events-none transition-opacity opacity-0 group-hover/step:opacity-100">
              <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" /></svg>
            </button>
            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">{{ step.order }}</div>
            <button @click="moveStep(idx, 1)" :disabled="idx === form.steps.length - 1" class="p-0.5 rounded text-gray-300 hover:text-gray-500 disabled:opacity-0 disabled:pointer-events-none transition-opacity opacity-0 group-hover/step:opacity-100">
              <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" /></svg>
            </button>
          </div>
          <div class="flex-1 min-w-0 space-y-2">
            <!-- Step title -->
            <div class="group relative">
              <input
                v-if="editingField === `step-${idx}-title`"
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
                <button @click="startEdit(`step-${idx}-title`)" class="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600">
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                </button>
              </div>
            </div>
            <!-- Step description -->
            <div class="group relative">
              <textarea
                v-if="editingField === `step-${idx}-description`"
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
                <button @click="startEdit(`step-${idx}-description`)" class="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600">
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                </button>
              </div>
            </div>
          </div>
          <button @click="removeStep(idx)" class="opacity-0 group-hover/step:opacity-100 transition-opacity self-start mt-0.5 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        </div>

        <!-- Branch steps (shown for condition nodes) -->
        <div v-if="step.type === 'condition'" class="relative z-10 ml-12 space-y-2">
          <!-- Branch step cards -->
          <div
            v-for="(bStep, bIdx) in step.branchSteps"
            :key="bIdx"
            class="group/bstep"
          >
            <div class="flex-1 bg-white border border-gray-200 rounded-lg p-3 flex gap-3">
              <div class="flex flex-col items-center gap-0.5 shrink-0">
                <button
                  @click="moveBranchStep(idx, bIdx, -1)"
                  :disabled="bIdx === 0"
                  class="p-0.5 rounded text-gray-300 hover:text-gray-500 disabled:opacity-0 disabled:pointer-events-none transition-opacity opacity-0 group-hover/bstep:opacity-100"
                >
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" /></svg>
                </button>
                <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                  {{ bStep.order }}
                </div>
                <button
                  @click="moveBranchStep(idx, bIdx, 1)"
                  :disabled="bIdx === step.branchSteps.length - 1"
                  class="p-0.5 rounded text-gray-300 hover:text-gray-500 disabled:opacity-0 disabled:pointer-events-none transition-opacity opacity-0 group-hover/bstep:opacity-100"
                >
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" /></svg>
                </button>
              </div>
              <div class="flex-1 min-w-0 space-y-1">
                <!-- Branch step title -->
                <div class="group relative">
                  <input
                    v-if="editingField === `branch-${idx}-${bIdx}-title`"
                    v-auto-focus="editingField === `branch-${idx}-${bIdx}-title`"
                    v-model="bStep.title"
                    placeholder="Step title"
                    class="w-full font-medium text-sm text-gray-900 bg-transparent border-0 py-0 rounded-md outline-none [box-shadow:0_0_0_3px_#818cf8] px-1.5"
                    @blur="saveField(`branch-${idx}-${bIdx}-title`)"
                    @keydown.enter.prevent="saveField(`branch-${idx}-${bIdx}-title`)"
                    @keydown.esc="cancelEdit(`branch-${idx}-${bIdx}-title`)"
                  />
                  <div v-else class="flex items-center gap-1.5">
                    <span @dblclick="startEdit(`branch-${idx}-${bIdx}-title`)" class="font-medium text-sm text-gray-900 cursor-default select-none">{{ bStep.title || 'Untitled step' }}</span>
                    <button @click="startEdit(`branch-${idx}-${bIdx}-title`)" class="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600">
                      <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                    </button>
                  </div>
                </div>
                <!-- Branch step description -->
                <div class="group relative">
                  <textarea
                    v-if="editingField === `branch-${idx}-${bIdx}-description`"
                    v-auto-focus="editingField === `branch-${idx}-${bIdx}-description`"
                    v-model="bStep.description"
                    placeholder="Description (optional)"
                    class="w-full text-sm text-gray-500 bg-transparent border-0 py-0 resize-none min-h-[40px] rounded-md outline-none [box-shadow:0_0_0_3px_#818cf8] px-1.5"
                    @blur="saveField(`branch-${idx}-${bIdx}-description`)"
                    @keydown.esc="cancelEdit(`branch-${idx}-${bIdx}-description`)"
                  />
                  <div v-else class="flex items-start gap-1.5">
                    <p v-if="bStep.description" @dblclick="startEdit(`branch-${idx}-${bIdx}-description`)" class="text-sm text-gray-500 flex-1 min-h-[40px] cursor-default select-none">{{ bStep.description }}</p>
                    <p v-else @dblclick="startEdit(`branch-${idx}-${bIdx}-description`)" class="text-sm text-gray-300 italic flex-1 min-h-[40px] cursor-default select-none">Add description...</p>
                    <button @click="startEdit(`branch-${idx}-${bIdx}-description`)" class="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600">
                      <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
              <button
                @click="removeBranchStep(idx, bIdx)"
                class="opacity-0 group-hover/bstep:opacity-100 transition-opacity self-start p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500"
              >
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
              </button>
            </div>
          </div>

          <!-- Add branch step -->
          <button
            @click="addBranchStep(idx)"
            class="text-xs text-amber-600 hover:text-amber-800 hover:underline"
          >+ Add branch step</button>
        </div>
        </template>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useWorkflowStore } from '../stores/workflows.js'

// Only focus when the binding value is truthy — prevents all inputs grabbing focus simultaneously in new mode
const vAutoFocus = { mounted: (el, { value }) => { if (value !== false) el.focus({ preventScroll: true }) } }

const route = useRoute()
const router = useRouter()
const store = useWorkflowStore()

// Static route /workflows/new has no :id param, so params.id is undefined — not 'new'
const isNew = computed(() => !route.params.id)
const viewOnly = ref(false)
const editingField = ref(null)
const previousValue = ref(null)
const form = ref({ title: '', description: '', category: '', steps: [] })

onMounted(async () => {
  if (route.params.id) {
    await store.fetchOne(route.params.id)
    populateForm(store.current)
  } else {
    editingField.value = 'title'
  }
})

watch(() => route.params.id, async (id) => {
  editingField.value = null
  if (id) {
    await store.fetchOne(id)
    populateForm(store.current)
  } else {
    form.value = { title: '', description: '', category: '', steps: [] }
    editingField.value = 'title'
  }
})

function populateForm(w) {
  form.value = {
    title: w.title,
    description: w.description || '',
    category: w.category || '',
    steps: w.steps.map((s) => ({
      ...s,
      type: s.type || 'step',
      condition: s.condition || '',
      branchSteps: (s.branchSteps || []).map(b => ({ ...b })),
    })),
  }
}

function parseStepField(field) {
  // branch-N-M-prop  (branch step)
  const branchMatch = field.match(/^branch-(\d+)-(\d+)-(.+)$/)
  if (branchMatch) return { isBranch: true, stepIdx: Number(branchMatch[1]), branchIdx: Number(branchMatch[2]), prop: branchMatch[3] }
  // step-N-prop
  const match = field.match(/^step-(\d+)-(.+)$/)
  if (!match) return null
  return { isBranch: false, idx: Number(match[1]), prop: match[2] }
}

function getFieldValue(field) {
  const step = parseStepField(field)
  if (!step) return form.value[field]
  if (step.isBranch) return form.value.steps[step.stepIdx]?.branchSteps[step.branchIdx]?.[step.prop]
  return form.value.steps[step.idx]?.[step.prop]
}

function setFieldValue(field, value) {
  const step = parseStepField(field)
  if (!step) { form.value[field] = value; return }
  if (step.isBranch) form.value.steps[step.stepIdx].branchSteps[step.branchIdx][step.prop] = value
  else form.value.steps[step.idx][step.prop] = value
}

function startEdit(field) {
  previousValue.value = getFieldValue(field)
  editingField.value = field
}

async function saveField(_field) {
  editingField.value = null
  previousValue.value = null
  if (route.params.id) {
    await store.update(route.params.id, form.value)
  }
}

function cancelEdit(field) {
  if (isNew.value) return
  setFieldValue(field, previousValue.value)
  editingField.value = null
  previousValue.value = null
}

async function addStep() {
  const idx = form.value.steps.length
  form.value.steps.push({ type: 'step', order: idx + 1, title: '', description: '', branchSteps: [] })
  if (!isNew.value) await store.update(route.params.id, form.value)
  editingField.value = `step-${idx}-title`
}

async function addConditionStep() {
  const idx = form.value.steps.length
  form.value.steps.push({ type: 'condition', order: idx + 1, condition: 'New condition', branchSteps: [] })
  if (!isNew.value) await store.update(route.params.id, form.value)
  editingField.value = `step-${idx}-condition`
}

async function removeStep(idx) {
  form.value.steps.splice(idx, 1)
  form.value.steps.forEach((s, i) => (s.order = i + 1))
  if (!isNew.value) await store.update(route.params.id, form.value)
}

async function moveStep(idx, dir) {
  const target = idx + dir
  if (target < 0 || target >= form.value.steps.length) return
  const steps = form.value.steps;
  [steps[idx], steps[target]] = [steps[target], steps[idx]]
  steps.forEach((s, i) => (s.order = i + 1))
  if (!isNew.value) await store.update(route.params.id, form.value)
}

async function addBranchStep(stepIdx) {
  const branch = form.value.steps[stepIdx].branchSteps
  const bIdx = branch.length
  branch.push({ order: bIdx + 1, title: '', description: '' })
  if (!isNew.value) await store.update(route.params.id, form.value)
  editingField.value = `branch-${stepIdx}-${bIdx}-title`
}

async function moveBranchStep(stepIdx, bIdx, dir) {
  const branch = form.value.steps[stepIdx].branchSteps
  const target = bIdx + dir
  if (target < 0 || target >= branch.length) return
  ;[branch[bIdx], branch[target]] = [branch[target], branch[bIdx]]
  branch.forEach((b, i) => (b.order = i + 1))
  if (!isNew.value) await store.update(route.params.id, form.value)
}

async function removeBranchStep(stepIdx, bIdx) {
  form.value.steps[stepIdx].branchSteps.splice(bIdx, 1)
  form.value.steps[stepIdx].branchSteps.forEach((b, i) => (b.order = i + 1))
  if (!isNew.value) await store.update(route.params.id, form.value)
}

const justCreated = ref(false)

async function handleCreate() {
  if (!form.value.title.trim()) return
  const w = await store.create(form.value)
  justCreated.value = true
  router.push(`/workflows/${w._id}`)
}

onBeforeRouteLeave(() => {
  if (!justCreated.value && isNew.value && form.value.title.trim()) {
    return confirm('You have unsaved changes. Leave without creating the workflow?')
  }
})

async function handleDelete() {
  if (!confirm('Delete this workflow?')) return
  await store.remove(route.params.id)
  router.push('/')
}
</script>

<style scoped>
.view-only button:not(.view-toggle) {
  display: none;
}
.view-only p[class*="text-gray-300"] {
  display: none;
}
</style>
