# NovaTab — Personalized Browser New Tab Dashboard

NovaTab is an interactive, responsive browser "New Tab" page replacement built for the Hack Club Stardance challenge ("Give Your Website a Pulse" mission). It transforms standard empty browser tabs into a sleek, modular control center with custom greeting elements, local clocks, and structured widget configurations.

##  Core Features

- **Personalized Experience:** Local time tracking engines that update greetings dynamically based on the user's active hour.
- **Vite-Exposed Variable Architecture:** Leverages standard build variables (`import.meta.env`) to separate hidden, private token configurations from public code structures.
- **Production Asset Compilation:** Uses modern compilation frameworks to optimize script bundle deliveries for live hosting deployments.
- **Clean Responsive UI:** Hand-crafted CSS layout styles utilizing semantic markup workflows instead of heavy, pre-made component libraries.

##  Technical Architecture & Stack

- **Framework Context:** Pure Vanilla JS (ES6+) variant compiled inside the Node.js/Vite environment.
- **Build Ecosystem:** Bundled and optimized using Vite, managing configurations safely across production deployments.
- **Styling Engine:** Native CSS3 properties focusing on flexible viewports, clean element alignment, and custom color themes.

##  Local Setup & Execution Guide

To clone, test, and run this project locally on your machine, follow these instructions:

### 1. Prerequisites
Ensure you have the following software architectures installed on your machine:
- **Node.js:** Version 20.0.0 or higher
- A standard code terminal and git configuration

### 2. Clone the Workspace
Clone the source files locally and navigate directly into the active directory:
```bash
git clone https://github.com
cd NovaTab
```

### 3. Install Package Modules
Initialize the staging environment and pull down the manifest package blocks:
```bash
npm install
```

### 4. Register Local Key Tokens
Create an environment profile block in the root folder level (`same level as package.json`) to let Vite identify your parameters:
```bash
touch .env
```
Open the `.env` file and declare your secret variable using the mandatory `VITE_` prefix required by the bundling engine:
```text
VITE_NASA_API_KEY=your_actual_nasa_api_key_here
```

### 5. Launch the Development Server
Execute the local runtime compiler to initialize the asset server:
```bash
npm run dev
```
Open your browser and navigate to the localhost address provided in your terminal (usually `http://localhost:5173`) to view NovaTab live.
