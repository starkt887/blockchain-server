const validateEmptyFiealds = (...fields) => {
  fields.some((field) => field == "");
};
const validateEmail=(email)=>{
 return !email.includes("@")||!email.includes(".")
}
export { validateEmptyFiealds,validateEmail };
