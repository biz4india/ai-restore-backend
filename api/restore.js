import Replicate from "replicate";

export default async function handler(req, res) {

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

    return res.status(200).json({ result: output });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
