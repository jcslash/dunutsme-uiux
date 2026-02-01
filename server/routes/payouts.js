import express from 'express';
import { eq, desc } from 'drizzle-orm';
import db from '../config/database.js';
import { stripeAccounts, payouts } from '../models/schema.js';
import * as stripeService from '../services/stripeService.js';
import { authenticatePrivyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/payouts/create
 * 創建提現請求
 */
router.post('/create', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    const { amount, currency = 'usd' } = req.body;
    
    // 驗證金額
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be greater than 0',
      });
    }
    
    // 獲取 Stripe 賬戶
    const account = await db.select()
      .from(stripeAccounts)
      .where(eq(stripeAccounts.userId, privyId))
      .limit(1);
    
    if (account.length === 0) {
      return res.status(404).json({
        error: 'Account not found',
        message: 'Please complete Stripe onboarding first',
      });
    }
    
    const stripeAccount = account[0];
    
    // 檢查賬戶是否已完成入駐
    if (!stripeAccount.onboardingCompleted) {
      return res.status(400).json({
        error: 'Onboarding incomplete',
        message: 'Please complete Stripe onboarding before requesting a payout',
      });
    }
    
    // 檢查是否啟用提現
    if (!stripeAccount.payoutsEnabled) {
      return res.status(400).json({
        error: 'Payouts not enabled',
        message: 'Payouts are not enabled for your account',
      });
    }
    
    // 轉換金額為最小單位
    const amountInCents = stripeService.parseAmount(amount);
    
    // 創建提現
    const payout = await stripeService.createPayout(
      stripeAccount.id,
      amountInCents,
      currency,
      {
        userId: privyId,
      }
    );
    
    // 保存到數據庫
    await db.insert(payouts).values({
      id: payout.id,
      userId: privyId,
      stripeAccountId: stripeAccount.id,
      amount: payout.amount.toString(),
      currency: payout.currency,
      status: payout.status,
      arrivalDate: payout.arrival_date ? new Date(payout.arrival_date * 1000) : null,
      method: payout.method,
      destinationType: payout.destination ? 'bank_account' : null,
      destinationId: payout.destination,
      metadata: JSON.stringify(payout),
    });
    
    res.json({
      success: true,
      payout: {
        id: payout.id,
        amount: stripeService.formatAmount(payout.amount, payout.currency),
        currency: payout.currency,
        status: payout.status,
        arrivalDate: payout.arrival_date,
      },
    });
  } catch (error) {
    console.error('Error creating payout:', error);
    res.status(500).json({
      error: 'Failed to create payout',
      message: error.message,
    });
  }
});

/**
 * GET /api/payouts
 * 獲取提現歷史
 */
router.get('/', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    const limit = parseInt(req.query.limit) || 20;
    
    // 從數據庫獲取提現記錄
    const payoutsList = await db.select()
      .from(payouts)
      .where(eq(payouts.userId, privyId))
      .orderBy(desc(payouts.createdAt))
      .limit(limit);
    
    // 格式化數據
    const formattedPayouts = payoutsList.map(p => ({
      id: p.id,
      amount: stripeService.formatAmount(parseInt(p.amount), p.currency),
      currency: p.currency,
      status: p.status,
      arrivalDate: p.arrivalDate,
      method: p.method,
      failureCode: p.failureCode,
      failureMessage: p.failureMessage,
      createdAt: p.createdAt,
    }));
    
    res.json({
      success: true,
      payouts: formattedPayouts,
    });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    res.status(500).json({
      error: 'Failed to fetch payouts',
      message: error.message,
    });
  }
});

/**
 * GET /api/payouts/:payoutId
 * 獲取特定提現詳情
 */
router.get('/:payoutId', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    const { payoutId } = req.params;
    
    // 從數據庫獲取提現記錄
    const payout = await db.select()
      .from(payouts)
      .where(eq(payouts.id, payoutId))
      .limit(1);
    
    if (payout.length === 0) {
      return res.status(404).json({
        error: 'Payout not found',
        message: 'The specified payout does not exist',
      });
    }
    
    // 驗證所有權
    if (payout[0].userId !== privyId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this payout',
      });
    }
    
    // 格式化數據
    const formattedPayout = {
      id: payout[0].id,
      amount: stripeService.formatAmount(parseInt(payout[0].amount), payout[0].currency),
      currency: payout[0].currency,
      status: payout[0].status,
      arrivalDate: payout[0].arrivalDate,
      method: payout[0].method,
      destinationType: payout[0].destinationType,
      failureCode: payout[0].failureCode,
      failureMessage: payout[0].failureMessage,
      createdAt: payout[0].createdAt,
      updatedAt: payout[0].updatedAt,
    };
    
    res.json({
      success: true,
      payout: formattedPayout,
    });
  } catch (error) {
    console.error('Error fetching payout:', error);
    res.status(500).json({
      error: 'Failed to fetch payout',
      message: error.message,
    });
  }
});

export default router;
