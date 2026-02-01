import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔒 Enabling Row Level Security (RLS) on all tables...');

    try {
        // 1. Enable RLS on all tables
        const tables = [
            'users',
            'user_metrics',
            'foods',
            'meals',
            'workouts',
            'user_workouts',
            'achievements',
            'chat_sessions',
            'chat_messages'
        ];

        for (const table of tables) {
            await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
            console.log(`✅ RLS enabled for table: ${table}`);
        }

        // 2. Create Policies

        // --- USERS ---
        // Users can see and update their own profile.
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can manage own profile" ON "users";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can manage own profile" ON "users"
            FOR ALL
            USING ("authId" = auth.uid()::text); 
        `);

        // --- FOODS (Library) ---
        // Public read access.
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public read access" ON "foods";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Public read access" ON "foods"
            FOR SELECT
            USING (true);
        `);

        // --- MEALS ---
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can manage own meals" ON "meals";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can manage own meals" ON "meals"
            FOR ALL
            USING (
                "userId" IN (
                    SELECT id FROM "users" WHERE "authId" = auth.uid()::text
                )
            );
        `);

        // --- WORKOUTS (Library) ---
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public read access" ON "workouts";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Public read access" ON "workouts"
            FOR SELECT
            USING (true);
        `);

        // --- USER WORKOUTS ---
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can manage own workouts" ON "user_workouts";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can manage own workouts" ON "user_workouts"
            FOR ALL
            USING (
                "userId" IN (
                    SELECT id FROM "users" WHERE "authId" = auth.uid()::text
                )
            );
        `);

        // --- USER METRICS ---
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can manage own metrics" ON "user_metrics";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can manage own metrics" ON "user_metrics"
            FOR ALL
            USING (
                "userId" IN (
                    SELECT id FROM "users" WHERE "authId" = auth.uid()::text
                )
            );
        `);

        // --- ACHIEVEMENTS ---
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can manage own achievements" ON "achievements";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can manage own achievements" ON "achievements"
            FOR ALL
            USING (
                "userId" IN (
                    SELECT id FROM "users" WHERE "authId" = auth.uid()::text
                )
            );
        `);

        // --- CHAT SESSIONS ---
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can manage own chat sessions" ON "chat_sessions";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can manage own chat sessions" ON "chat_sessions"
            FOR ALL
            USING (
                "userId" IN (
                    SELECT id FROM "users" WHERE "authId" = auth.uid()::text
                )
            );
        `);

        // --- CHAT MESSAGES ---
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can manage own chat messages" ON "chat_messages";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can manage own chat messages" ON "chat_messages"
            FOR ALL
            USING (
                "sessionId" IN (
                    SELECT id FROM "chat_sessions" 
                    WHERE "userId" IN (
                        SELECT id FROM "users" WHERE "authId" = auth.uid()::text
                    )
                )
            );
        `);

        console.log('✨ All policies applied successfully!');

    } catch (error) {
        console.error('❌ Error enabling RLS:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
