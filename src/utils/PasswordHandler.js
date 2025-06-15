import bcrypt from "bcrypt";
const encryptPassword = (password) => {
  return bcrypt.hash(password, 10);
};

const isPasswordCorrect = async (password, encryptPassword) => {
  return await bcrypt.compare(password, encryptPassword);
};

export { encryptPassword, isPasswordCorrect };
