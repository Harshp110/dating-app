# Database

Prisma schema: `prisma/schema.prisma`.

Core profile models are `User`, `Profile`, `EngineeringEducation`, `Employment`, `Interest`, `ProfileInterest`, `Preference`, `Verification`, and `Photo`.

Discovery and progression models are `Discovery`, `InterestAction`, `Connection`, `MicroQuestion`, and `QuestionAnswer`.

Interaction and safety models are `Conversation`, `Message`, `DatePlan`, `MeetingFeedback`, `Block`, and `Report`.

Use `npm run db:validate`, `npm run db:generate`, and `npm run db:push` after setting `DATABASE_URL`. Use `npm run db:seed` for fictional local data.