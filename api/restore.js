import Replicate from "replicate";

export default async function handler(req, res) {

  // Allow CORS (important for Blogger)
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

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const output = await replicate.run(
      "nightmareai/real-esrgan",
      {
        input: {
          image: image,
          scale: 2
        }
      }
    );

    const finalImage = Array.isArray(output) ? output[0] : output;

    return res.status(200).json({
      result: finalImage
    });

  } catch (error) {
    console.error("AI Restore Error:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}
