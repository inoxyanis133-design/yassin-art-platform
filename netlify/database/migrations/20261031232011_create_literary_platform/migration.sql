CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"buyer_email" text NOT NULL,
	"book_id" text NOT NULL,
	"book_title" text NOT NULL,
	"seller_id" text,
	"amount_mad" integer DEFAULT 30 NOT NULL,
	"fee_usd" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_reference" text,
	"payout_status" text DEFAULT 'not_due' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"confirmed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"author" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"kind" text DEFAULT 'text' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "orders_user_idx" ON "orders" ("user_id");--> statement-breakpoint
CREATE INDEX "orders_seller_idx" ON "orders" ("seller_id");--> statement-breakpoint
CREATE INDEX "submissions_status_idx" ON "submissions" ("status");--> statement-breakpoint
CREATE INDEX "submissions_user_idx" ON "submissions" ("user_id");