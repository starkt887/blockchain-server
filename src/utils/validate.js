const validateEmptyFiealds = (fields) => {
  // console.log(fields);
  return fields.some((field) => {
    // console.log("field",field,Boolean(field));
    return Boolean(field) === false;
  });
};
const validateEmail = (email) => {
  return !email.includes("@") || !email.includes(".");
};
export { validateEmptyFiealds, validateEmail };
validateEmptyFiealds(["", "ramesh2123"]);
