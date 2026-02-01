import Stripe from 'stripe';

// 初始化 Stripe 客戶端
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * 創建 Stripe Connect 賬戶
 */
export async function createConnectAccount(userId, email, country = 'US') {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: country,
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        userId: userId,
      },
    });
    
    return account;
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error);
    throw error;
  }
}

/**
 * 創建 Stripe Connect 入駐鏈接
 */
export async function createAccountLink(accountId, refreshUrl, returnUrl) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
    
    return accountLink;
  } catch (error) {
    console.error('Error creating account link:', error);
    throw error;
  }
}

/**
 * 獲取 Stripe 賬戶信息
 */
export async function getAccount(accountId) {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    return account;
  } catch (error) {
    console.error('Error retrieving Stripe account:', error);
    throw error;
  }
}

/**
 * 創建登入鏈接（用於訪問 Stripe Express Dashboard）
 */
export async function createLoginLink(accountId) {
  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    return loginLink;
  } catch (error) {
    console.error('Error creating login link:', error);
    throw error;
  }
}

/**
 * 創建提現
 */
export async function createPayout(accountId, amount, currency = 'usd', metadata = {}) {
  try {
    const payout = await stripe.payouts.create(
      {
        amount: amount, // 金額（最小單位，如 cents）
        currency: currency,
        metadata: metadata,
      },
      {
        stripeAccount: accountId,
      }
    );
    
    return payout;
  } catch (error) {
    console.error('Error creating payout:', error);
    throw error;
  }
}

/**
 * 獲取提現詳情
 */
export async function getPayout(accountId, payoutId) {
  try {
    const payout = await stripe.payouts.retrieve(
      payoutId,
      {
        stripeAccount: accountId,
      }
    );
    
    return payout;
  } catch (error) {
    console.error('Error retrieving payout:', error);
    throw error;
  }
}

/**
 * 列出提現歷史
 */
export async function listPayouts(accountId, limit = 10) {
  try {
    const payouts = await stripe.payouts.list(
      {
        limit: limit,
      },
      {
        stripeAccount: accountId,
      }
    );
    
    return payouts;
  } catch (error) {
    console.error('Error listing payouts:', error);
    throw error;
  }
}

/**
 * 獲取賬戶餘額
 */
export async function getBalance(accountId) {
  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });
    
    return balance;
  } catch (error) {
    console.error('Error retrieving balance:', error);
    throw error;
  }
}

/**
 * 創建轉賬（從平台賬戶到創作者賬戶）
 */
export async function createTransfer(accountId, amount, currency = 'usd', metadata = {}) {
  try {
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: currency,
      destination: accountId,
      metadata: metadata,
    });
    
    return transfer;
  } catch (error) {
    console.error('Error creating transfer:', error);
    throw error;
  }
}

/**
 * 驗證 Stripe webhook 簽名
 */
export function constructWebhookEvent(payload, signature, secret) {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}

/**
 * 格式化金額（從最小單位轉換為標準單位）
 */
export function formatAmount(amount, currency = 'usd') {
  // 大多數貨幣使用 2 位小數
  const divisor = 100;
  return (amount / divisor).toFixed(2);
}

/**
 * 解析金額（從標準單位轉換為最小單位）
 */
export function parseAmount(amount) {
  // 轉換為 cents
  return Math.round(parseFloat(amount) * 100);
}

export default {
  createConnectAccount,
  createAccountLink,
  getAccount,
  createLoginLink,
  createPayout,
  getPayout,
  listPayouts,
  getBalance,
  createTransfer,
  constructWebhookEvent,
  formatAmount,
  parseAmount,
};
