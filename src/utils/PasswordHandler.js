import bcrypt from "bcrypt";
const encryptPassword = (password) => {
  return bcrypt.hash(password, 10);
};

const encryptApiSecret = (password) => {
  return bcrypt.hash(password, 5);
};

const isPasswordCorrect = async (password, encryptPassword) => {
  return await bcrypt.compare(password, encryptPassword);
};

const isApiSecretCorrect = async (apiSecret, encryptApiSecret) => {
  return await bcrypt.compare(apiSecret, encryptApiSecret);
};

export {
  encryptPassword,
  isPasswordCorrect,
  encryptApiSecret,
  isApiSecretCorrect,
};
