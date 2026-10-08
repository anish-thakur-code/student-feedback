import Feedback from '../models/Feedback.model.js';

const requiredFields = [
  'studentName', 'email', 'semester', 'department', 'satisfaction',
  'academicExperience', 'campusLife', 'favoriteThing', 'improvements', 'overallRating',
];
const stringFields = [
  'studentName', 'email', 'department', 'satisfaction', 'academicExperience',
  'campusLife', 'favoriteThing', 'improvements',
];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createFeedback(req, res, next) {
  try {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
      ? req.body
      : {};
    const invalidStringFields = stringFields.filter((field) =>
      body[field] !== undefined && body[field] !== null && typeof body[field] !== 'string');
    if (invalidStringFields.length) {
      return res.status(400).json({
        success: false,
        message: 'Text fields must contain valid text.',
        fields: invalidStringFields,
      });
    }

    const missingFields = requiredFields.filter((field) => {
      const value = body[field];

      return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      );
    });

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
        fields: missingFields,
      });
    }

    const normalizedEmail = typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
        fields: ['email'],
      });
    }

    if (
      !Number.isInteger(Number(body.semester)) ||
      Number(body.semester) < 1 ||
      Number(body.semester) > 8
    ) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be a whole number from 1 to 8.',
        fields: ['semester'],
      });
    }

    if (
      !Number.isInteger(Number(body.overallRating)) ||
      Number(body.overallRating) < 1 ||
      Number(body.overallRating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: 'Overall rating must be a whole number from 1 to 5.',
        fields: ['overallRating'],
      });
    }

    const existingFeedback = await Feedback.findOne({ email: normalizedEmail }).select('_id').lean();
    if (existingFeedback) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted feedback using this email address.',
      });
    }

    // 1️⃣ Save feedback to MongoDB
    const feedback = await Feedback.create({
      studentName: body.studentName.trim(),
      email: normalizedEmail,
      semester: Number(body.semester),
      department: body.department.trim(),
      satisfaction: body.satisfaction.trim(),
      academicExperience: body.academicExperience.trim(),
      campusLife: body.campusLife.trim(),
      favoriteThing: body.favoriteThing.trim(),
      improvements: body.improvements.trim(),
      overallRating: Number(body.overallRating),
    });

    // 2️⃣ Send feedback to n8n
    try {
      if (process.env.N8N_WEBHOOK_URL) {
        const webhookResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentName: feedback.studentName,
            email: feedback.email,
            semester: feedback.semester,
            department: feedback.department,
            satisfaction: feedback.satisfaction,
            academicExperience: feedback.academicExperience,
            campusLife: feedback.campusLife,
            favoriteThing: feedback.favoriteThing,
            improvements: feedback.improvements,
            overallRating: feedback.overallRating,
            createdAt: feedback.createdAt,
            mongoId: feedback._id,
            ...(process.env.ADMIN_EMAIL ? { adminEmail: process.env.ADMIN_EMAIL } : {}),
          }),
        });
        if (!webhookResponse.ok) {
          throw new Error(`Webhook returned HTTP ${webhookResponse.status}`);
        }
      }
    } catch (n8nError) {
      console.error('n8n webhook failed:', n8nError.name || 'Error');
    }

    // 3️⃣ Send response to React
    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const fields = Object.keys(error.errors || {});
      return res.status(400).json({
        success: false,
        message: 'Please check the submitted feedback fields.',
        ...(fields.length ? { fields } : {}),
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid value for ${error.path}.`,
        fields: [error.path],
      });
    }

    return next(error);
  }
}

export async function getFeedback(_req, res, next) {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, count: feedback.length, data: feedback });
  } catch (error) {
    return next(error);
  }
}
