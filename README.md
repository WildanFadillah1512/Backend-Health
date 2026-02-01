# HealthFit Backend API

Backend API for the HealthFit mobile application built with Express, TypeScript, and Prisma.

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database (development)
- **Firebase Admin** - Authentication
- **OpenAI/Gemini API** - AI Health Coach (planned)
- **Zod** - Request validation

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/              # API routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── meals.ts
│   │   ├── workouts.ts
│   │   └── ai.ts
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   │   ├── calculationService.ts    # BMI, BMR, TDEE
│   │   ├── aiService.ts
│   │   └── firebaseService.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── utils/
│   └── index.ts             # Entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

## 🗄️ Database Schema

### User
- Physical data (age, weight, height, gender)
- Goals (lose_weight, gain_muscle, stay_healthy)
- Activity level
- Calculated metrics (BMI, BMR, TDEE, target calories)

### Food
- Name, calories, macros (protein, carbs, fats)
- Serving size, category
- Health score (1-10)
- **17 pre-seeded items** across all meal categories

### Workout
- Name, description, duration, difficulty
- Body part targeted
- Calories burned estimation
- Exercises (JSON array with sets/reps)
- **6 pre-seeded workout programs**

### UserMetric
- Daily tracking (weight, BMI, steps, water intake)
- Historical data for charts

### Meal
- User's logged meals
- Food items (JSON array)
- Calculated totals (calories, macros)
- Meal type (breakfast, lunch, dinner, snack)

### UserWorkout
- Completed workouts
- Actual completion time & calories burned

### Achievement
- Unlocked achievements
- Title, description, icon

## 🚀 Getting Started

### Installation

```bash
cd expo-app/backend
npm install
```

### Environment Setup

Create `.env` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="apotek-5ec72"
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""

# AI Services (optional)
OPENAI_API_KEY=""
GEMINI_API_KEY=""

# Server
PORT=3000
NODE_ENV="development"
```

### Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npx tsx prisma/seed.ts
```

### Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Authentication (Planned)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Users (Planned)
```
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
POST   /api/users/:id/metrics
```

### Meals (Planned)
```
GET  /api/meals              # Get user's meals
POST /api/meals              # Log a meal
GET  /api/meals/:id
PUT  /api/meals/:id
DELETE /api/meals/:id
```

### Food Database (Planned)
```
GET  /api/foods              # List all foods
GET  /api/foods/search?q=    # Search foods
GET  /api/foods/:id
```

### Workouts (Planned)
```
GET  /api/workouts           # List all workouts
GET  /api/workouts/:id
POST /api/users/:id/workouts # Log completed workout
```

### AI Health Coach (Planned)
```
POST /api/ai/chat            # Chat with AI coach
```

## 🧮 Calculation Service

Located in `src/services/calculationService.ts`

### Available Functions

#### `calculateBMI(weight, height)`
Calculates Body Mass Index and returns category:
- Underweight (BMI < 18.5)
- Normal (18.5 ≤ BMI < 25)
- Overweight (25 ≤ BMI < 30)
- Obese (BMI ≥ 30)

#### `calculateBMR(weight, height, age, gender)`
Uses Mifflin-St Jeor Equation:
- Male: `(10 × weight) + (6.25 × height) - (5 × age) + 5`
- Female: `(10 × weight) + (6.25 × height) - (5 × age) - 161`

#### `calculateTDEE(bmr, activityLevel)`
Multiplies BMR by activity factor:
- Sedentary: 1.2
- Lightly Active: 1.375
- Moderately Active: 1.55
- Very Active: 1.725
- Extremely Active: 1.9

#### `calculateTargetCalories(tdee, goal)`
Adjusts TDEE based on fitness goal:
- Lose Weight: TDEE - 500
- Gain Muscle: TDEE + 300
- Stay Healthy: TDEE

#### `calculateMacros(targetCalories, goal, weight)`
Returns grams of protein, carbs, and fats based on goal

## 🌱 Seed Data

The database comes pre-seeded with:

### Foods (17 items)
- **Breakfast**: Oatmeal, Greek Yogurt, Scrambled Eggs, Banana, Whole Wheat Toast
- **Lunch**: Grilled Chicken Salad, Nasi Goreng, Chicken Sandwich, Quinoa Bowl
- **Dinner**: Salmon with Vegetables, Grilled Chicken, Brown Rice, Steak
- **Snacks**: Apple, Mixed Nuts, Protein Bar, Hummus

### Workouts (6 programs)
- Full Body Strength (30min, Intermediate)
- Core Crusher (20min, Advanced)
- Leg Day Power (45min, Intermediate)
- Upper Body Blast (35min, Beginner)
- Chest & Shoulders (25min, Intermediate)
- Back Strengthening (30min, Beginner)

## 🔧 Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Prisma commands
npm run prisma:generate     # Generate Prisma Client
npm run prisma:push         # Push schema to database
npm run prisma:seed         # Seed database
npx prisma studio           # Open Prisma Studio GUI
```

## 📊 Database Tools

### Prisma Studio
Visual editor for your database:
```bash
npx prisma studio
```
Opens at `http://localhost:5555`

### View Database
```bash
npx prisma studio
```

Or use any SQLite viewer to open `dev.db`

## 🏗️ Production Deployment

### Migrate to PostgreSQL

1. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/healthfit"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

3. Run migration:
```bash
npx prisma migrate dev --name init
```

### Deploy Options
- **Vercel** - Serverless functions
- **Railway** - Full backend with PostgreSQL
- **Heroku** - Traditional hosting
- **AWS/GCP/Azure** - Cloud platforms

## 📚 API Documentation (Future)

Consider adding:
- Swagger/OpenAPI documentation
- Postman collection
- GraphQL (alternative to REST)

## 🔐 Security

- [ ] Implement rate limiting
- [ ] Add CORS whitelist
- [ ] Validate all inputs with Zod
- [ ] Sanitize user data
- [ ] Use helmet.js for headers
- [ ] Implement proper authentication middleware

## 📄 License

MIT

---

**Status**: Core structure complete, endpoints to be implemented in next phase.
