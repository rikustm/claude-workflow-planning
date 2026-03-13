import { defineStore } from 'pinia'
import axios from 'axios'

export const useWorkflowStore = defineStore('workflows', {
  state: () => ({
    workflows: [],
    current: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const { data } = await axios.get('/api/workflows')
        this.workflows = data
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async fetchOne(id) {
      this.loading = true
      try {
        const { data } = await axios.get(`/api/workflows/${id}`)
        this.current = data
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      const { data } = await axios.post('/api/workflows', payload)
      this.workflows.unshift(data)
      return data
    },
    async update(id, payload) {
      const { data } = await axios.put(`/api/workflows/${id}`, payload)
      const idx = this.workflows.findIndex(w => w._id === id)
      if (idx !== -1) this.workflows[idx] = data
      this.current = data
      return data
    },
    async remove(id) {
      await axios.delete(`/api/workflows/${id}`)
      this.workflows = this.workflows.filter(w => w._id !== id)
    },
  },
})
