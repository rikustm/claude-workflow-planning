import mongoose from 'mongoose'

const branchStepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
})

const stepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  type: { type: String, enum: ['step', 'condition'], default: 'step' },
  title: String,
  description: String,
  condition: String,
  branchSteps: [branchStepSchema],
})

const workflowSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    steps: [stepSchema],
  },
  { timestamps: true }
)

export default mongoose.model('Workflow', workflowSchema)
