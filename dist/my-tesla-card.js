class TeslaEnergyFlowCard extends HTMLElement {

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