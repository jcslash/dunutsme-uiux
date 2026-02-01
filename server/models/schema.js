import { mysqlTable, varchar, text, boolean, timestamp, int, json, index, uniqueIndex } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }),
  bio: text('bio'),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  usernameIdx: index('idx_users_username').on(table.username),
  emailIdx: index('idx_users_email').on(table.email),
}));

// Wallets table
export const wallets = mysqlTable('wallets', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  chainType: varchar('chain_type', { length: 50 }).notNull(),
  walletType: varchar('wallet_type', { length: 50 }).notNull(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_wallets_user_id').on(table.userId),
  addressIdx: index('idx_wallets_address').on(table.address),
}));

// Wallet balances table
export const walletBalances = mysqlTable('wallet_balances', {
  id: int('id').primaryKey().autoincrement(),
  walletId: varchar('wallet_id', { length: 255 }).notNull(),
  chain: varchar('chain', { length: 50 }).notNull(),
  asset: varchar('asset', { length: 50 }).notNull(),
  rawValue: varchar('raw_value', { length: 100 }).notNull(),
  rawValueDecimals: int('raw_value_decimals').notNull(),
  displayValueNative: varchar('display_value_native', { length: 50 }),
  displayValueUsd: varchar('display_value_usd', { length: 50 }),
  snapshotAt: timestamp('snapshot_at').defaultNow(),
}, (table) => ({
  walletIdIdx: index('idx_wallet_balances_wallet_id').on(table.walletId),
  snapshotAtIdx: index('idx_wallet_balances_snapshot_at').on(table.snapshotAt),
}));

// Transactions table
export const transactions = mysqlTable('transactions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  walletId: varchar('wallet_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  chain: varchar('chain', { length: 50 }).notNull(),
  asset: varchar('asset', { length: 50 }).notNull(),
  amount: varchar('amount', { length: 100 }).notNull(),
  amountDecimals: int('amount_decimals').notNull(),
  displayAmountNative: varchar('display_amount_native', { length: 50 }),
  displayAmountUsd: varchar('display_amount_usd', { length: 50 }),
  fromAddress: varchar('from_address', { length: 255 }),
  toAddress: varchar('to_address', { length: 255 }),
  txHash: varchar('tx_hash', { length: 255 }),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  walletIdIdx: index('idx_transactions_wallet_id').on(table.walletId),
  userIdIdx: index('idx_transactions_user_id').on(table.userId),
  typeIdx: index('idx_transactions_type').on(table.type),
  statusIdx: index('idx_transactions_status').on(table.status),
  createdAtIdx: index('idx_transactions_created_at').on(table.createdAt),
}));

// Stripe accounts table
export const stripeAccounts = mysqlTable('stripe_accounts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),
  accountType: varchar('account_type', { length: 50 }).notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  chargesEnabled: boolean('charges_enabled').default(false),
  payoutsEnabled: boolean('payouts_enabled').default(false),
  country: varchar('country', { length: 10 }),
  currency: varchar('currency', { length: 10 }),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: uniqueIndex('idx_stripe_accounts_user_id').on(table.userId),
}));

// Payouts table
export const payouts = mysqlTable('payouts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  stripeAccountId: varchar('stripe_account_id', { length: 255 }).notNull(),
  amount: varchar('amount', { length: 100 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  arrivalDate: timestamp('arrival_date'),
  method: varchar('method', { length: 50 }),
  destinationType: varchar('destination_type', { length: 50 }),
  destinationId: varchar('destination_id', { length: 255 }),
  failureCode: varchar('failure_code', { length: 50 }),
  failureMessage: text('failure_message'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_payouts_user_id').on(table.userId),
  statusIdx: index('idx_payouts_status').on(table.status),
  createdAtIdx: index('idx_payouts_created_at').on(table.createdAt),
}));

// BTC conversions table
export const btcConversions = mysqlTable('btc_conversions', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  walletId: varchar('wallet_id', { length: 255 }).notNull(),
  transactionId: varchar('transaction_id', { length: 255 }),
  fromAsset: varchar('from_asset', { length: 50 }).notNull(),
  toAsset: varchar('to_asset', { length: 50 }).notNull(),
  fromAmount: varchar('from_amount', { length: 100 }).notNull(),
  toAmount: varchar('to_amount', { length: 100 }).notNull(),
  exchangeRate: varchar('exchange_rate', { length: 50 }),
  exchangeProvider: varchar('exchange_provider', { length: 50 }),
  status: varchar('status', { length: 50 }).notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  userIdIdx: index('idx_btc_conversions_user_id').on(table.userId),
  statusIdx: index('idx_btc_conversions_status').on(table.status),
  createdAtIdx: index('idx_btc_conversions_created_at').on(table.createdAt),
}));

// User settings table
export const userSettings = mysqlTable('user_settings', {
  userId: varchar('user_id', { length: 255 }).primaryKey(),
  autoConvertBtc: boolean('auto_convert_btc').default(false),
  payoutSchedule: varchar('payout_schedule', { length: 50 }).default('manual'),
  notificationEmail: boolean('notification_email').default(true),
  notificationTransaction: boolean('notification_transaction').default(true),
  notificationPayout: boolean('notification_payout').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
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
