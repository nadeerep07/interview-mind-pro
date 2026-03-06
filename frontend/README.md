# Interview Mind Pro – Frontend

This is the **frontend application** for **Interview Mind Pro**, an AI-powered interview preparation platform designed to help developers and students practice technical interviews and improve their problem-solving skills.

The frontend provides an interactive user interface for practicing questions, viewing AI explanations, and managing interview preparation workflows.

---

## Features

### Interview Practice Interface

Users can practice technical interview questions in a clean and structured UI.

### AI Powered Explanations

Questions can be analyzed and explained using AI to help users understand concepts more deeply.

### Dashboard

A central dashboard where users can:

* Track preparation progress
* Access interview questions
* Review explanations and notes

### Modern UI

The interface is designed to be clean, responsive, and developer-friendly.

---

## Tech Stack

* **React**
* **Next.js**
* **TypeScript**
* **TailwindCSS**
* **Component-based architecture**

---

## Project Structure

```
frontend/

src/
 ├─ components/
 │   ├─ ui/
 │   ├─ interview/
 │   └─ dashboard/
 │
 ├─ pages/ or app/
 │   ├─ index
 │   ├─ interview
 │   └─ dashboard
 │
 ├─ styles/
 │   └─ globals.css
 │
 └─ utils/
```

---

## Getting Started

### 1 Install dependencies

```
npm install
```

### 2 Run development server

```
npm run dev
```

The app will run on:

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file if the project requires API keys.

Example:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Future Improvements

* AI mock interview simulator
* Voice interview practice
* Interview progress analytics
* Resume feedback integration
* Coding challenge tracker

---

## Author

Developed by **Nadeer EP**
