const express = require('express');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const axios = require('axios')
const PORT = process.env.PORT || 5000
const app = express();
//API KEY=
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
//API URL
const API_URL = 'https://v6.exchangerate-api.com/v6/'

const limiter = rateLimit({
     windowMS: 15 * 60 * 100, //15 Minutes
     max: 100,
})
//Middleware
app.use(express.json());
app.use(limiter);

//Conversion-Routes
app.use('/api/convert', async (req, res) => {
     try {
          //get the data
          const { from, to, amount } = req.body;

          const url = `${API_URL}${EXCHANGE_RATE_API_KEY}/pair/${from}/${to}/${amount}`
          const response = await axios.get(url)
          if (response.data && response.data.result === "success") {
               res.status(200).json({
                    base: from,
                    target: to,
                    conversionRate: response.data.conversion_rate,
                    convertedAmount: response.data.conversion_result
               })
          } else {
               res.status(500).json({
                    message: "Error Converting Currency",
                    details: response.data
               })
          }


     } catch (error) {
          res.status(500).json({
               message: "Error Converting Currency",
               details: error.message
          })
     }

})

//Start the Server
app.listen(PORT, () => {
     console.log(`Server running on PORT ${PORT} ...`);
})