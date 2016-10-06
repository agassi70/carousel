class SliderElement extends HTMLElement {
  constructor() {
    super();
  }

  get delay() {
    return this.getAttribute('timeout') * 1000 || 5000;
  }

  get duration() {
    return +this.getAttribute('duration') || 500;
  }

  createdCallback() {
    this.attachShadow({ mode: 'open' });
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
        }

        .btn {
            position: relative;
            width: 35px;
            height: 35px;
            background-color: gray;
            border-radius: 50%;
        }

        .btn:hover, button:hover {
          cursor: pointer;
        }

        .btn::before {
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
      <div class="btn rear"></div>
      <div class="content">
        <div class="slides">
          <slot name="slide"></slot>
        </div>
      </div>
      <div class="btn front"></div>
      </section>
      <section>
      <button name="play"></button>
      <button name="pause"></button>
      </section>
      `;
    this.shadowRoot.innerHTML = style + html;
  }

  next() {
    this.counter++;
    const start = this.offset;
    const end = start - this.widthContent;
    this.offset = end;

    if (this.counter > this.numberOfImages) {
      this.counter = 1;
      this.offset = 0;
      this.slides.animate([{ transform: `translate(${start}px)` },
          { transform: `translate(${end}px)`, offset: 1 },
          { transform: 'translate(0px)' }],
        { duration: this.duration, fill: 'forwards' });
      this.dispatchEvent(new CustomEvent('slidechange', { bubbles: true, composed: true, detail: this.counter }));
      return;
    }

    this.slides.animate([{ transform: `translate(${start}px)` },
        { transform: `translate(${end}px)` }],
      { duration: this.duration, fill: 'forwards' });
    this.dispatchEvent(new CustomEvent('slidechange', { bubbles: true, composed: true, detail: this.counter }));
  }

  prev() {
    this.counter--;
    const start = this.offset;
    const end = start + this.widthContent;
    this.offset = end;

    if (this.counter === 0) {
      this.counter = this.numberOfImages;
      this.offset = -this.widthContent * (this.numberOfImages - 1);
      this.slides.animate([{ transform: `translate(${start}px)` },
          { transform: `translate(${this.offset - this.widthContent}px)`, offset: 0 },
          { transform: `translate(${this.offset}px)`, offset: 1 }],
        { duration: this.duration, fill: 'forwards' });
      this.dispatchEvent(new CustomEvent('slidechange', { bubbles: true, composed: true, detail: this.counter }));
      return;
    }

    this.slides.animate([{ transform: `translate(${start}px)` },
        { transform: `translate(${end}px)` }],
      { duration: this.duration, fill: 'forwards' });
    this.dispatchEvent(new CustomEvent('slidechange', { bubbles: true, composed: true, detail: this.counter }));
  }

  play() {
    const event = new CustomEvent('started', { bubbles: true, composed: true, detail: this.counter });
    this.dispatchEvent(event);
    this.timer = setInterval(() => this.next(), this.delay);
  }

  pause() {
    const event = new CustomEvent('stopped', { bubbles: true, composed: true, detail: this.counter });
    this.dispatchEvent(event);
    clearInterval(this.timer);
  }

  connectedCallback() {
    this.counter = 1;
    this.offset = 0;
    this.btnFront = this.shadowRoot.querySelector('.btn.front');
    this.btnRear = this.shadowRoot.querySelector('.btn.rear');
    this.btnPlay = this.shadowRoot.querySelector('[name="play"]');
    this.btnPause = this.shadowRoot.querySelector('[name="pause"]');
    this.slides = this.shadowRoot.querySelector('.slides');

    const { width, height } = this.shadowRoot.querySelector('.content').getBoundingClientRect();
    this.widthContent = width;
    this.heightContent = height;

    const images = this.shadowRoot.querySelector('slot').assignedNodes();
    this.numberOfImages = images.length;
    const cloneStart = images[0].cloneNode();
    this.shadowRoot.querySelector('.slides').appendChild(cloneStart);

    for (const image of images) {
      image.style.minWidth = `${this.widthContent}px`;
      image.style.height = `${this.heightContent}px`;
    }

    this.btnFront.addEventListener('click', () => this.next());

    this.btnRear.addEventListener('click', () => this.prev());

    this.btnPlay.addEventListener('click', () => this.play());

    this.btnPause.addEventListener('click', () => this.pause());
  }
}

customElements.define('my-carousel', SliderElement);
