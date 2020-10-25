class Painter {
  constructor() {
    this._display = document.getElementById('picture');
    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    this.img = new Image;
    this.size = { coefficient: 1 }
    this.color = {
      red: 0,
      green: 0,
      blue: 0,
      opacity: 0,
    }
    this._widthInput = document.querySelector(`#size-width`);
    this._heightInput = document.querySelector(`#size-height`);
  }
  initPainter(file) {
    const reader = new FileReader;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.img.src = reader.result
      this.img.onload = () => {
        this.size.width = this.img.naturalWidth;
        this.size.height = this.img.naturalHeight;
        this.drawPicture(this.img, this.size, this.color);
      }
    }
  }
  drawPicture(img, size, color) {
    if (size) this._changeSize(size);
    this._context.drawImage(img, 0, 0, this._canvas.width, this._canvas.height)
    if (color) this._changeColor(color);
    this._display.appendChild(this._canvas)
    this._setSizeValue();
  }
  _changeColor(color) {
    const ImageData = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height)
    const data = ImageData.data
    for (let i = 0; i <= data.length; i += 4) {
      data[i] += color.red
      data[i + 1] += color.green
      data[i + 2] += color.blue
      data[i + 3] += color.opacity
    }
    this._context.putImageData(ImageData, 0, 0)
  }
  _changeSize(size) {
    this._canvas.width = size.width * size.coefficient
    this._canvas.height = size.height * size.coefficient
  }
  _setSizeValue() {
    this._widthInput.value = Math.floor(this.size.coefficient * this.size.width);
    this._heightInput.value = Math.floor(this.size.coefficient * this.size.height);
  }
  getURL() {
    return this._canvas.toDataURL()
  }
  getWidth() {
    return this._canvas.width
  }
  getHeight() {
    return this._canvas.height
  }
}
