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

const validateIsNumber = (field) => {
  return !isNaN(Number(field));
};
export { validateEmptyFiealds, validateEmail, validateIsNumber };
// validateEmptyFiealds(["", "ramesh2123"]);
// validateIsNumber("12sdfsdf")
