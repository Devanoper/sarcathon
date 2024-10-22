
# AI-Powered FAQ Page for SARAS AI Institute

## Overview

This project is an AI-powered FAQ page built for SARAS AI Institute. The FAQ page leverages both ElasticSearch for efficient query handling and an AI chatbot for natural language interaction. The aim is to intelligently return relevant FAQ entries based on user queries.

## First Look of the Website

![First look of the website](https://github.com/user-attachments/assets/dc0b1f3d-01c5-4e4f-9e5f-6a349ce42e35)

## Key Features

- **AI Chatbot**: Provides natural language responses to user queries using the Gemini API.
- **ElasticSearch Integration**: Fast and scalable search capabilities across FAQs.
- **Next.js Frontend**: The frontend is built with Next.js, offering a fast and responsive user interface.
- **Django Backend**: The backend is powered by Django, providing robust API and data management.

## Use of AI Chatbot

![AI Chatbot interaction](https://github.com/user-attachments/assets/62540416-2043-45b6-b055-c63e87457f5c)

## Preview of ElasticSearch

![ElasticSearch results](https://github.com/user-attachments/assets/494cd8b4-76c1-4de0-bed1-b65df434fba1)

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Django
- **Search Engine**: ElasticSearch
- **AI**: Custom AI Chatbot powered by the **Gemini API**

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Devanoper/sarcathonai.git
    ```

2. Navigate to the project directory:
    ```bash
    cd sarcathonai
    ```

3. Install frontend dependencies:
    ```bash
    npm install
    ```

4. Install backend dependencies:
    ```bash
    cd server
    pip install -r requirements.txt
    ```

5. Set up ElasticSearch on your local machine or use a hosted ElasticSearch instance.

6. Configure the Gemini API by setting up your API key in the environment variables.

7. Run the backend server:
    ```bash
    python manage.py runserver
    ```

8. Run the frontend server:
    ```bash
    npm run dev
    ```

9. Access the application at `http://localhost:3000`.

## Usage

Once the servers are running, users can:

- Ask questions through the search bar.
- Get instant FAQ matches from ElasticSearch.
- Receive AI-powered responses for more complex queries through the chatbot (present at the bottom right of the webpage) powered by the Gemini API.

## Contributing

Feel free to submit issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
