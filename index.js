import express from 'express';
import 'dotenv/config';
import OpenAI from "openai";
import db from './utils/db.js';

const app = express();
app.use(express.json());

const token = process.env.api_key;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

app.post("/ask", async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) return res.status(400).json({ error: "Question is required" });

        // Step 1: Get SQL query from GitHub API
        const client = new OpenAI({ baseURL: endpoint, apiKey: token });
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: `You are an AI that converts natural language to MySQL queries. 
                  The database has two tables:
                  1. categories (id INT PRIMARY KEY, name VARCHAR(255), description TEXT)
                  2. products (id INT PRIMARY KEY, name VARCHAR(255), description TEXT, price DECIMAL(10,2), category_id INT FOREIGN KEY REFERENCES categories(id)).
                  The goal is to generate MySQL queries that correctly reference the table columns.` },
                { role: "user", content: question }
            ],
            temperature: 0.7,
            top_p: 1.0,
            max_tokens: 500,
            model: modelName
        });

        // Step 2: Clean up the SQL query
        let sqlQuery = response.choices[0].message.content.trim();
        sqlQuery = sqlQuery.replace(/```sql|```/g, "").trim(); // Remove markdown code blocks

        console.log("Generated SQL Query:", sqlQuery);

        // Step 3: Execute SQL query in MySQL
        const [rows] = await db.query(sqlQuery); // db now supports promises
        let humanRead = await getFinal(question,rows);
        console.log("ai Res",humanRead);
        // Step 4: Convert result to JSON and return response
        res.json({ answer: humanRead });

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


const getFinal = async (question, rows) => {
    if (!rows || rows.length === 0) {
        return "No relevant data is available to generate a meaningful response.";
    }

    console.log("Processing MySQL Data:", rows);

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });
    const response = await client.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: `You are an AI assistant that generates natural language answers based on a given question and its pre-solved database result.
                - The question is ALREADY solved before being given to you.
                - Your job is to transform the provided data into a human-readable answer.
                - Do NOT use markdown formatting like **bold**, -, \n, or special characters.
                - Do NOT say "data is incomplete" or "I can't determine".
                - Always form a meaningful, confident response based on the available information.
                - Structure the response like a human-written summary.` 
            },
            { 
                role: "user", 
                content: `Question: ${question}\n\nPre-Solved Data: ${JSON.stringify(rows, null, 2)}`
            }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 500,
        model: modelName
    });

    const aiResponse = response.choices[0].message.content.trim();
    console.log("AI Natural Language Response:", aiResponse);
    return aiResponse;
};


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
