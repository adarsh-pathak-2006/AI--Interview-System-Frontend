# AI Interview Platform - Frontend UI 💻

This is the frontend user interface for the AI Interview Platform. It is built entirely from scratch using **Next.js (App Router)** and styled with a custom **Tailwind CSS Glassmorphism** aesthetic. 

## 🛠 Tech Stack
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS (Custom Dark Mode & Glassmorphism)
- **Icons**: Lucide React
- **Networking**: Axios (with custom JWT interceptors)

## 🌟 Key Features
- **Stunning UI**: Deep space backgrounds with interactive glassmorphism components and dynamic CSS animations.
- **Secure Sessions**: Automated JWT handling. Axios interceptors automatically attach access tokens and refresh them seamlessly in the background.
- **Dashboard**: A sleek interface to manage your resume profile and dynamically add technical projects via a pop-up modal.
- **Interactive Interview Room**: A progressive chat-like interface that renders AI questions, accepts technical answers, and displays immediate grading and feedback.
- **Analysis Report**: A highly visual post-interview dashboard displaying overall performance scores, strengths, and areas for improvement.

## 🚀 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adarsh-pathak-2006/AI--Interview-System-Frontend.git
   cd AI--Interview-System-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and define the backend URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   *(Change this to your Render URL in production)*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will boot up at `http://localhost:3000`. 
   
   *Note: Ensure your Django backend is running simultaneously on port 8000 for the app to function properly.*

## 🚀 Deployment
This project is fully optimized for **Vercel**. Simply import the repository to Vercel, set the `NEXT_PUBLIC_API_URL` environment variable, and deploy!
