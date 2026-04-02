import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../entities/user.entity";
import { UserRole } from "../../common/enums/user-role.enum";
import { AppDataSource } from "../../data-source";

async function seed() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Initialize data source
    await AppDataSource.initialize();
    console.log("✅ Database connection established\n");

    const userRepository = AppDataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@nhatro.com" },
    });

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists. Skipping seed.\n");
      await AppDataSource.destroy();
      return;
    }

    // Create admin user
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash("Admin@123", saltRounds);

    const admin = userRepository.create({
      email: "admin@nhatro.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
      firstName: "System",
      lastName: "Administrator",
      isActive: true,
      emailVerifiedAt: new Date(),
    });

    await userRepository.save(admin);

    console.log("✅ Admin user created successfully!");
    console.log("   Email: admin@nhatro.com");
    console.log("   Password: Admin@123");
    console.log("   Role: admin");
    console.log("\n⚠️  Please change the admin password after first login!\n");

    await AppDataSource.destroy();
    console.log("✅ Seeding completed successfully!\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
