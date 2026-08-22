# NovaTab — Customizable Browser Dashboard

NovaTab is a highly interactive, responsive browser "New Tab" page replacement built for the Hack Club Stardance community. It provides users with a fully customizable dashboard featuring toggleable, editable, and draggable widgets alongside custom styling settings.

## 🚀 Key Features

- **Draggable Widget Grid:** Complete user freedom to move, drag, and drop custom dashboard elements anywhere on the canvas screen.
- **In-Line Content Editing:** Users can double-click on any active widget to edit or alter its content values in real-time.
- **Persistent Local Engine:** Custom stylesheets, widget placements, layouts, and data points save locally and persist across browser reloads using the browser's `localStorage` API.
- **NASA API Integration:** Features structured API network handling to fetch and parse data feeds seamlessly from the public NASA APOD (Astronomy Picture of the Day) channel.

## 🛠️ Technical Stack

- **Markup Language:** Semantics-focused HTML5 skeleton structure.
- **Styling Layout Engine:** CSS3 utilizing flexbox layouts, absolute drag layers, root color themes, and custom animations.
- **Logic Controller:** Native Vanilla JavaScript (ES6+) for DOM manipulation, local data storage state control, drag event mapping, and fetch streams.

## 💻 Local Setup & Execution Instructions

Because NovaTab is built as a pure client-side web application without complex compilation tools, setting up the local working layout is quick and straightforward:

### 1. Clone the Source Repository
Clone the project repository to your machine using your terminal:
```bash
git clone https://github.com
cd NovaTab
```

### 2. Configure Local Keys
1. Create a file named `.env` in the project root folder.
2. Visit [api.nasa.gov](https://nasa.gov) to claim your free open developer key.
3. Paste your secret token variable into the `.env` folder layout:
   ```text
   VITE_NASA_API_KEY=your_actual_nasa_api_key_here
   ```

### 3. Open the Dashboard Live
Simply double-click the `index.html` file inside your folder array to open the project interface natively inside your default web browser, or launch it using your favorite workspace live server extension!
