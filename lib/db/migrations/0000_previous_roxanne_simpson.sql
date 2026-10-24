CREATE TYPE "public"."role" AS ENUM('USER', 'MODERATOR', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "password_reset_token" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "password_reset_token_id_unique" UNIQUE("id"),
	CONSTRAINT "password_reset_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"content" text,
	"image" text,
	"price" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user_id" text NOT NULL,
	"status" "status" DEFAULT 'INACTIVE',
	CONSTRAINT "post_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"post_id" text NOT NULL,
	"rating" numeric NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "reviews_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"stripe_status" text NOT NULL,
	"amount" numeric NOT NULL,
	"purchase_date" timestamp DEFAULT now() NOT NULL,
	"payment_status" text NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" text NOT NULL,
	"post_id" text NOT NULL,
	"subscription_plan_id" text,
	CONSTRAINT "transaction_id_unique" UNIQUE("id"),
	CONSTRAINT "transaction_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "two_factor_confirmation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "two_factor_confirmation_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "two_factor_token" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "two_factor_token_id_unique" UNIQUE("id"),
	CONSTRAINT "two_factor_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"password" text,
	"last_name" text,
	"image" text,
	"is_subscribed" boolean DEFAULT false,
	"login_attempts" integer DEFAULT 0,
	"lock_until" timestamp,
	"last_login" timestamp DEFAULT now(),
	"is_two_factor_enabled" boolean DEFAULT false,
	"two_factor_confirmation_id" text,
	"stripe_customer_id" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"role" "role" DEFAULT 'USER',
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_email_token_pk" PRIMARY KEY("email","token"),
	CONSTRAINT "verification_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor_confirmation" ADD CONSTRAINT "two_factor_confirmation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;