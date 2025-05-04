require("dotenv").config();
const express = require("express");
const cors = require("cors");
const contractRoutes = require("./routes/contractRoutes");

const app = express();
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT || 3000;

app.use("/api/contract", contractRoutes);

app.get("/", (req, res) => {
  res.send({ message: "Blockchain server running!", status: 200 });
});


app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}!`);
})
