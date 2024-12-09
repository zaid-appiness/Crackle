# Crackle - Movie Discovery Platform

A modern, feature-rich movie discovery platform built with Next.js 15, TypeScript, and Tailwind CSS. Experience seamless movie browsing with real-time search, advanced filtering, and personalized watchlists.

## Features

### Authentication & User Management

- 🔐 Secure email & password authentication
- 🔑 Password reset functionality with email verification
- 👤 User profile management
- 🚫 Protected routes and unauthorized access handling

### Movie Discovery

- 🎬 Browse popular, trending, and top-rated movies
- 🔍 Real-time search with debounced queries
- 🏷️ Filter movies by genre and rating
- 📱 Responsive grid layout for optimal viewing
- ♾️ Infinite scroll for seamless browsing

### User Experience

- 🌓 Dark mode support
- 🍪 Cookie consent management
- ⚡ Loading states and skeleton screens
- 🎨 Smooth animations with Framer Motion
- ↕️ Scroll to top functionality
- 📊 Loading bar for navigation feedback

### Technical Features

- 🚀 Server-side rendering with Next.js 15
- 💾 PostgreSQL database with Prisma ORM
- 🔄 React Query for efficient data fetching
- 📦 Zustand for state management
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design

## Tech Stack

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- React Query
- Zustand

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Nodemailer

### Development Tools

- ESLint
- Prettier
- PostCSS
- Autoprefixer

## Getting Started

### Prerequisites

- Node.js 16.x or later
- PostgreSQL database
- TMDB API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/crackle.git
   cd crackle
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a \`.env\` file in the root directory with the following variables:
   \`\`\`env
   TMDB_API_KEY=your_tmdb_api_key
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   GMAIL_USER=your_gmail_address
   GMAIL_APP_PASSWORD=your_gmail_app_password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. Initialize the database:
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

\`\`\`
src/
├── app/ # Next.js 13 app directory
├── components/ # Reusable React components
├── contexts/ # React contexts
├── hooks/ # Custom React hooks
├── lib/ # Utility libraries
├── types/ # TypeScript type definitions
└── utils/ # Helper functions
\`\`\`

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB API](https://www.themoviedb.org/documentation/api) for providing movie data
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
