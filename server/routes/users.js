import express from 'express';
import { body, validationResult } from 'express-validator';
import * as userService from '../services/userService.js';
import { authenticatePrivyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/users/register
 * 註冊新用戶
 */
router.post(
  '/register',
  authenticatePrivyToken,
  [
    body('username')
      .isLength({ min: 3, max: 50 })
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username must be 3-50 characters and contain only letters, numbers, underscores, and hyphens'),
    body('displayName').optional().isLength({ max: 100 }),
    body('bio').optional().isLength({ max: 500 }),
    body('email').optional().isEmail(),
  ],
  async (req, res) => {
    console.log('=== Register API called ===');
    console.log('Request body:', req.body);
    console.log('Privy user:', req.user);
    
    try {
      // 驗證輸入
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { username, displayName, bio, email } = req.body;
      const privyId = req.user.privyId;
      
      // 檢查用戶是否已註冊
      const isRegistered = await userService.isUserRegistered(privyId);
      if (isRegistered) {
        return res.status(409).json({
          error: 'User already registered',
          message: 'This Privy account is already registered',
        });
      }
      
      // 創建用戶
      console.log('Calling userService.createUser with:', { privyId, username, displayName, bio, email });
      const user = await userService.createUser(privyId, username, {
        displayName,
        bio,
        email,
      });
      console.log('User created:', user);
      
      // 獲取完整資料
      const profile = await userService.getCompleteUserProfile(privyId);
      
      res.status(201).json({
        success: true,
        user: profile,
      });
    } catch (error) {
      console.error('=== Registration error ===');
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      
      if (error.message === 'Username already taken') {
        return res.status(409).json({
          error: 'Username taken',
          message: 'This username is already in use',
        });
      }
      
      res.status(500).json({
        error: 'Registration failed',
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/users/me
 * 獲取當前用戶資料
 */
router.get('/me', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    const profile = await userService.getCompleteUserProfile(privyId);
    
    if (!profile) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile does not exist',
      });
    }
    
    res.json({
      success: true,
      user: profile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error.message,
    });
  }
});

/**
 * PUT /api/users/me
 * 更新當前用戶資料
 */
router.put(
  '/me',
  authenticatePrivyToken,
  [
    body('displayName').optional().isLength({ max: 100 }),
    body('bio').optional().isLength({ max: 500 }),
    body('email').optional().isEmail(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const privyId = req.user.privyId;
      const updates = req.body;
      
      const updatedUser = await userService.updateUser(privyId, updates);
      
      res.json({
        success: true,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        error: 'Failed to update profile',
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/users/check-username/:username
 * 檢查用戶名是否可用
 */
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!/^[a-zA-Z0-9_-]{3,50}$/.test(username)) {
      return res.status(400).json({
        error: 'Invalid username',
        message: 'Username must be 3-50 characters and contain only letters, numbers, underscores, and hyphens',
      });
    }
    
    const isTaken = await userService.isUsernameTaken(username);
    
    res.json({
      success: true,
      available: !isTaken,
    });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({
      error: 'Failed to check username',
      message: error.message,
    });
  }
});

/**
 * POST /api/users/sync-wallets
 * 同步 Privy 錢包到數據庫
 */
router.post('/sync-wallets', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    const wallets = await userService.syncUserWallets(privyId);
    
    res.json({
      success: true,
      wallets,
    });
  } catch (error) {
    console.error('Error syncing wallets:', error);
    res.status(500).json({
      error: 'Failed to sync wallets',
      message: error.message,
    });
  }
});

/**
 * GET /api/users/settings
 * 獲取用戶設置
 */
router.get('/settings', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    const settings = await userService.getUserSettings(privyId);
    
    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({
      error: 'Failed to fetch settings',
      message: error.message,
    });
  }
});

/**
 * PUT /api/users/settings
 * 更新用戶設置
 */
router.put('/settings', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    const updates = req.body;
    
    const settings = await userService.updateUserSettings(privyId, updates);
    
    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      message: error.message,
    });
  }
});

export default router;
