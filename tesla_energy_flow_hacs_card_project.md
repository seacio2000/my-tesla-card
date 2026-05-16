# Tesla Energy Flow Card for Home Assistant

## Folder Structure

```text
custom_components/
└── tesla-energy-flow/
    ├── hacs.json
    ├── package.json
    ├── README.md
    └── dist/
        └── tesla-energy-flow.js
```

---

# dist/tesla-energy-flow.js

```javascript
class TeslaEnergyFlowCard extends HTMLElement {

  setConfig(config) {
    this.config = config;

    if (!this.content) {
      this.innerHTML = `
        <ha-card>
          <div id="root"></div>
        </ha-card>
      `;

      this.content = this.querySelector('#root');
    }
  }

  set hass(hass) {

    const solar = hass.states[this.config.solar_entity]?.state || 0;
    const battery = hass.states[this.config.battery_entity]?.state || 0;
    const grid = hass.states[this.config.grid_entity]?.state || 0;
    const home = hass.states[this.config.home_entity]?.state || 0;

    const weatherState = hass.states[this.config.weather_entity]?.state || 'clear';
    const temperature = hass.states[this.config.weather_entity]?.attributes?.temperature || '--';

    const sun = hass.states['sun.sun']?.state || 'below_horizon';

    const evSoc = hass.states[this.config.ev_battery_entity]?.state || 0;

    const evCharging = hass.states[this.config.ev_charging_entity]?.state === 'on';

    const background = sun === 'above_horizon'
      ? `linear-gradient(180deg,#5f8ec9 0%,#27405f 35%,#111827 100%)`
      : `linear-gradient(180deg,#02040a 0%,#07101c 45%,#0b1220 100%)`;

    this.content.innerHTML = `

      <style>

        * {
          box-sizing: border-box;
          font-family: Inter, sans-serif;
        }

        .wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          border-radius: 28px;
          background: ${background};
          color: white;
        }

        .ambient {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: rgba(56,210,122,0.08);
          filter: blur(120px);
          left: 50%;
          top: 45%;
          transform: translate(-50%, -50%);
        }

        .topbar {
          position: absolute;
          top: 24px;
          left: 24px;
          right: 24px;
          display: flex;
          gap: 18px;
          z-index: 20;
        }

        .glass {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 20px;
          min-width: 170px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
        }

        .title {
          opacity: 0.65;
          font-size: 15px;
          margin-bottom: 10px;
        }

        .value {
          font-size: 34px;
          font-weight: 600;
        }

        .scene {
          position: absolute;
          inset: 0;
        }

        .ev-panel {
          position: absolute;
          right: 24px;
          top: 140px;
          width: 320px;
          z-index: 20;
        }

        .weather {
          position: absolute;
          left: 24px;
          bottom: 24px;
          width: 260px;
          z-index: 20;
        }

        .chart {
          position: absolute;
          left: 320px;
          right: 24px;
          bottom: 24px;
          height: 180px;
          z-index: 20;
          display: flex;
          gap: 10px;
          align-items: end;
        }

        .bar {
          flex: 1;
          border-radius: 12px 12px 4px 4px;
          background: linear-gradient(
            180deg,
            rgba(56,210,122,0.95),
            rgba(56,210,122,0.15)
          );
        }

        @keyframes flow {
          0% {
            stroke-dashoffset: 220;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .flow {
          stroke-dasharray: 12;
          animation: flow 3s linear infinite;
        }

        .pulse {
          animation: pulse 2s ease infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }

      </style>

      <div class="wrapper">

        <div class="ambient"></div>

        <div class="topbar">

          ${this.card('☀️ Solar', solar + ' W')}
          ${this.card('🏠 Home', home + ' W')}
          ${this.card('🔋 Battery', battery + '%')}
          ${this.card('⚡ Grid', grid + ' W')}

        </div>

        <div class="scene">

          <svg viewBox="0 0 1600 900"
               width="100%"
               height="100%"
               xmlns="http://www.w3.org/2000/svg">

            <ellipse cx="800"
                     cy="720"
                     rx="420"
                     ry="80"
                     fill="rgba(0,0,0,0.35)"/>

            <rect x="560"
                  y="300"
                  width="480"
                  height="300"
                  rx="34"
                  fill="#171f2c"/>

            <polygon points="520,340 800,150 1080,340"
                     fill="#252f3d"/>

            <rect x="660"
                  y="220"
                  width="280"
                  height="70"
                  rx="12"
                  fill="#0b1220"/>

            <rect x="640"
                  y="380"
                  width="90"
                  height="90"
                  rx="18"
                  fill="#ffd88c"/>

            <rect x="870"
                  y="380"
                  width="90"
                  height="90"
                  rx="18"
                  fill="#ffd88c"/>

            <rect x="300"
                  y="350"
                  width="120"
                  height="220"
                  rx="22"
                  fill="#1f2937"/>

            <rect x="1260"
                  y="260"
                  width="80"
                  height="320"
                  rx="18"
                  fill="#293445"/>

            <rect x="1080"
                  y="650"
                  width="260"
                  height="110"
                  rx="34"
                  fill="#1b2330"/>

            <line x1="800"
                  y1="290"
                  x2="800"
                  y2="360"
                  stroke="#ffb347"
                  stroke-width="8"
                  class="flow"/>

            <line x1="420"
                  y1="460"
                  x2="560"
                  y2="460"
                  stroke="#38d27a"
                  stroke-width="8"
                  class="flow"/>

            <line x1="1260"
                  y1="420"
                  x2="1040"
                  y2="420"
                  stroke="#60a5fa"
                  stroke-width="8"
                  class="flow"/>

            ${evCharging ? `
              <line x1="1040"
                    y1="600"
                    x2="1150"
                    y2="650"
                    stroke="#a855f7"
                    stroke-width="8"
                    class="flow"/>
            ` : ''}

            <circle cx="800"
                    cy="360"
                    r="10"
                    fill="#ffb347"
                    class="pulse"/>

            <circle cx="560"
                    cy="460"
                    r="10"
                    fill="#38d27a"
                    class="pulse"/>

            <circle cx="1040"
                    cy="420"
                    r="10"
                    fill="#60a5fa"
                    class="pulse"/>

          </svg>

        </div>

        <div class="ev-panel glass">

          <div class="title">Tesla Vehicle</div>
          <div class="value">${evSoc}%</div>

          <div style="margin-top:12px; opacity:0.7;">
            ${evCharging ? 'Charging' : 'Parked'}
          </div>

          <div style="
            margin-top:24px;
            height:10px;
            border-radius:10px;
            overflow:hidden;
            background:rgba(255,255,255,0.08);
          ">

            <div style="
              width:${evSoc}%;
              height:100%;
              background:linear-gradient(90deg,#8b5cf6,#38d27a);
            "></div>

          </div>

        </div>

        <div class="weather glass">

          <div class="title">Weather</div>
          <div class="value">${temperature}°</div>

          <div style="margin-top:8px; opacity:0.7; text-transform:capitalize;">
            ${weatherState}
          </div>

        </div>

        <div class="chart glass">

          ${Array.from({length:24}).map(() => `
            <div class="bar"
                 style="height:${40 + Math.random() * 100}px"></div>
          `).join('')}

        </div>

      </div>

    `;
  }

  card(title, value) {
    return `
      <div class="glass">
        <div class="title">${title}</div>
        <div class="value">${value}</div>
      </div>
    `;
  }

  getCardSize() {
    return 6;
  }
}

customElements.define('tesla-energy-flow-card', TeslaEnergyFlowCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'tesla-energy-flow-card',
  name: 'Tesla Energy Flow Card',
  description: 'Tesla style animated energy dashboard'
});
```

---

# hacs.json

```json
{
  "name": "Tesla Energy Flow Card",
  "content_in_root": false,
  "filename": "tesla-energy-flow.js",
  "render_readme": true,
  "homeassistant": "2024.1.0"
}
```

---

# package.json

```json
{
  "name": "tesla-energy-flow-card",
  "version": "1.0.0",
  "description": "Tesla style energy dashboard for Home Assistant",
  "main": "dist/tesla-energy-flow.js",
  "scripts": {
    "build": "echo build complete"
  },
  "author": "Your Name",
  "license": "MIT"
}
```

---

# README.md

```md
# Tesla Energy Flow Card

Tesla-inspired animated Lovelace dashboard card for Home Assistant.

## Features

- Tesla style UI
- Animated energy flow
- Dynamic day/night backgrounds
- EV charging mode
- Weather integration
- SVG house scene
- Glassmorphism
- Responsive design

## Installation via HACS

### Custom Repository

Add repository:

```text
https://github.com/YOUR_GITHUB/tesla-energy-flow-card
```

Category:

```text
Dashboard
```

## Lovelace Configuration

```yaml
type: custom:tesla-energy-flow-card
solar_entity: sensor.solar_power
battery_entity: sensor.battery_soc
grid_entity: sensor.grid_power
home_entity: sensor.home_consumption
weather_entity: weather.home

# EV

ev_battery_entity: sensor.ev_battery
ev_charging_entity: binary_sensor.ev_charging
```

## Required Entities

```yaml
sensor.solar_power
sensor.battery_soc
sensor.grid_power
sensor.home_consumption
weather.home
sensor.ev_battery
binary_sensor.ev_charging
```
```

---

# GITHUB EXPORT

## 1. Create repo

Repo name:

```text
tesla-energy-flow-card
```

---

## 2. Upload files

Upload:

- hacs.json
- package.json
- README.md
- dist/tesla-energy-flow.js

---

## 3. Create release

GitHub → Releases → Create release

Tag:

```text
v1.0.0
```

---

## 4. Add to HACS

HACS → Custom repositories

Add:

```text
https://github.com/YOUR_GITHUB/tesla-energy-flow-card
```

Type:

```text
Dashboard
```

