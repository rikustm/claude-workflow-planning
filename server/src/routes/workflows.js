import { Router } from 'express'
import Workflow from '../models/Workflow.js'

const router = Router()

router.get('/', async (_req, res) => {
  const workflows = await Workflow.find().sort({ createdAt: -1 })
  res.json(workflows)
})

router.get('/:id', async (req, res) => {
  const workflow = await Workflow.findById(req.params.id)
  if (!workflow) return res.status(404).json({ message: 'Not found' })
  res.json(workflow)
})

router.post('/', async (req, res) => {
  const workflow = await Workflow.create(req.body)
  res.status(201).json(workflow)
})

router.put('/:id', async (req, res) => {
  const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!workflow) return res.status(404).json({ message: 'Not found' })
  res.json(workflow)
})

router.delete('/:id', async (req, res) => {
  await Workflow.findByIdAndDelete(req.params.id)
  res.status(204).send()
})

export default router
