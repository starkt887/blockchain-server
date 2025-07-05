import { CONTRACT } from "../constants.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const setValue = asyncHandler(async (req, res) => {
  const { newValue } = req.body;
  try {
    const tx = await CONTRACT.store(newValue); // Replace with your actual write method
    await tx.wait();
    res
      .status(200)
      .json(
        new ApiResponse(200, { message: "Value updated", txHash: tx.hash })
      );
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: "Error writing to contract" });
    throw new ApiError(500, "Error writing to contract");
  }
});
const getValue = asyncHandler(async (req, res) => {
  try {
    const value = await CONTRACT.retrieve(); // Replace with your actual view method
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Value retrived", value: value.toString() }));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error reading to contract value");
  }
});

const generatecertificates = asyncHandler(async (req, res) => {
  try {
    const { id, name, course, duration, date } = req.body;
    res.status(200).json({ status: 200, message: "Request added success!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error Posting request" });
  }
  //   try {
  //     const tx = await contract.setValue(newValue); // Replace with your actual write method
  //     await tx.wait();
  //     res.json({ message: 'Value updated', txHash: tx.hash });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Error writing to contract' });
  //   }
});

export { setValue, getValue };
