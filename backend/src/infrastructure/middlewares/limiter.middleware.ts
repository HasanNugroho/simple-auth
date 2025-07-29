import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan, coba lagi nanti.',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
});

export default limiter;
