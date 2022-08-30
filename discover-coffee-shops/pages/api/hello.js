// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  // console.log({ req, res });
  res.status(200).json({ name: "John Doe" });
}

// NEXT.JS RULES :

// Routing rules:
// - Page needs to be a React Component
// - Component needs to be exported by default

// API Routes Rules:
// - File need to be a funciton
// - Function needs to be exported by default
// - Every function should be it's own file
