let c = console.log
class ColorControls {
  constructor(selector, painter) {
    this.painter = painter

    this._className = selector;
    this._conteiner = document.querySelector(`.${this._className}`)
    this._spanDisplay = this._conteiner.querySelector(`#${this._className}-span`)
    this._inputRange = this._conteiner.querySelector(`#${this._className}-range`)

    this._run()
  }
  _run() {
    this._inputRange.addEventListener('input', () => {
      this._setValue()
      this._changeColorControls()
    })
  }
  _setValue() {
    this._spanDisplay.innerHTML = Math.floor(+this._inputRange.value)
  }
  _changeColorControls() {
    this.painter.drawPicture(this.painter.img, null, this._createObjectColor())
  }
  _createObjectColor() {
    this.painter.color[this._className.toString()] = +this._inputRange.value
    return this.painter.color
  }
}

class OpacityControls extends ColorControls {
  _setValue() {
    this._spanDisplay.innerHTML = Math.floor((+this._inputRange.value) / 2.55) / 100
  }
  _createObjectColor() {
    this.painter.color[this._className.toString()] = -(255 - this._inputRange.value)
    return this.painter.color
  }
}

class SizeControls {
  constructor(painter) {
    this.painter = painter

    this._widthInput = document.querySelector(`#size-width`)
    this._heightInput = document.querySelector(`#size-height`)

    this._checkbox = document.querySelector('#size-check')
    this._inputRange = document.querySelector(`#size-range`)

    this._run()
    this.painter._setSizeValue()
  }
  _run() {
    this._inputRange.addEventListener('input', () => {
      this._changeMainSize()
      this.painter.drawPicture(this.painter.img, this.painter.size, this.painter.color)
      this.painter._setSizeValue()
    })
    this._checkbox.addEventListener('change', () => {
      this._changeInputsDisabled()
    })
    this._widthInput.addEventListener('change', () => {
      this._changeWidthSize()
      this.painter.drawPicture(this.painter.img, this.painter.size, this.painter.color)
    })
    this._heightInput.addEventListener('change', () => {
      this._changeHeightSize()
      this.painter.drawPicture(this.painter.img, this.painter.size, this.painter.color)
    })
  }
  _changeMainSize() {
    this.painter.size.coefficient = this._inputRange.value / 100
  }
  _changeWidthSize() {
    this.painter.size.width = this._widthInput.value / this.painter.size.coefficient
  }
  _changeHeightSize() {
    this.painter.size.height = this._heightInput.value / this.painter.size.coefficient
  }
  _changeInputsDisabled() {
    if (this._checkbox.checked) {
      this._widthInput.disabled = true
      this._heightInput.disabled = true
      this._inputRange.disabled = false
    }
    else {
      this._widthInput.disabled = false
      this._heightInput.disabled = false
      this._inputRange.disabled = true
    }
  }
}




