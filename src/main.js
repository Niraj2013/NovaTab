import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <aside class="sidebar">
    <div class="sidebar-brand">
      <span class="sidebar-mark">N</span>
      <span>NovaTab</span>
    </div>

    <nav class="sidebar-nav">
      <button class="sidebar-item active" data-page="workspace">
        <span>⌂</span>
        <span>Workspace</span>
      </button>

      <button class="sidebar-item" data-page="notes-page">
        <span>✎</span>
        <span>Notes</span>
      </button>
    </nav>
  </aside>

  <div class="app-main">

    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">N</span>

        <div>
          <h1>NovaTab</h1>
          <p>Your space, your way</p>
        </div>
      </div>

      <div class="top-actions">
        <button id="addWidgetBtn">+ Add widget</button>
        <button id="resetBtn">Reset</button>
      </div>
    </header>

    <!-- WORKSPACE PAGE -->
    <main id="workspacePage" class="page active-page">

      <section id="workspace" class="workspace">

        <section class="nova-window welcome-window" data-widget="welcome">

          <div class="window-bar">
            <span class="window-title">Welcome</span>

            <button
              class="close-widget"
              aria-label="Close welcome"
            >
              ×
            </button>
          </div>

          <div class="window-content">
            <h2>Make this tab yours.</h2>

            <p>
              Drag things around, add widgets and create a workspace
              that feels like you.
            </p>
          </div>

        </section>

      </section>

    </main>

    <!-- NOTES PAGE -->
    <main id="notes-page" class="page notes-page">

      <div class="notes-page-inner">

        <div class="notes-page-heading">
          <h2>Notes</h2>
          <p>Your peeled notes are kept here.</p>
        </div>

        <div id="savedNotesList" class="saved-notes-list"></div>

        <div
          id="emptyNotesMessage"
          class="empty-notes-message"
        >
          No peeled notes yet.
        </div>

      </div>

    </main>

  </div>

  <!-- WIDGET MENU -->
  <div id="widgetMenu" class="widget-menu hidden">

    <div class="widget-menu-card">

      <div class="menu-heading">

        <h2>Add something</h2>

        <button id="closeMenu">
          ×
        </button>

      </div>

      <button class="widget-option" data-add="clock">
        Clock
      </button>

      <button class="widget-option" data-add="weather">
        Weather
      </button>

      <button class="widget-option" data-add="notes">
        Notes
      </button>

      <button class="widget-option" data-add="welcome">
        Welcome card
      </button>

      <button class="widget-option" data-add="apod">
        NASA APOD
      </button>

    </div>

  </div>
`;

const workspace = document.querySelector("#workspace");
const addWidgetBtn = document.querySelector("#addWidgetBtn");
const widgetMenu = document.querySelector("#widgetMenu");
const closeMenu = document.querySelector("#closeMenu");
const resetBtn = document.querySelector("#resetBtn");

const workspacePage = document.querySelector("#workspacePage");
const notesPage = document.querySelector("#notes-page");

const savedNotesList = document.querySelector("#savedNotesList");
const emptyNotesMessage = document.querySelector("#emptyNotesMessage");

let highestZIndex = 10;

function setupNavigation() {

  document.querySelectorAll(".sidebar-item").forEach((button) => {

    button.addEventListener("click", () => {

      const page = button.dataset.page;

      document
        .querySelectorAll(".sidebar-item")
        .forEach((item) => {
          item.classList.remove("active");
        });

      button.classList.add("active");

      if (page === "workspace") {

        workspacePage.classList.add("active-page");
        notesPage.classList.remove("active-page");

      }

      if (page === "notes-page") {

        workspacePage.classList.remove("active-page");
        notesPage.classList.add("active-page");

        renderSavedNotes();

      }

    });

  });

}

function updateClock() {

  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  document.querySelectorAll(".clock-time").forEach((element) => {
    element.textContent = time;
  });

  document.querySelectorAll(".clock-date").forEach((element) => {
    element.textContent = date;
  });

}

function bringToFront(element) {

  highestZIndex += 1;

  element.style.zIndex = highestZIndex;

}

function makeDraggable(element) {

  const bar = element.querySelector(".window-bar");

  if (!bar) {
    return;
  }

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  bar.addEventListener("pointerdown", (event) => {

    if (event.target.closest("button")) {
      return;
    }

    dragging = true;

    bringToFront(element);

    const rect = element.getBoundingClientRect();

    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    bar.setPointerCapture(event.pointerId);

  });

  bar.addEventListener("pointermove", (event) => {

    if (!dragging) {
      return;
    }

    const workspaceRect =
      workspace.getBoundingClientRect();

    let left =
      event.clientX -
      workspaceRect.left -
      offsetX;

    let top =
      event.clientY -
      workspaceRect.top -
      offsetY;

    const maxLeft = Math.max(
      0,
      workspace.clientWidth -
      element.offsetWidth
    );

    const maxTop = Math.max(
      0,
      workspace.clientHeight -
      element.offsetHeight
    );

    left = Math.max(
      0,
      Math.min(left, maxLeft)
    );

    top = Math.max(
      0,
      Math.min(top, maxTop)
    );

    element.style.left = `${left}px`;
    element.style.top = `${top}px`;

  });

  bar.addEventListener("pointerup", (event) => {

    dragging = false;

    if (bar.hasPointerCapture(event.pointerId)) {
      bar.releasePointerCapture(event.pointerId);
    }

    saveLayout();

  });

  bar.addEventListener("pointercancel", () => {

    dragging = false;

  });

  element.addEventListener("pointerdown", () => {

    bringToFront(element);

  });

}

function saveLayout() {

  const layout = {};

  document
    .querySelectorAll(".nova-window")
    .forEach((element) => {

      const widget = element.dataset.widget;

      layout[widget] = {

        left: element.style.left || "",
        top: element.style.top || "",
        zIndex: element.style.zIndex || "",

        hidden:
          element.classList.contains("hidden")

      };

    });

  localStorage.setItem(
    "novatab-layout",
    JSON.stringify(layout)
  );

}


function loadLayout() {

  const saved =
    localStorage.getItem("novatab-layout");

  if (!saved) {
    return;
  }

  try {

    const layout = JSON.parse(saved);

    Object.entries(layout).forEach(
      ([widget, savedWindow]) => {

        let element =
          document.querySelector(
            `.nova-window[data-widget="${widget}"]`
          );

        if (!element && !savedWindow.hidden) {

          createWidget(widget);

          element =
            document.querySelector(
              `.nova-window[data-widget="${widget}"]:last-child`
            );

        }

        if (!element) {
          return;
        }

        if (savedWindow.left) {
          element.style.left =
            savedWindow.left;
        }

        if (savedWindow.top) {
          element.style.top =
            savedWindow.top;
        }

        if (savedWindow.zIndex) {
          element.style.zIndex =
            savedWindow.zIndex;
        }

        if (savedWindow.hidden) {
          element.classList.add("hidden");
        } else {
          element.classList.remove("hidden");
        }

      }
    );

  } catch (error) {

    console.error(
      "Could not restore NovaTab layout:",
      error
    );

    localStorage.removeItem("novatab-layout");

  }

}

function setupCloseButtons() {

  document
    .querySelectorAll(".close-widget")
    .forEach((button) => {

      button.onclick = () => {

        const element =
          button.closest(".nova-window");

        if (!element) {
          return;
        }

        element.classList.add("hidden");

        saveLayout();

      };

    });

}

function getNotes() {

  try {

    const saved =
      localStorage.getItem("novatab-notes-list");

    if (!saved) {
      return [];
    }

    const notes = JSON.parse(saved);

    return Array.isArray(notes)
      ? notes
      : [];

  } catch {

    return [];

  }

}


function saveNotes(notes) {

  localStorage.setItem(
    "novatab-notes-list",
    JSON.stringify(notes)
  );

}

function createNewNoteData() {

  return {

    id:
      Date.now().toString() +
      Math.random().toString(36).slice(2),

    text: "",

    createdAt:
      new Date().toISOString(),

    peeledAt: null

  };

}

function setupNotes() {

  document
    .querySelectorAll(".notes-window")
    .forEach((windowElement) => {

      const textarea =
        windowElement.querySelector(".notes");

      if (!textarea) {
        return;
      }

      setupStickyNoteBundle(
        windowElement,
        textarea
      );

    });

}


function setupStickyNoteBundle(
  windowElement,
  textarea
) {

  let notes = getNotes();

  let activeNotes =
    notes.filter(
      (note) => !note.peeledAt
    );

  if (activeNotes.length === 0) {

    const newNote =
      createNewNoteData();

    notes.push(newNote);

    saveNotes(notes);

    activeNotes = [newNote];

  }

  const currentNote =
    activeNotes[activeNotes.length - 1];

  textarea.value =
    currentNote.text || "";

  let peelCorner =
    windowElement.querySelector(".note-peel-corner");

  if (!peelCorner) {

    peelCorner =
      document.createElement("button");

    peelCorner.className =
      "note-peel-corner";

    peelCorner.type = "button";

    peelCorner.setAttribute(
      "aria-label",
      "Peel off note"
    );

    windowElement
      .querySelector(".window-content")
      .appendChild(peelCorner);

  }

  textarea.addEventListener("input", () => {

    const allNotes = getNotes();

    const note =
      allNotes.find(
        (item) =>
          item.id === currentNote.id
      );

    if (!note) {
      return;
    }

    note.text = textarea.value;

    saveNotes(allNotes);

  });

  peelCorner.addEventListener(
    "click",
    () => {

      peelNote(
        windowElement,
        currentNote.id
      );

    }
  );

  updateStickyStack(
    windowElement
  );

}

function updateStickyStack(windowElement) {

  const notes =
    getNotes().filter(
      (note) => !note.peeledAt
    );

  const stackCount =
    Math.min(notes.length, 4);

  windowElement
    .style.setProperty(
      "--note-stack-count",
      stackCount
    );

}

function peelNote(
  windowElement,
  noteId
) {

  const notes = getNotes();

  const note =
    notes.find(
      (item) => item.id === noteId
    );

  if (!note) {
    return;
  }

  if (!note.text.trim()) {

    note.peeledAt =
      new Date().toISOString();

    saveNotes(notes);

    createNextStickyNote(
      windowElement
    );

    return;

  }

  windowElement.classList.add(
    "peeling-note"
  );

  setTimeout(() => {

    note.peeledAt =
      new Date().toISOString();

    saveNotes(notes);

    windowElement.classList.remove(
      "peeling-note"
    );

    createNextStickyNote(
      windowElement
    );

    renderSavedNotes();

  }, 550);

}

function createNextStickyNote(
  windowElement
) {

  const notes = getNotes();

  const newNote =
    createNewNoteData();

  notes.push(newNote);

  saveNotes(notes);

  const textarea =
    windowElement.querySelector(".notes");

  if (textarea) {

    textarea.value = "";

    textarea.focus();

  }

  updateStickyStack(
    windowElement
  );

}

function renderSavedNotes() {

  const notes =
    getNotes().filter(
      (note) => note.peeledAt
    );

  savedNotesList.innerHTML = "";

  if (notes.length === 0) {

    emptyNotesMessage.classList.remove(
      "hidden"
    );

    return;

  }

  emptyNotesMessage.classList.add(
    "hidden"
  );

  notes
    .slice()
    .reverse()
    .forEach((note) => {

      const article =
        document.createElement("article");

      article.className =
        "saved-note";

      article.dataset.noteId =
        note.id;

      const text =
        document.createElement("p");

      text.textContent =
        note.text;

      const date =
        document.createElement("small");

      date.textContent =
        formatNoteDate(note.peeledAt);

      const deleteButton =
        document.createElement("button");

      deleteButton.type = "button";

      deleteButton.className =
        "delete-saved-note";

      deleteButton.textContent =
        "Remove";

      deleteButton.setAttribute(
        "aria-label",
        "Remove this note"
      );

      deleteButton.addEventListener(
        "click",
        () => {

          deleteSavedNote(
            note.id
          );

        }
      );

      article.appendChild(text);
      article.appendChild(date);
      article.appendChild(deleteButton);

      savedNotesList.appendChild(
        article
      );

    });

}


function formatNoteDate(dateString) {

  const date =
    new Date(dateString);

  return date.toLocaleDateString(
    [],
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


function deleteSavedNote(noteId) {

  const notes = getNotes();

  const remaining =
    notes.filter(
      (note) =>
        note.id !== noteId
    );

  saveNotes(remaining);

  renderSavedNotes();

}

function weatherCodeText(code) {

  if (code === 0) return "Clear sky";

  if (code === 1 || code === 2)
    return "Partly cloudy";

  if (code === 3)
    return "Cloudy";

  if (code === 45 || code === 48)
    return "Foggy";

  if (code >= 51 && code <= 57)
    return "Drizzle";

  if (code >= 61 && code <= 67)
    return "Rain";

  if (code >= 71 && code <= 77)
    return "Snow";

  if (code >= 80 && code <= 82)
    return "Rain showers";

  if (code >= 85 && code <= 86)
    return "Snow showers";

  if (code >= 95 && code <= 99)
    return "Thunderstorm";

  return "Unknown conditions";

}


function setupWeather() {

  document
    .querySelectorAll(".weather-form")
    .forEach((form) => {

      form.addEventListener(
        "submit",
        async (event) => {

          event.preventDefault();

          const windowElement =
            form.closest(".nova-window");

          const cityInput =
            form.querySelector(
              ".city-input"
            );

          const status =
            windowElement.querySelector(
              ".weather-status"
            );

          const result =
            windowElement.querySelector(
              ".weather-result"
            );

          const city =
            cityInput.value.trim();

          if (!city) {

            status.textContent =
              "Please enter a city.";

            return;

          }

          status.textContent =
            "Looking up the weather...";

          result.innerHTML = "";

          try {

            const locationResponse =
              await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
              );

            if (!locationResponse.ok) {

              throw new Error(
                "Could not find that city."
              );

            }

            const locationData =
              await locationResponse.json();

            if (
              !locationData.results ||
              locationData.results.length === 0
            ) {

              throw new Error(
                "City not found."
              );

            }

            const location =
              locationData.results[0];

            const weatherResponse =
              await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
              );

            if (!weatherResponse.ok) {

              throw new Error(
                "Weather service is unavailable."
              );

            }

            const weatherData =
              await weatherResponse.json();

            const current =
              weatherData.current;

            status.textContent =
              `${location.name}, ${location.country}`;

            result.innerHTML = `
              <div class="weather-main">
                <strong>
                  ${Math.round(current.temperature_2m)}°C
                </strong>

                <span>
                  ${weatherCodeText(current.weather_code)}
                </span>
              </div>

              <p>
                Humidity:
                ${current.relative_humidity_2m}%
              </p>

              <p>
                Wind:
                ${Math.round(current.wind_speed_10m)}
                km/h
              </p>
            `;

          } catch (error) {

            status.textContent =
              error.message;

          }

        }
      );

    });

}

async function setupApod(windowElement) {

  const status =
    windowElement.querySelector(
      ".apod-status"
    );

  const content =
    windowElement.querySelector(
      ".apod-content"
    );

  const image =
    windowElement.querySelector(
      ".apod-image"
    );

  const title =
    windowElement.querySelector(
      ".apod-title"
    );

  const date =
    windowElement.querySelector(
      ".apod-date"
    );

  const explanation =
    windowElement.querySelector(
      ".apod-explanation"
    );

  if (!status || !content) {
    return;
  }

  const apiKey =
    import.meta.env.VITE_NASA_API_KEY;

  if (!apiKey) {

    status.textContent =
      "NASA API key is missing.";

    return;

  }

  try {

    const response =
      await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(apiKey)}`
      );

    if (!response.ok) {

      throw new Error(
        "Could not load NASA APOD."
      );

    }

    const data =
      await response.json();

    if (data.media_type === "image") {

      image.src =
        data.url;

      image.alt =
        data.title ||
        "NASA Astronomy Picture of the Day";

      title.textContent =
        data.title ||
        "Astronomy Picture of the Day";

      date.textContent =
        data.date || "";

      explanation.textContent =
        data.explanation || "";

      status.classList.add(
        "hidden"
      );

      content.classList.remove(
        "hidden"
      );

    } else if (
      data.media_type === "video"
    ) {

      content.innerHTML = `
        <iframe
          class="apod-video"
          src="${data.url}"
          title="${data.title || "NASA APOD"}"
          allowfullscreen
        ></iframe>

        <h3 class="apod-title">
          ${data.title || "NASA APOD"}
        </h3>

        <p class="apod-date">
          ${data.date || ""}
        </p>

        <p class="apod-explanation">
          ${data.explanation || ""}
        </p>
      `;

      status.classList.add(
        "hidden"
      );

      content.classList.remove(
        "hidden"
      );

    } else {

      status.textContent =
        "NASA APOD is unavailable.";

    }

  } catch (error) {

    status.textContent =
      error.message;

  }

}

function createWidget(type) {

  const templates = {

    clock: `
      <section
        class="nova-window clock-window"
        data-widget="clock"
      >

        <div class="window-bar">

          <span class="window-title">
            Clock
          </span>

          <button
            class="close-widget"
            aria-label="Close clock"
          >
            ×
          </button>

        </div>

        <div class="window-content">

          <div class="clock-time">
            00:00
          </div>

          <div class="clock-date">
            Loading date...
          </div>

        </div>

      </section>
    `,

    weather: `
      <section
        class="nova-window weather-window"
        data-widget="weather"
      >

        <div class="window-bar">

          <span class="window-title">
            Weather
          </span>

          <button
            class="close-widget"
            aria-label="Close weather"
          >
            ×
          </button>

        </div>

        <div class="window-content">

          <p class="weather-status">
            Enter a city to check the weather.
          </p>

          <form class="weather-form">

            <input
              class="city-input"
              type="text"
              placeholder="Enter your city"
              autocomplete="off"
            />

            <button type="submit">
              Check
            </button>

          </form>

          <div class="weather-result"></div>

        </div>

      </section>
    `,

    notes: `
      <section
        class="nova-window notes-window"
        data-widget="notes"
      >

        <div class="window-bar">

          <span class="window-title">
            Little Notes
          </span>

          <button
            class="close-widget"
            aria-label="Close notes"
          >
            ×
          </button>

        </div>

        <div class="window-content">

          <div class="note-stack">

            <textarea
              class="notes"
              placeholder="Write something here..."
            ></textarea>

            <button
              class="note-peel-corner"
              type="button"
              aria-label="Peel off note"
            ></button>

          </div>

        </div>

      </section>
    `,

    welcome: `
      <section
        class="nova-window welcome-window"
        data-widget="welcome"
      >

        <div class="window-bar">

          <span class="window-title">
            Welcome
          </span>

          <button
            class="close-widget"
            aria-label="Close welcome"
          >
            ×
          </button>

        </div>

        <div class="window-content">

          <h2>
            Make this tab yours.
          </h2>

          <p>
            Drag things around, add widgets and create a workspace
            that feels like you.
          </p>

        </div>

      </section>
    `,

    apod: `
      <section
        class="nova-window apod-window"
        data-widget="apod"
      >

        <div class="window-bar">

          <span class="window-title">
            NASA APOD
          </span>

          <button
            class="close-widget"
            aria-label="Close NASA APOD"
          >
            ×
          </button>

        </div>

        <div class="window-content">

          <p class="apod-status">
            Loading NASA's Astronomy Picture of the Day...
          </p>

          <div class="apod-content hidden">

            <img
              class="apod-image"
              alt="NASA Astronomy Picture of the Day"
            />

            <h3 class="apod-title"></h3>

            <p class="apod-date"></p>

            <p class="apod-explanation"></p>

          </div>

        </div>

      </section>
    `

  };

  if (!templates[type]) {
    return;
  }

  workspace.insertAdjacentHTML(
    "beforeend",
    templates[type]
  );

  const newWidget =
    workspace.querySelector(
      `.nova-window[data-widget="${type}"]:last-child`
    );

  if (!newWidget) {
    return;
  }

  newWidget.style.left =
    `${80 + Math.random() * 200}px`;

  newWidget.style.top =
    `${100 + Math.random() * 150}px`;

  bringToFront(newWidget);

  makeDraggable(newWidget);

  setupCloseButtons();

  if (type === "notes") {
    setupNotes();
  }

  if (type === "weather") {
    setupWeather();
  }

  if (type === "apod") {
    setupApod(newWidget);
  }

  updateClock();

  saveLayout();

}

addWidgetBtn.addEventListener(
  "click",
  () => {

    widgetMenu.classList.remove(
      "hidden"
    );

  }
);


closeMenu.addEventListener(
  "click",
  () => {

    widgetMenu.classList.add(
      "hidden"
    );

  }
);


widgetMenu.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest(
        ".widget-option"
      );

    if (!button) {
      return;
    }

    const widgetType =
      button.dataset.add;

    const existing =
      document.querySelector(
        `.nova-window[data-widget="${widgetType}"]`
      );

    if (existing) {

      existing.classList.remove(
        "hidden"
      );

      bringToFront(existing);

      widgetMenu.classList.add(
        "hidden"
      );

      saveLayout();

      return;

    }

    createWidget(widgetType);

    widgetMenu.classList.add(
      "hidden"
    );

  }
);


widgetMenu.addEventListener(
  "pointerdown",
  (event) => {

    if (event.target === widgetMenu) {

      widgetMenu.classList.add(
        "hidden"
      );

    }

  }
);

resetBtn.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "novatab-layout"
    );

    localStorage.removeItem(
      "novatab-notes"
    );

    localStorage.removeItem(
      "novatab-notes-list"
    );

    location.reload();

  }
);

setupNavigation();

document
  .querySelectorAll(".nova-window")
  .forEach((element) => {

    makeDraggable(element);

  });

setupCloseButtons();

setupNotes();

setupWeather();

setInterval(
  updateClock,
  1000
);

loadLayout();

updateClock();

renderSavedNotes();