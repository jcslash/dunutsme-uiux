import express from 'express';
import * as userService from '../services/userService.js';
import * as walletService from '../services/walletService.js';
import { authenticatePrivyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/wallets
 * 獲取當前用戶的所有錢包
 */
router.get('/', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    const wallets = await userService.getUserWallets(privyId);
    
    res.json({
      success: true,
      wallets,
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({
      error: 'Failed to fetch wallets',
      message: error.message,
    });
  }
});

/**
 * GET /api/wallets/primary
 * 獲取用戶的主錢包
 */
router.get('/primary', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    const wallet = await userService.getUserPrimaryWallet(privyId);
    
    if (!wallet) {
      return res.status(404).json({
        error: 'No wallet found',
        message: 'User does not have any wallets',
      });
    }
    
    res.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error('Error fetching primary wallet:', error);
    res.status(500).json({
      error: 'Failed to fetch primary wallet',
      message: error.message,
    });
  }
});

/**
 * GET /api/wallets/:walletId
 * 獲取特定錢包詳情
 */
router.get('/:walletId', authenticatePrivyToken, async (req, res) => {
  try {
    const { walletId } = req.params;
    const privyId = req.user.privyId;
    
    const wallet = await walletService.getWalletById(walletId);
    
    if (!wallet) {
      return res.status(404).json({
        error: 'Wallet not found',
        message: 'The specified wallet does not exist',
      });
    }
    
    // 驗證錢包所有權
    if (wallet.userId !== privyId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this wallet',
      });
    }
    
    res.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({
      error: 'Failed to fetch wallet',
      message: error.message,
    });
  }
});

/**
 * GET /api/wallets/:walletId/balance
 * 獲取錢包餘額
 */
router.get('/:walletId/balance', authenticatePrivyToken, async (req, res) => {
  try {
    const { walletId } = req.params;
    const privyId = req.user.privyId;
    
    const wallet = await walletService.getWalletById(walletId);
    
    if (!wallet) {
      return res.status(404).json({
        error: 'Wallet not found',
        message: 'The specified wallet does not exist',
      });
    }
    
    // 驗證錢包所有權
    if (wallet.userId !== privyId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this wallet',
      });
    }
    
    const balance = await walletService.getWalletBalance(walletId);
    
    res.json({
      success: true,
      balance,
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({
      error: 'Failed to fetch balance',
      message: error.message,
    });
  }
});

/**
 * GET /api/wallets/:walletId/balance/history
 * 獲取錢包餘額歷史
 */
router.get('/:walletId/balance/history', authenticatePrivyToken, async (req, res) => {
  try {
    const { walletId } = req.params;
    const privyId = req.user.privyId;
    const limit = parseInt(req.query.limit) || 30;
    
    const wallet = await walletService.getWalletById(walletId);
    
    if (!wallet) {
      return res.status(404).json({
        error: 'Wallet not found',
        message: 'The specified wallet does not exist',
      });
    }
    
    // 驗證錢包所有權
    if (wallet.userId !== privyId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this wallet',
      });
    }
    
    const history = await walletService.getWalletBalanceHistory(walletId, limit);
    
    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Error fetching balance history:', error);
    res.status(500).json({
      error: 'Failed to fetch balance history',
      message: error.message,
    });
  }
});

/**
 * GET /api/wallets/total-balance
 * 獲取用戶所有錢包的總餘額
 */
router.get('/total-balance', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    const totalBalance = await walletService.calculateTotalBalance(privyId);
    
    res.json({
      success: true,
      ...totalBalance,
    });
  } catch (error) {
    console.error('Error calculating total balance:', error);
    res.status(500).json({
      error: 'Failed to calculate total balance',
      message: error.message,
    });
  }
});

export default router;
