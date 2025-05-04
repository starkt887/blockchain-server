const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
// const contractABI = require('../abi/contractABI.json');

// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

// Example read function
router.get('/getValue', async (req, res) => {
//   try {
//     const value = await contract.getValue(); // Replace with your actual view method
//     res.json({ value });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error reading contract value' });
//   }
});

// Example write function
router.post('/setValue', async (req, res) => {
//   const { newValue } = req.body;
//   try {
//     const tx = await contract.setValue(newValue); // Replace with your actual write method
//     await tx.wait();
//     res.json({ message: 'Value updated', txHash: tx.hash });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error writing to contract' });
//   }
});

module.exports = router;
