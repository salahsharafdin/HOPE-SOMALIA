const { PrismaClient } = require('@prisma/client');

const value = JSON.stringify([
  {
    name: 'Dr. Abdirahman Hassan',
    title: 'Executive Director & Founder',
    bio: 'Over 18 years leading international development and public health initiatives across the Horn of Africa.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Fatima Omar',
    title: 'Director of Programs & Field Operations',
    bio: 'Specialist in emergency rapid deployment, community empowerment, and maternal health access.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Mohamed Jama',
    title: 'Head of Financial Auditing & Accountability',
    bio: 'Certified accountant overseeing institutional donor compliance, transparency audits, and budget allocations.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
]);

async function main() {
  const prisma = new PrismaClient();
  await prisma.setting.upsert({
    where: { key: 'about_leadership_team' },
    update: { value },
    create: { id: 'set_about_leadership_team', key: 'about_leadership_team', value },
  });
  console.log('Updated about_leadership_team setting');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
