import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  semester: { type: Number, required: true, min: 1, max: 8, validate: Number.isInteger },
  department: { type: String, required: true, enum: ['CSE', 'IT', 'AI/ML', 'CE', 'ECE', 'Mechanical', 'Other'] },
  satisfaction: { type: String, required: true, enum: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
  academicExperience: { type: String, required: true, trim: true, maxlength: 2000 },
  campusLife: { type: String, required: true, trim: true, maxlength: 2000 },
  favoriteThing: { type: String, required: true, trim: true, maxlength: 2000 },
  improvements: { type: String, required: true, trim: true, maxlength: 2000 },
  overallRating: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
