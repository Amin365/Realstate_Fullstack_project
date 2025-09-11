// middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 3,                // limit each IP to 3 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again after a minute."
  }
});

