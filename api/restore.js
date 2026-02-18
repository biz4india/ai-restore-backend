import Replicate from "replicate";

export default async function handler(req, res) {

  // Allow CORS (Important for Blogger)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "sczhou/codeformer:latest",
      {
        input: {
          image: image,
          fidelity: 0.7
        }
      }
    );

    // 🔥 Handle array response
    const resultImage = Array.isArray(output) ? output[0] : output;

    return res.status(200).json({ result: resultImage });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
