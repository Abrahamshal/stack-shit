// Simple test endpoint to verify Vercel API is working
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}