import { PrismaClient } from "../../generated/prisma/index.js";

const DB = new PrismaClient();
export const connectDB = async () => {
  try {
    await DB.$connect();
    console.log("DB Connection Successful!");
    const roles = await DB.roles.create({
      data: { permissions: "all", title: "admin" },
    });
    console.log(roles.title);
  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1);
  }
};
export default DB;
