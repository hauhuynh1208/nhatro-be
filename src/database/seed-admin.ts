import { AppDataSource } from './data-source';
import { User } from '../entities/user.entity';
import { UserRole } from '../common/enums';
import * as bcrypt from 'bcrypt';

async function seedAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error(
      'Error: ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env before running this script.',
    );
    process.exit(1);
  }

  await AppDataSource.initialize();

  const repo = AppDataSource.getRepository(User);

  const existing = await repo.findOne({ where: { username } });
  if (existing) {
    console.log(`Admin "${username}" already exists — skipping.`);
    await AppDataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = repo.create({
    username,
    passwordHash,
    role: UserRole.ADMIN,
    isActive: true,
  });

  await repo.save(admin);

  console.log(`Admin "${username}" provisioned successfully.`);
  await AppDataSource.destroy();
}

seedAdmin().catch((err: unknown) => {
  console.error('Failed to seed admin account:', err);
  process.exit(1);
});
