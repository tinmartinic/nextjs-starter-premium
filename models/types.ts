import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import account from '@/lib/db/schema/account';
import post from '@/lib/db/schema/post';
import review from '@/lib/db/schema/review';
import { passwordResetToken, twoFactorToken, verificationToken } from '@/lib/db/schema/tokens';
import { default as transaction } from '@/lib/db/schema/transaction';
import twoFactorConfirmation from '@/lib/db/schema/two-factor-confirmation';
import user from '@/lib/db/schema/user';

export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}
export enum PostStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type Account = InferSelectModel<typeof account>;
export type User = InferSelectModel<typeof user>;
export type Post = InferSelectModel<typeof post>;
export type Stripe = InferSelectModel<typeof transaction>;
export type Review = InferSelectModel<typeof review>;
export type Transaction = InferSelectModel<typeof transaction>;
export type TwoFactorConfirmation = InferSelectModel<typeof twoFactorConfirmation>;
export type PasswordResetToken = InferSelectModel<typeof passwordResetToken>;
export type VerificationToken = InferSelectModel<typeof verificationToken>;
export type TwoFactorToken = InferSelectModel<typeof twoFactorToken>;

export type NewAccount = InferInsertModel<typeof account>;
export type NewUser = InferInsertModel<typeof user>;
export type NewPost = InferInsertModel<typeof post>;
export type NewStripe = InferInsertModel<typeof transaction>;
export type NewReview = InferInsertModel<typeof review>;
export type NewTransaction = InferInsertModel<typeof transaction>;
export type NewTwoFactorConfirmation = InferInsertModel<typeof twoFactorConfirmation>;
export type NewPasswordResetToken = InferInsertModel<typeof passwordResetToken>;
export type NewVerificationToken = InferInsertModel<typeof verificationToken>;
export type NewTwoFactorToken = InferInsertModel<typeof twoFactorToken>;
