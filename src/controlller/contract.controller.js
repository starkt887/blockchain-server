import { AMOY_POLYSCAN_LINK, CONTRACT } from "../constants.js";
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
    res.status(200).json(
      new ApiResponse(200, {
        message: "Value retrived",
        value: value.toString(),
      })
    );
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error reading to contract value");
  }
});

const generatecertificates = asyncHandler(async (req, res) => {
  const { certificateData, smcAddress } = req.body;
  if (!certificateData) {
    throw new ApiError(401, "Certifiation Data is required!");
  }
  if (!smcAddress) {
    throw new ApiError(401, "Company Owner address is required!");
  }

  const user = req.user;
  if (user.quotations < certificateData.length) {
    throw new ApiError(401, "Your quotations are depleted. Kindly topup now!");
  }

  const certificateDataStringified = certificateData.map((data) => {
    return JSON.stringify(data);
  });
  console.log(certificateDataStringified);
  try {
    const tx = await CONTRACT.mint_nemwNFT_bulk(
      smcAddress,
      certificateDataStringified
    ); // Create certificate
    const receipt = await tx.wait();
    const event = receipt.logs
      .map((log) => {
        try {
          return CONTRACT.interface.parseLog(log);
        } catch (error) {
          console.log("log-err", error);

          return null;
        }
      })
      .find((e) => e && e.name === "MintCertificateBulkEvent");
    if (event) {
      console.log(event.args);

      const { date, from, owner, tokens } = event.args;
      console.log("Event Data:", { date, from, owner, tokens });
      const validateChainURLS = tokens.map((token) => {
        return `${AMOY_POLYSCAN_LINK}${token.tokenID.toString()}`;
      });
      res.status(200).json(
        new ApiResponse(
          200,
          {
            date: date.toString(),
            from,
            owner,
            tokens: tokens,
            // data: JSON.parse(data),
            transactionHash: tx.hash,
            validateChainURL: validateChainURLS,
            validationURL: "yet to build",
          },
          "Certification Created Successfully!"
        )
      );
      return;
    }
    throw new ApiError(500, "Unable to find the certificate event!");
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Error Posting request");
  }
});

export { setValue, getValue, generatecertificates };
