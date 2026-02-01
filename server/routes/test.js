import express from 'express';
import { authenticatePrivyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/test/auth
 * 測試認證是否正常工作
 */
router.get('/auth', authenticatePrivyToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Authentication successful',
    user: req.user,
  });
});

/**
 * GET /api/test/no-auth
 * 測試無需認證的端點
 */
router.get('/no-auth', async (req, res) => {
  res.json({
    success: true,
    message: 'No authentication required',
  });
});

export default router;
