const app = document.querySelector("#app");

app.innerHTML = `
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

  <main id="workspace" class="workspace">
    <section class="nova-window clock-window" data-widget="clock">
      <div class="window-bar">
        <span class="window-title">Clock</span>
        <button class="close-widget" aria-label="Close clock">x</button>
      </div>

      <div class="window-content">
        <div id="clockTime">00:00</div>
        <div id="clockDate">Loading date...</div>
      </div>
    </section>

    <section class="nova-window weather-window" data-widget="weather">
      <div class="window-bar">
        <span class="window-title">Weather</span>
        <button class="close-widget" aria-label="Close Weather">x</button>
      </div>

      <div class="window-content">
        <p id="weatherStatus">Enter a city to check the weather.</p>

        <form id="weatherForm">
          <input
            id="cityInput"
            type="text"
            placeholder="Enter your city"
            autocomplete="off"
            />
            <button type="submit">Check</button>
        </form>

        <div id="weatherResult"></div>
      </div>
    </section>

    <section class="nova-window notes-window" data-widget="notes">
      <div class="window-bar">
        <span clas="window-title">Little Notes</span>
        <button class="close-widget" aria-label="Close notes">x</button>
      </div>

      <div class="window-content">
        <textarea
        id="notes"
        placeholder="Write something here..."
        ></textarea>
      </div>
    </section>

    <section class="nova-window welcome-window" data-widget="welcome">
      <div class="window-bar">
        <span class="window-title">Welcome</span>
        <button class="close-widget" aria-label="Close welcome">x</button>
      </div>

      <div class="window-content">
        <h2>Make this tab yours.</h2>
        <p>
          Drag things around, add widgets and create a workspace
          that feels like you.
        </p>
      </div>
    </section>
  </main>

  <div id="widgetMenu" class="widget-menu hidden">
    <div class="widget-menu-card">
      <div class="menu-heading">
        <h2>Add something</h2>
        <button id="closeMenu">x</button>
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
    </div>
  </div>
`;

const workspace = document.querySelector("#workspace");
const addWidgetBtn = document.querySelector("#addWidgetBtn");
const widgetMenu = document.querySelector("#widgetMenu");
const closeMenu = document.querySelector("#closeMenu");
const resetBtn = document.querySelector("#resetBtn");

function updateClock(){
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

  const clockTime = document.querySelector("#clockTime");
  const clockDate = document.querySelector("#clockDate");

  if (clockTime) clockTime.textContent = time;
  if (clockDate) clockDate.textContent = date;
}

updateClock();
setInterval(updateClock, 1000);

let highestZIndex = 10;

function makeDraggable(element){
  const bar = element.querySelector(".window-bar");

  if (!bar) return;
  let dragging = false;
  let offsetX = 0;
  let offSetY = 0;

  bar.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;

    dragging = true;

    highestZIndex += 1;
    element.style.ZIndex = highestZIndex;

    const rect = element.getBoundingClientRect();

    offSetX = event.clientX - rect.left;
    offSetY = event.clientY - rect.top;

    bar.setPointerCapture(event.pointerId);
  });

  bar.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const workspaceRect = workspace.getBoundingClientRect();

    let left = event.clientX - workspaceRect.left - offsetX;
    let top = event.clientY - workspaceRect.top - offSetY;

    left = Math.max(0, left);
    top = Math.max(0, top);

    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
  });
  
  bar.addEventListener("pointerup", () => {
    dragging = false;
    saveLayout();
  });

  element.addEventListener("pointerdown", () => {
    highestZIndex += 1;
    element.style.zIndex = highestZIndex;
  });
}

function saveLayout(){
  const layout = {};

  document.querySelectorAll(".nova-window").forEach((window) => {
    const widget = window.dataset.widget;

    layout[widget] = {
      left: window.style.left,
      top: window.style.top,
      zIndex: window.style.zIndex,
      hidden: window.classList.contains("hidden")
    };
  });

  localStorage.setItem("novatab-layout", JSON.stringify(layout));
}

function loadLayout(){
  const saved = localStorage.getItem("novatab-layout");

  if(!saved) return;

  try {
    const layout = JSON.parse(saved);

    document.querySelectorAll(".nova-window").forEach((window) => {
      const widget = window.dataset.widget;
      const savedWindow = layout[widget];

      if(!savedWindow) return;

      if(savedWindow.left) {
        window.style.left = savedWindow.left;
      }

      if(savedWindow.top) {
        window.style.top = savedWindow.top;
      }

      if(savedWindow.zIndex) {
        window.style.zIndex = savedWindow.zIndex;
      }

      if(savedWindow.hidden) {
        window.classList.add("hidden");
      }
    });
  } catch (error) {
    console.log("Could not load NovaTab layout.", error);
  }
}

function setupCloseButons() {
  document.querySelectorAll(".close-widget").forEach((button) => {
    button.addEventListener("click",  () => {
      const window = button.closest(".nova-window");

      if(!windwo) return;

      window.classList.add("hidden");
      saveLayout();
    });
  });
}

const weatherForm = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#cityInput");
const weatherStatus = document.querySelector("#weatherStatus");
const weatherResult = document.querySelector("#weatherResult");
