# LC Buddy
LeetCode Buddy helps you compare your progress in solving LeetCode problems with your friends. It's a fun way to improve your consistency and compete with your friends.

### Inorder to test the application locally:
1. Clone the repository: `git clone https://github.com/actuallyakshat/lc-buddy.git`
2. Install dependencies: `pnpm install`
3. Set Environment Variables:
     ```
     DATABASE_URL=
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
     CLERK_SECRET_KEY=
     LEETCODE_API=
     PEXEL_API_KEY=
     NEXT_PUBLIC_CLERK_SIGN_IN_URL=
     NEXT_PUBLIC_CLERK_SIGN_UP_URL=
     ```
4. Migrate Prisma Scehmas: `pnpm dlx prisma migrate dev --name migration_name` and then `npx prisma generate`  
5. Run the local server: `pnpm dev`

### Tech Stack Used
- Next.js
- Typescript
- Alfa Leetcode API: https://github.com/alfaarghya/alfa-leetcode-api/
- ShadCN UI
- Clerk Auth
- Tailwind
- Pexel's API

### Have any queries?
Feel free to contact me on LinkedIn or Instagram! You can find the link to my socials from my GitHub Profile.
