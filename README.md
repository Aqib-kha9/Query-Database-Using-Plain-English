# Query Database Using Plain English

## Overview
This project is a backend API that takes a plain text query, generates a corresponding MySQL query using OpenAI's GPT-4o model, executes it on a relational database, and returns the result in human-readable language.

## Features
- Converts natural language queries into SQL queries using OpenAI API.
- Executes the SQL queries on a MySQL database.
- Transforms query results into human-readable responses.
- Uses environment variables to store sensitive information.

## Technologies Used
- Node.js
- Express.js
- OpenAI API (GPT-4o)
- MySQL
- Azure AI Inference (for OpenAI API)
- dotenv (for environment variables)

## Setup Instructions
### Prerequisites
- Node.js installed
- MySQL installed and running
- OpenAI API key

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Aqib-kha9/Query-Database-Using-Plain-English.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   api_key=your_openai_api_key
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Usage
### Endpoint: `/ask`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "question": "Which category has the highest priced product?"
  }
  ```
- **Response:**
  ```json
  {
    "answer": "The category with the highest priced product is Electronics."
  }
  ```

## Example Queries
1. "Which category has the lowest priced product?"
2. "What is the average price of products in each category?"

## Notes
- Ensure the `.env` file is included in `.gitignore` to prevent accidental exposure of API keys.
- Use `ngrok` or `ms tunnels` for local testing and demonstration.

## License
This project is licensed under the MIT License.

