import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const { PrismaClient } = pkg;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

//db connection
export default prisma;