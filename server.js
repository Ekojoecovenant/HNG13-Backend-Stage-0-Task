import express from "express";
import rateLimit from "express-rate-limit";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 40404;
const CAT_FACT_URL = "https://catfact.ninja/fact";
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT, 10);

// Store user's info
const USER_INFO = {
  email: process.env.USER_EMAIL,
  name: process.env.USER_NAME,
  stack: process.env.USER_STACK,
};

//create rate limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 50, //50 requests
  message: {
    status: "failed",
    message: "Too many requests. Please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json()); // JSON body
app.use(cors()); // CORS Headers
app.use(limiter); // Applied the limiter to all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

//for ping
app.get("/", async (req, res) => {
  res.json({
    status: "success",
    message: "HNG 13 Backend Stage 0 Task 1 is LIVE!!!",
  });
});

app.get("/me", async (req, res) => {
  const currentTimestamp = new Date().toISOString();

  const cat = await getCatFact();

  const factStatus = cat.status === 200 ? "success" : "error";

  res.status(cat.status).json({
    status: factStatus,
    user: USER_INFO,
    timestamp: currentTimestamp,
    fact: cat.fact,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

const getCatFact = async () => {
  try {
    const response = await axios.get(CAT_FACT_URL, {
      timeout: API_TIMEOUT,
    });

    if (response.status === 200 && response.data && response.data.fact) {
      return {
        status: 200,
        fact: response.data.fact,
      };
    } else {
      throw new Error(
        `External API returned status ${response.status} or missing 'fact' field.`
      );
    }
  } catch (error) {
    let errorMessage = error.message;
    let statusCode = 500;

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      errorMessage = `External API call timed out after ${API_TIMEOUT}ms.`;
      statusCode = 504; // Gateway Timeout
    } else if (error.response) {
      errorMessage = `External API returned status ${error.response.status}. Fact not available.`;
      statusCode = 502; // Bad Gateway
    } else if (error.request) {
      errorMessage =
        "No response received from the external Cat Fact API. Check network connectivity or API availability.";
      statusCode = 503; // Service Unavailable
    }

    return {
      status: statusCode,
      fact: `FACT ERROR: ${errorMessage}`,
    };
  }
};
