class ScrollFrameAnimation {
  constructor(options) {
    this.defaultOptions = {
      target: "[data-scroll-frame-target]",
      filePath: "../assets/img/",
      prefix: "",
      ext: ".jpg",
      amount: 30,
      count: 50,
    };
    this.options = Object.assign(this.defaultOptions, options);

    this.canvas = document.querySelector(this.options.target);
    this.ctx = this.canvas?.getContext("2d");

    this.index = 0;
    this.position = 0;
    this.images = [];

    if (!this.canvas || !this.ctx) {
      return;
    }

    this._init();
  }

  _init() {
    this._setPosition();
    this._preload();
    this._setFrame();

    window.addEventListener("scroll", this._setFrame.bind(this));
    window.addEventListener("resize", this._setPosition.bind(this));
  }

  async _draw(index) {
    const image = await this.images[index];

    if (image) {
      this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  _setFrame() {
    this.index = Math.min(Math.floor(Math.max(scrollY - this.position, 0) / this.options.amount), this.options.count - 1);
    this._draw(this.index);
  }

  _setPosition() {
    this.position = this.canvas.getBoundingClientRect().top - this.index * this.options.amount + scrollY;
  }

  _loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => {
        resolve(image);
      });

      image.addEventListener("error", () => {
        reject();
      });

      image.src = src;
    });
  }

  _preload() {
    this.images = [...Array(this.options.count)].map(async (_, index) => {
      const fileName = `${this.options.filePath}${this.options.prefix}${index + 1}${this.options.ext}`;

      return await this._loadImage(fileName);
    });
  }
}

new ScrollFrameAnimation();
