import { Router } from 'express';
import { createFeedback, getFeedback } from '../controllers/feedback.controller.js';
import feedbackRateLimit from '../middleware/feedbackRateLimit.js';

const router = Router();

router.get('/', getFeedback);
router.post('/', feedbackRateLimit, createFeedback);

export default router;
