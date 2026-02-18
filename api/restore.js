import Replicate from "replicate";

export default async function handler(req, res) {

  // Enable CORS
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

    const output = await replicate.run(
      "sczhou/codeformer:latest",
      {
        input: {
          image: image,
          fidelity: 0.7
        }
      }
    );

    return res.status(200).json({ result: output[0] });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
