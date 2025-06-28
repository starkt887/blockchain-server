import { PrismaClient } from "../../generated/prisma/index.js";
import { ROLES } from "../constants.js";

const DB = new PrismaClient();
export const connectDB = async () => {
  try {
    await DB.$connect();
    console.log("DB Connection Successful!");
    // const roles = await DB.roles.createMany({
    //   data: [
    //     {
    //       permissions: "User-1111|TransactionRequests-1111",
    //       title: ROLES.ADMIN,
    //     },
    //     {
    //       permissions: "User-0000|TransactionRequests-0000",
    //       title: ROLES.USER,
    //     },
    //   ],
    // });
    // console.log(roles.title);
  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1);
  }
};
export default DB;
