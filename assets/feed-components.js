(() => {
  const channels = ["团购", "经验", "北京", "关注", "商城", "推荐"];
  const bottomItems = ["首页", "朋友", "发布", "消息", "我"];

  const defineComponent = (name, renderer) => {
    if (customElements.get(name)) {
      return;
    }

    customElements.define(name, class extends HTMLElement {
      connectedCallback() {
        if (this.dataset.rendered === "true") {
          return;
        }

        this.dataset.rendered = "true";
        this.innerHTML = renderer(this);
      }
    });
  };

  defineComponent("feed-status", () => `
    <div class="status-bar" aria-hidden="true">
      <span>9:41</span>
      <div class="system-icons">
        <span class="signal"><span></span><span></span><span></span><span></span></span>
        <span class="wifi"><i></i></span>
        <span class="battery"></span>
      </div>
    </div>
  `);

  defineComponent("feed-top-nav", (element) => {
    const active = element.getAttribute("active") || "推荐";
    const channelMarkup = channels.map((channel) => {
      const activeClass = channel === active ? " active" : "";
      return `<span class="channel${activeClass}">${channel}</span>`;
    }).join("");

    return `
      <nav class="top-nav" aria-label="频道导航">
        <button class="icon-button" type="button" aria-label="打开菜单">
          <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 14h34M7 24h34M7 34h34"></path></svg>
        </button>
        <div class="channels" aria-label="内容频道">${channelMarkup}</div>
        <button class="icon-button" type="button" aria-label="搜索">
          <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="21" r="13"></circle><path d="M31.5 31.5 42 42"></path></svg>
        </button>
      </nav>
    `;
  });

  defineComponent("feed-progress", (element) => {
    const fills = (element.getAttribute("fills") || "")
      .split(",")
      .map((value) => value.trim())
      .filter((value, index) => value || index < 5);

    while (fills.length < 5) {
      fills.push("");
    }

    const bars = fills.slice(0, 5).map((fill) => {
      const style = fill ? ` style="--fill: ${fill}%"` : "";
      return `<span${style}></span>`;
    }).join("");

    return `<div class="progress" aria-hidden="true">${bars}</div>`;
  });

  defineComponent("feed-actions", (element) => {
    const label = element.getAttribute("label") || "推荐操作";
    const primary = element.getAttribute("primary") || "查看详情";
    const secondary = element.getAttribute("secondary") || "不感兴趣";
    const order = element.getAttribute("order") || "secondary-primary";
    const buttonMap = {
      primary: `<button class="action-button" type="button">${primary}</button>`,
      secondary: `<button class="action-button secondary" type="button">${secondary}</button>`
    };
    const buttons = order.split("-").map((key) => buttonMap[key]).filter(Boolean).join("");

    return `<div class="action-row" aria-label="${label}">${buttons}</div>`;
  });

  defineComponent("feed-swipe-tip", (element) => {
    const text = element.getAttribute("text") || "上滑继续看推荐";

    return `
      <div class="swipe-tip" aria-hidden="true">
        <span class="chevrons"></span>
        <span>${text}</span>
      </div>
    `;
  });

  defineComponent("feed-bottom-nav", () => {
    const links = bottomItems.map((item, index) => {
      if (item === "发布") {
        return `
          <a class="bottom-link" href="#" aria-label="发布">
            <span class="plus-button" aria-hidden="true">
              <svg viewBox="0 0 48 48"><path d="M24 10v28M10 24h28"></path></svg>
            </span>
          </a>
        `;
      }

      const active = index === 0 ? " active" : "";
      const current = index === 0 ? ' aria-current="page"' : "";
      return `<a class="bottom-link${active}" href="#"${current}>${item}</a>`;
    }).join("");

    return `<nav class="bottom-nav" aria-label="底部导航">${links}</nav>`;
  });

  defineComponent("feed-home-indicator", () => '<span class="home-indicator" aria-hidden="true"></span>');
})();
