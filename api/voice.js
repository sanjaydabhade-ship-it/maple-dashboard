export default async function handler(req, res) {
  try {
    const GEMINI_KEY = process.env.GEMINI_KEY;

    const { prompt } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

    res.status(200).json({ reply: text });
  } catch (e) {
    res.status(500).json({ reply: "Server error" });
  }
}
