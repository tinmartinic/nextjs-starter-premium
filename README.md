# nextjs-starter-premium

Two typed Next.js starters with authentication (credentials, Google and Facebook OAuth, email verification, password reset, two-factor codes), a Postgres database and Stripe, sharing the same base. They differ in how Stripe is integrated, so each lives on its own branch.

| Branch | Stripe model | Clone |
|---|---|---|
| [`one-time-payment`](../../tree/one-time-payment) | One-off payments with a payment intent and a recorded transaction | `git clone -b one-time-payment --single-branch https://github.com/tinmartinic/nextjs-starter-premium.git` |
| [`subscription`](../../tree/subscription) | Recurring subscriptions with a customer portal and a webhook that keeps status in sync | `git clone -b subscription --single-branch https://github.com/tinmartinic/nextjs-starter-premium.git` |

Each branch has its own README with setup steps, an `.env.example` and the structure of the project. The simpler kit without OAuth, email and subscriptions is [`nextjs-starter-basic`](https://github.com/tinmartinic/nextjs-starter-basic).

Built in early 2025 as the full-featured kit of a commercial starter series, published as is: Next.js 15, React 19, Tailwind 3, Auth.js v5 beta. `typecheck`, `lint` and `build` pass on both branches.

## Author

Built by [Neviox Digital](https://nevioxdigital.com) ([GitHub](https://github.com/Neviox-Digital-Agency), [LinkedIn](https://www.linkedin.com/in/martinictin/)).

## License

MIT
