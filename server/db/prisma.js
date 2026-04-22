import 'dotenv/config';
import pkg from '@prisma/client';
import {PrismaNeon} from '@prisma/adapter-neon';
import {withFirewall} from 'prisma-firewall';

const {PrismaClient} = pkg;

const adapter = new PrismaNeon({connectionString: process.env.DATABASE_URL});

const baseClient = new PrismaClient({adapter});

const prisma = withFirewall(baseClient,{
  rules:{
    blockDeleteWithoutWhere: false,
    blockUpdateWithoutWhere: true,
    blockDeleteSingleWithoutId: false,
    blockUpdateSingleWithoutId: false,
    blockFindManyWithoutLimit: true,
    maxRows: 1000,
    blockDangerousRawPatterns: true,
    blockOperatorInjection: true,
    rateLimit: {
      operations: ['deleteMany', 'updateMany'],
      maxPerMinute: 10
    },
    auditLog: true
  }
})

export default prisma