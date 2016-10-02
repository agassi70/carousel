class SliderElement extends HTMLElement {
  constructor() {
    super();
  }

  createdCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const style = `<style>
        :host {
          display: block;
          background-color: #aaaaaa;
        }

        section {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        #main {
          height: 90%;
        }

        .content {
          box-sizing: border-box;
          border: 3px solid gray;
          width: 85%;
          height: 90%;
          overflow: hidden;
          margin: 0 20px;
        }

        .slides {
          display: flex;
          width: 100%;
        }

        .slides ::slotted(*) {
          margin: 0;
        }

        .button {
            position: relative;
            width: 35px;
            height: 35px;
            background-color: gray;
            border-radius: 50%;
        }

        .button:hover, button:hover {
          cursor: pointer;
        }

        .button::before {
          content: "";
          position: absolute;
          width: 15px;
          height: 15px;
          border-top: 2px solid white;
          border-right: 2px solid white;
        }

        .rear::before {
          transform: rotate(-135deg);
          top: 9px;
          left: 12px;
        }

        .front::before {
          transform: rotate(45deg);
          top: 9px;
          left: 6px;
        }

        button {
          width: 35px;
          height: 35px;
          border: 1px solid black;
          border-radius: 50%;
          margin: 0 20px;
          background: url('mediaicons.jpg') -44px -43px no-repeat;
          background-size: 300px 300px;
        }

        button[name="pause"] {
          background-position: -104px -43px;
        }
    </style>`;
    const html = `
      <section id="main">
      <div class="button rear"></div>
      <div class="content">
        <div class="slides">
          <slot name="slide"></slot>
        </div>
      </div>
      <div class="button front"></div>
      </section>
      <section>
      <button name="play"></button>
      <button name="pause"></button>
      </section>
      `;
    shadowRoot.innerHTML = style + html;
  }

  attachedCallback() {
    const btnRear = this.shadowRoot.querySelector('.button.rear');
    const btnFront = this.shadowRoot.querySelector('.button.front');
    const slides = this.shadowRoot.querySelector('.slides');
    const play = this.shadowRoot.querySelector('[name="play"]');
    const pause = this.shadowRoot.querySelector('[name="pause"]');
    const delay = this.getAttribute('timeout') * 1000 || 5000;
    const duration = +this.getAttribute('duration') || 500;
    let counter = 0;
    let timer;

    const { width: widthContent,
            height: heightContent } = this.shadowRoot.querySelector('.content').getBoundingClientRect();
    const images = this.shadowRoot.querySelector('slot').assignedNodes();
    const numberOfImages = images.length;
    const cloneStart = images[0].cloneNode();
    this.shadowRoot.querySelector('.slides').appendChild(cloneStart);

    for (const image of images) {
      image.style.minWidth = `${widthContent}px`;
      image.style.height = `${heightContent}px`;
    }

    btnFront.addEventListener('click', () => {
      const startOffset = -widthContent * counter++;
      const offset = startOffset - widthContent;

      if (counter >= numberOfImages) {
        counter = 0;
        slides.animate([{ transform: `translate(${startOffset}px)` },
            { transform: `translate(${offset}px)`, offset: 1 },
            { transform: 'translate(0px)' }],
          { duration, fill: 'forwards' });
        this.dispatchEvent(new CustomEvent('slidechange', { bubbles: true, composed: true, detail: counter }));
        return;
      }

      slides.animate([{ transform: `translate(${startOffset}px)` },
          { transform: `translate(${offset}px)` }],
        { duration, fill: 'forwards' });
      this.dispatchEvent(new CustomEvent('slidechange', { bubbles: true, composed: true, detail: counter }));
    });

    btnRear.addEventListener('click', () => {
      const startOffset = -widthContent * counter--;
      const offset = startOffset + widthContent;

      if (counter < 0) {
        counter = numberOfImages - 1;
        slides.animate([{ transform: `translate(${startOffset}px)` },
            { transform: `translate(-${widthContent * numberOfImages}px)`, offset: 0 },
            { transform: `translate(-${widthContent * (numberOfImages - 1)}px)`, offset: 1 }],
          { duration, fill: 'forwards' });
        this.dispatchEvent(new CustomEvent('slidechange', { bubbles: true, composed: true, detail: counter }));
        return;
      }

      slides.animate([{ transform: `translate(${startOffset}px)` },
          { transform: `translate(${offset}px)` }],
        { duration, fill: 'forwards' });
      this.dispatchEvent(new CustomEvent('slidechange', { bubbles: true, composed: true, detail: counter }));
    });

    function slide() {
      const startOffset = -widthContent * counter++;
      const offset = startOffset - widthContent;

      if (counter >= numberOfImages) {
        counter = 0;
        slides.animate([{ transform: `translate(${startOffset}px)` },
            { transform: `translate(${offset}px)`, offset: 1 },
            { transform: 'translate(0px)' }],
          { duration, fill: 'forwards' });
        return;
      }

      slides.animate([{ transform: `translate(${startOffset}px)` },
          { transform: `translate(${offset}px)` }],
        { duration, fill: 'forwards' });
    }

    play.addEventListener('click', () => {
      const event = new CustomEvent('started', { bubbles: true, composed: true, detail: counter });
      this.dispatchEvent(event);
      timer = setInterval(slide, delay);
    });

    pause.addEventListener('click', () => {
      const event = new CustomEvent('stopped', { bubbles: true, composed: true, detail: counter });
      this.dispatchEvent(event);
      clearInterval(timer);
    });
  }
}

document.registerElement('my-carousel', SliderElement);
