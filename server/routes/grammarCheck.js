const express = require("express");
const axios = require("axios");
const grammarCheckRoute = express.Router();

//COHERE needs a clean and sharp prompt to be used. it could give extra quotes and phrases otherwise.

grammarCheckRoute.post("/", async (req, res) => {
    const { sentence } = req.body;

    try {
        const cohereRes = await axios.post(
            "https://api.cohere.ai/v1/generate", //Open Ai is not working, I chose COHERE.
            {
                model: "command",
                prompt: `Correct the grammar and tense of the following sentence and return only the corrected sentence:\n${sentence}`,
                max_tokens: 60,
                temperature: 0
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Raw Cohere Response:", cohereRes.data.generations[0].text);
        
        // const correctedSentence = cohereRes.data.generations[0].text.trim();
        let correctedSentence = cohereRes.data.generations[0].text.trim();

        // Removing extra quotes
        correctedSentence = correctedSentence.replace(/^["']|["']$/g, "");

        // Removing  "Sure..." or similar intros
        correctedSentence = correctedSentence.replace(/^Sure.*?:\s*/i, "");

        // Keep only the first sentence (remove "Let me know..." etc.)
        correctedSentence = correctedSentence.split(/[\n\r]/)[0].trim();
        if (correctedSentence.includes(".")) {
            correctedSentence = correctedSentence.split(".")[0] + ".";
        }

        res.status(200).json({correctedSentence});

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = grammarCheckRoute;
