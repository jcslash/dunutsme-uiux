import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  email: text('email'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  usernameIdx: index('idx_users_username').on(table.username),
  emailIdx: index('idx_users_email').on(table.email),
}));

// Wallets table
export const wallets = sqliteTable('wallets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  address: text('address').notNull(),
  chainType: text('chain_type').notNull(),
  walletType: text('wallet_type').notNull(),
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index('idx_wallets_user_id').on(table.userId),
  addressIdx: index('idx_wallets_address').on(table.address),
}));

// Wallet balances table
export const walletBalances = sqliteTable('wallet_balances', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  walletId: text('wallet_id').notNull(),
  chain: text('chain').notNull(),
  asset: text('asset').notNull(),
  rawValue: text('raw_value').notNull(),
  rawValueDecimals: integer('raw_value_decimals').notNull(),
  displayValueNative: text('display_value_native'),
  displayValueUsd: text('display_value_usd'),
  snapshotAt: integer('snapshot_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  walletIdIdx: index('idx_wallet_balances_wallet_id').on(table.walletId),
}));

// Transactions table
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  walletId: text('wallet_id').notNull(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  chain: text('chain').notNull(),
  asset: text('asset').notNull(),
  amount: text('amount').notNull(),
  amountDecimals: integer('amount_decimals').notNull(),
  displayAmountNative: text('display_amount_native'),
  displayAmountUsd: text('display_amount_usd'),
  fromAddress: text('from_address'),
  toAddress: text('to_address'),
  txHash: text('tx_hash'),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
}, (table) => ({
  walletIdIdx: index('idx_transactions_wallet_id').on(table.walletId),
  userIdIdx: index('idx_transactions_user_id').on(table.userId),
}));

// Stripe accounts table
export const stripeAccounts = sqliteTable('stripe_accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  accountType: text('account_type').notNull(),
  onboardingCompleted: integer('onboarding_completed', { mode: 'boolean' }).default(false),
  chargesEnabled: integer('charges_enabled', { mode: 'boolean' }).default(false),
  payoutsEnabled: integer('payouts_enabled', { mode: 'boolean' }).default(false),
  country: text('country'),
  currency: text('currency'),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index('idx_stripe_accounts_user_id').on(table.userId),
}));

// Payouts table
export const payouts = sqliteTable('payouts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  stripeAccountId: text('stripe_account_id').notNull(),
  amount: text('amount').notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull(),
  arrivalDate: integer('arrival_date', { mode: 'timestamp' }),
  method: text('method'),
  destinationType: text('destination_type'),
  destinationId: text('destination_id'),
  failureCode: text('failure_code'),
  failureMessage: text('failure_message'),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index('idx_payouts_user_id').on(table.userId),
}));

// BTC conversions table
export const btcConversions = sqliteTable('btc_conversions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  walletId: text('wallet_id').notNull(),
  transactionId: text('transaction_id'),
  fromAsset: text('from_asset').notNull(),
  toAsset: text('to_asset').notNull(),
  fromAmount: text('from_amount').notNull(),
  toAmount: text('to_amount').notNull(),
  exchangeRate: text('exchange_rate'),
  exchangeProvider: text('exchange_provider'),
  status: text('status').notNull(),
  errorMessage: text('error_message'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

// User settings table
export const userSettings = sqliteTable('user_settings', {
  userId: text('user_id').primaryKey(),
  autoConvertBtc: integer('auto_convert_btc', { mode: 'boolean' }).default(false),
  payoutSchedule: text('payout_schedule').default('manual'),
  notificationEmail: integer('notification_email', { mode: 'boolean' }).default(true),
  notificationTransaction: integer('notification_transaction', { mode: 'boolean' }).default(true),
  notificationPayout: integer('notification_payout', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  wallets: many(wallets),
  transactions: many(transactions),
  stripeAccount: one(stripeAccounts),
  payouts: many(payouts),
  btcConversions: many(btcConversions),
  settings: one(userSettings),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  balances: many(walletBalances),
  transactions: many(transactions),
  btcConversions: many(btcConversions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
}));

export const stripeAccountsRelations = relations(stripeAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [stripeAccounts.userId],
    references: [users.id],
  }),
  payouts: many(payouts),
}));

export const payoutsRelations = relations(payouts, ({ one }) => ({
  user: one(users, {
    fields: [payouts.userId],
    references: [users.id],
  }),
  stripeAccount: one(stripeAccounts, {
    fields: [payouts.stripeAccountId],
    references: [stripeAccounts.id],
  }),
}));
