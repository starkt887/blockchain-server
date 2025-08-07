import { faker } from "@faker-js/faker";
import { PrismaClient } from "../../generated/prisma/index.js";
import { ROLES } from "../constants.js";
import { encryptPassword } from "../utils/PasswordHandler.js";

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
    // const adminUser = await DB.user.create({
    //   data: {
    //     email: "admin@tampfy.com",
    //     mobile: "9483747368",
    //     name: "Admin",
    //     password: await encryptPassword("Admin@321"),
    //     role: {
    //       connect: { id: "6880b7c5c8ac9f82f0205a69" },
    //     },
    //   },
    // });
  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1);
  }
};

const roleId = "6880b7c5c8ac9f82f0205a6a"; // existing Role _id

function getRandomPhone() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function getRandomEthAddress() {
  const hex = faker.string
    .hexadecimal({ length: 40, prefix: "" })
    .toLowerCase();
  return "0x" + hex;
}

const countryCodes = ["+91", "+84", "+1", "+44", "+61", "+81"];

async function main() {
  for (let i = 0; i < 20; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email({
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1],
    });
    const company = faker.company.name();
    const logo = faker.image.avatarGitHub();
    const country = faker.location.country();
    const city = faker.location.city();
    const zipcode = faker.location.zipCode();
    const state = faker.location.state();
    const mobile = getRandomPhone();
    const countryCode = faker.helpers.arrayElement(countryCodes);
    const smcAddress = getRandomEthAddress();

    await DB.user.create({
      data: {
        name,
        email,
        password: faker.internet.password(),
        company,
        logo,
        country,
        countryCode,
        city,
        zipcode,
        state,
        mobile,
        smcAddress,
        apiKey: null,
        apiExpiry: null,
        refreshToken: null,
        quotations: 0,
        enabled: false,
        roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`Inserted user: ${name}`);
  }
}
async function updateRole() {
  await DB.user.updateMany({
    data: {
      roleId:roleId
    },
    where: { NOT: { name: "Admin" } },
  });
}
// updateRole()
//   .then(() => {
//     console.log("updated the roles data");
//   })
//   .catch((e) => {
//     console.error("❌ Error inserting users", e);
//     process.exit(1);
//   });
// main()
//   .then(() => {
//     console.log('✅ 20 users inserted');

//   })
//   .catch((e) => {
//     console.error('❌ Error inserting users', e);

//     process.exit(1);
//   });
export default DB;
