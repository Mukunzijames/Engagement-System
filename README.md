![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Mukunzijames/Engagement-System?utm_source=oss&utm_medium=github&utm_campaign=Mukunzijames%2FEngagement-System&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)
![NeonDB](https://img.shields.io/badge/NeonDB-00ADD8?style=flat&logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-4A90E2?style=flat)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![React Email](https://img.shields.io/badge/React_Email-61DAFB?style=flat&logo=react&logoColor=black)
![NextAuth](https://img.shields.io/badge/NextAuth-black?style=flat&logo=next.js&logoColor=white)

## Getting Started
<img width="1440" alt="Screenshot 2025-05-19 at 09 01 29" src="https://github.com/user-attachments/assets/b8a179c8-ca01-4f35-bfd9-270b35f7f891" />
<img width="1440" alt="Screenshot 2025-05-19 at 09 03 08" src="https://github.com/user-attachments/assets/e2544aaf-d481-42eb-ae7c-559b29cee3b0" />
<img width="1440" alt="Screenshot 2025-05-19 at 09 20 03" src="https://github.com/user-attachments/assets/77083a8d-b3c3-4959-9f7d-011ca80543b9" />
<img width="1440" alt="Screenshot 2025-05-19 at 09 21 10" src="https://github.com/user-attachments/assets/3ee44fd8-9fb5-4dfd-8fc1-ed6732f406b1" />
<img width="1440" alt="Screenshot 2025-05-19 at 09 22 53" src="https://github.com/user-attachments/assets/3574e26f-e484-492a-969e-6abfa356b387" />
<img width="1440" alt="Screenshot 2025-05-19 at 09 04 09" src="https://github.com/user-attachments/assets/8eaefbad-c184-492a-8a6c-141bf1ab80fd" />
<img width="1440" alt="Screenshot 2025-05-19 at 09 04 52" src="https://github.com/user-attachments/assets/48049e03-9818-4771-b7b9-08a655125cc2" />
<img width="1440" alt="Screenshot 2025-05-19 at 09 07 13" src="https://github.com/user-attachments/assets/bc4dc4ca-5b41-4519-ad31-41e685703ce8" />
<img width="1440" alt="Screenshot 2025-05-19 at 09 23 34" src="https://github.com/user-attachments/assets/f9fd34d3-675d-4e06-87b5-852da35c309c" />
<img width="1038" alt="Screenshot 2025-05-19 at 09 25 42" src="https://github.com/user-attachments/assets/d60019b4-3b60-4072-9f74-585945c329cd" />








First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tools & Technologies

- **Next.js**: Frontend and backend framework
- **NeonDB**: PostgreSQL database for data storage
- **Drizzle ORM**: Object-Relational Mapping for database operations
- **Socket.io**: Real-time chat functionality
- **React Email**: Email templates for password reset
- **NextAuth**: Authentication system

## Credentials

### Citizen Account
- **Email**: topeje5318@hazhab.com
- **Password**: James@123

### Agency Account
- **Email**: nirek85490@jazipo.com
- **Password**: James@123

## Features

### Citizen Features
- Create complaints
- View complaint history
- Track complaint status

### Agency Features
- View all complaints
- Change complaint status
- Add responses to complaints

## Chat Functionality
To join a chat room, use room ID: 1

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run db:migrate

#run database push
npm run db:push
```

## Demo

### Live Demo
Check out the live demo: [Engagement System](https://engagement-system.vercel.app)

### Demo Video
Watch the demo video: [Vimeo Demo](https://vimeo.com/1085575425/08c848e30f?share=copy)

## Project Structure

```
engagement-system/
├── .git/                  # Git repository
├── .next/                 # Next.js build output
├── emails/                # React Email templates
├── node_modules/          # Dependencies
├── public/                # Static assets
├── src/                   # Source code
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── db/                # Database setup and queries
│   ├── hooks/             # React hooks
│   ├── lib/               # Utility libraries
│   ├── services/          # Service layer
│   ├── utils/             # Utility functions
│   ├── auth.ts            # Authentication configuration
│   └── middleware.ts      # Next.js middleware
├── .coderabbit.yaml       # CodeRabbit configuration
├── .gitignore             # Git ignore patterns
├── drizzle.config.ts      # Drizzle ORM configuration
├── next-env.d.ts          # Next.js TypeScript declarations
├── next.config.ts         # Next.js configuration
├── package-lock.json      # Dependency lock file
├── package.json           # Project metadata and scripts
├── postcss.config.mjs     # PostCSS configuration
├── README.md              # Project documentation
├── server.js              # Custom server for Socket.io
└── tsconfig.json          # TypeScript configuration
```
```
#environment
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
RESEND_API_KEY=
BASE_URL=
