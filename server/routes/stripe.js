import express from 'express';
import { eq } from 'drizzle-orm';
import db from '../config/database.js';
import { stripeAccounts, payouts } from '../models/schema.js';
import * as stripeService from '../services/stripeService.js';
import { authenticatePrivyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/stripe/onboard
 * 開始 Stripe Connect 入駐流程
 */
router.post('/onboard', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    const { email, country = 'US' } = req.body;
    
    // 檢查是否已有 Stripe 賬戶
    const existingAccount = await db.select()
      .from(stripeAccounts)
      .where(eq(stripeAccounts.userId, privyId))
      .limit(1);
    
    let accountId;
    
    if (existingAccount.length > 0) {
      // 使用現有賬戶
      accountId = existingAccount[0].id;
    } else {
      // 創建新的 Stripe Connect 賬戶
      const account = await stripeService.createConnectAccount(privyId, email, country);
      accountId = account.id;
      
      // 保存到數據庫
      await db.insert(stripeAccounts).values({
        id: accountId,
        userId: privyId,
        accountType: 'express',
        onboardingCompleted: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        country: country,
        currency: 'usd',
        metadata: JSON.stringify(account),
      });
    }
    
    // 創建入駐鏈接
    const refreshUrl = `${process.env.CLIENT_URL}/dashboard/payouts?refresh=true`;
    const returnUrl = `${process.env.CLIENT_URL}/dashboard/payouts?success=true`;
    
    const accountLink = await stripeService.createAccountLink(accountId, refreshUrl, returnUrl);
    
    res.json({
      success: true,
      url: accountLink.url,
      accountId: accountId,
    });
  } catch (error) {
    console.error('Error starting Stripe onboarding:', error);
    res.status(500).json({
      error: 'Failed to start onboarding',
      message: error.message,
    });
  }
});

/**
 * GET /api/stripe/account
 * 獲取 Stripe 賬戶狀態
 */
router.get('/account', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    // 從數據庫獲取賬戶
    const account = await db.select()
      .from(stripeAccounts)
      .where(eq(stripeAccounts.userId, privyId))
      .limit(1);
    
    if (account.length === 0) {
      return res.status(404).json({
        error: 'Account not found',
        message: 'No Stripe account found for this user',
      });
    }
    
    // 從 Stripe 獲取最新狀態
    const stripeAccount = await stripeService.getAccount(account[0].id);
    
    // 更新數據庫
    await db.update(stripeAccounts)
      .set({
        onboardingCompleted: stripeAccount.details_submitted,
        chargesEnabled: stripeAccount.charges_enabled,
        payoutsEnabled: stripeAccount.payouts_enabled,
        metadata: JSON.stringify(stripeAccount),
        updatedAt: new Date(),
      })
      .where(eq(stripeAccounts.id, account[0].id));
    
    res.json({
      success: true,
      account: {
        id: stripeAccount.id,
        onboardingCompleted: stripeAccount.details_submitted,
        chargesEnabled: stripeAccount.charges_enabled,
        payoutsEnabled: stripeAccount.payouts_enabled,
        country: stripeAccount.country,
        currency: stripeAccount.default_currency,
      },
    });
  } catch (error) {
    console.error('Error fetching Stripe account:', error);
    res.status(500).json({
      error: 'Failed to fetch account',
      message: error.message,
    });
  }
});

/**
 * POST /api/stripe/refresh-url
 * 刷新入駐鏈接
 */
router.post('/refresh-url', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    // 獲取賬戶
    const account = await db.select()
      .from(stripeAccounts)
      .where(eq(stripeAccounts.userId, privyId))
      .limit(1);
    
    if (account.length === 0) {
      return res.status(404).json({
        error: 'Account not found',
        message: 'No Stripe account found for this user',
      });
    }
    
    // 創建新的入駐鏈接
    const refreshUrl = `${process.env.CLIENT_URL}/dashboard/payouts?refresh=true`;
    const returnUrl = `${process.env.CLIENT_URL}/dashboard/payouts?success=true`;
    
    const accountLink = await stripeService.createAccountLink(account[0].id, refreshUrl, returnUrl);
    
    res.json({
      success: true,
      url: accountLink.url,
    });
  } catch (error) {
    console.error('Error refreshing onboarding URL:', error);
    res.status(500).json({
      error: 'Failed to refresh URL',
      message: error.message,
    });
  }
});

/**
 * GET /api/stripe/dashboard-url
 * 獲取 Stripe Express Dashboard URL
 */
router.get('/dashboard-url', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    // 獲取賬戶
    const account = await db.select()
      .from(stripeAccounts)
      .where(eq(stripeAccounts.userId, privyId))
      .limit(1);
    
    if (account.length === 0) {
      return res.status(404).json({
        error: 'Account not found',
        message: 'No Stripe account found for this user',
      });
    }
    
    // 創建登入鏈接
    const loginLink = await stripeService.createLoginLink(account[0].id);
    
    res.json({
      success: true,
      url: loginLink.url,
    });
  } catch (error) {
    console.error('Error creating dashboard URL:', error);
    res.status(500).json({
      error: 'Failed to create dashboard URL',
      message: error.message,
    });
  }
});

/**
 * GET /api/stripe/balance
 * 獲取 Stripe 賬戶餘額
 */
router.get('/balance', authenticatePrivyToken, async (req, res) => {
  try {
    const privyId = req.user.privyId;
    
    // 獲取賬戶
    const account = await db.select()
      .from(stripeAccounts)
      .where(eq(stripeAccounts.userId, privyId))
      .limit(1);
    
    if (account.length === 0) {
      return res.status(404).json({
        error: 'Account not found',
        message: 'No Stripe account found for this user',
      });
    }
    
    // 獲取餘額
    const balance = await stripeService.getBalance(account[0].id);
    
    res.json({
      success: true,
      balance: {
        available: balance.available.map(b => ({
          amount: stripeService.formatAmount(b.amount, b.currency),
          currency: b.currency,
        })),
        pending: balance.pending.map(b => ({
          amount: stripeService.formatAmount(b.amount, b.currency),
          currency: b.currency,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching Stripe balance:', error);
    res.status(500).json({
      error: 'Failed to fetch balance',
      message: error.message,
    });
  }
});

/**
 * POST /api/stripe/webhook
 * Stripe webhook 端點
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    // 驗證 webhook 簽名
    const event = stripeService.constructWebhookEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // 處理不同的事件類型
    switch (event.type) {
      case 'account.updated':
        await handleAccountUpdated(event.data.object);
        break;
      
      case 'payout.created':
      case 'payout.updated':
      case 'payout.paid':
      case 'payout.failed':
      case 'payout.canceled':
        await handlePayoutEvent(event.type, event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      error: 'Webhook error',
      message: error.message,
    });
  }
});

/**
 * 處理賬戶更新事件
 */
async function handleAccountUpdated(account) {
  try {
    await db.update(stripeAccounts)
      .set({
        onboardingCompleted: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        metadata: JSON.stringify(account),
        updatedAt: new Date(),
      })
      .where(eq(stripeAccounts.id, account.id));
    
    console.log(`Account ${account.id} updated`);
  } catch (error) {
    console.error('Error handling account update:', error);
  }
}

/**
 * 處理提現事件
 */
async function handlePayoutEvent(eventType, payout) {
  try {
    const userId = payout.metadata?.userId;
    if (!userId) {
      console.warn('Payout missing userId in metadata');
      return;
    }
    
    // 獲取 Stripe 賬戶
    const account = await db.select()
      .from(stripeAccounts)
      .where(eq(stripeAccounts.id, payout.destination))
      .limit(1);
    
    if (account.length === 0) {
      console.warn(`Stripe account ${payout.destination} not found in database`);
      return;
    }
    
    const stripeAccountId = account[0].id;
    const actualUserId = account[0].userId;
    
    // 檢查提現記錄是否已存在
    const existingPayout = await db.select()
      .from(payouts)
      .where(eq(payouts.id, payout.id))
      .limit(1);
    
    if (existingPayout.length === 0) {
      // 創建新記錄
      await db.insert(payouts).values({
        id: payout.id,
        userId: actualUserId,
        stripeAccountId: stripeAccountId,
        amount: payout.amount.toString(),
        currency: payout.currency,
        status: payout.status,
        arrivalDate: payout.arrival_date ? new Date(payout.arrival_date * 1000) : null,
        method: payout.method,
        destinationType: payout.destination ? 'bank_account' : null,
        destinationId: payout.destination,
        failureCode: payout.failure_code,
        failureMessage: payout.failure_message,
        metadata: JSON.stringify(payout),
      });
    } else {
      // 更新現有記錄
      await db.update(payouts)
        .set({
          status: payout.status,
          arrivalDate: payout.arrival_date ? new Date(payout.arrival_date * 1000) : null,
          failureCode: payout.failure_code,
          failureMessage: payout.failure_message,
          metadata: JSON.stringify(payout),
          updatedAt: new Date(),
        })
        .where(eq(payouts.id, payout.id));
    }
    
    console.log(`Payout ${payout.id} ${eventType}`);
  } catch (error) {
    console.error('Error handling payout event:', error);
  }
}

export default router;
