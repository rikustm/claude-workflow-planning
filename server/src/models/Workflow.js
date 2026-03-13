import mongoose from 'mongoose'

const stepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  assignee: String,
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
