class Redactor {
  constructor(albomsPainer, tagsPainer) {
    this.painter = new Painter
    this.albomsPainer = albomsPainer
    this.tagsPainer = tagsPainer
    this.sizeControls = new SizeControls(this.painter)
    this.colorControls = {
      redControls: new ColorControls('red', this.painter),
      greenControls: new ColorControls('green', this.painter),
      blueControls: new ColorControls('blue', this.painter),
      opacityControls: new OpacityControls('opacity', this.painter)
    }
    this.nameInput = document.querySelector('#file-name')
    this.descriptionInput = document.querySelector('#disciption')
    this.formatsDiv = document.querySelector('#formats')
    this.formatsInputs = this.formatsDiv.querySelectorAll('input')
    this._inputFile = document.getElementById('input-file');
    this.indexObj = {}

    this.tagsInRedactor = document.getElementById('redactor_tags_result')
    this.spanArray = this.tagsInRedactor.getElementsByTagName('span')
    this.albomResult = document.getElementById('discr-albom-result')

    this._inputFile.addEventListener('change',async () => {
      this._clearDisplays()
      this.painter.initPainter(this._inputFile.files[0])
    })
  }

  _clearDisplays() {
    this.nameInput.value = ""
    this.descriptionInput.value = ''
    for (let i = 0; i < this.formatsInputs.length; i++) {
      this.formatsInputs[i].checked = false
    }
  }
  _setIndexObject(defoltObject) {
    this.indexObj = {}
    this.indexObj.index = defoltObject.index
    defoltObject.name = this.nameInput.value
    if (defoltObject.name) {
      if (!this.indexObj.name) {
        this.indexObj.name = defoltObject.name
      }
      this.indexObj.type = defoltObject.type;
      this.indexObj.lastModifiedDate = defoltObject.lastModifiedDate;
    } else {
      this.indexObj.name = this._inputFile.files[0].name
      this.indexObj.type = this._inputFile.files[0].type
      this.indexObj.lastModifiedDate = new Date
      
    }
    this.indexObj.format = this._getFormat()
    this.indexObj.description = this._getDescription()
    this.indexObj.alboms = this._getAlbom()
    this.indexObj.tags = this._getTags()
    this.indexObj.width = this.painter.getWidth()
    this.indexObj.height = this.painter.getHeight()
    this.indexObj.src = this.painter.getURL()
    this.indexObj.size = parseInt(this.indexObj.src.replace(/=/g, "").length * 0.75 - 16)
  }
  getIndexDbObject() {
    this._setIndexObject({})
    return this.indexObj
  }
  getIndexChangeObject() {
    return this.indexObj
  }
  getIndexDbObjectChange() {
    this._setIndexObject(this.indexObj)
    return this.indexObj
  }
  _getFormat() {
    let format = ''
    for (let i = 0; i < this.formatsInputs.length; i++) {
      if (this.formatsInputs[i].checked == true) {
        format = this.formatsInputs[i].id
      }
    }    
    return format
  }
  _getDescription() {
    return this.descriptionInput.value
  }
  _getAlbom() {
    return this.albomResult.innerHTML
  }
  _getTags() {
    let tags = [];
    for(let i = 0; i < this.spanArray.length; i++) {
      tags.push(this.spanArray[i].innerHTML.slice(1))
      console.log(this.spanArray[i].innerHTML.slice(1))
    } 
    return new Set(tags)
  }
  async setIndexObjectData(obj) {
    this.painter.img.src = obj.src
    this.painter.img.onload = () => {
      this.painter.size.width = this.painter.img.width
      this.painter.size.height = this.painter.img.height
      this.painter.drawPicture(this.painter.img, this.painter.size, this.painter.color)
    }
    this.nameInput.value = obj.name
    this.descriptionInput.value = obj.description
    this.albomsPainer.setCheckedAlbom(obj.alboms)
    this.tagsPainer.setTags(obj.tags)
    for (let i = 0; i < this.formatsInputs.length; i++) {
      if (this.formatsInputs[i].id == obj.format) {
        this.formatsInputs[i].checked = true
      }
    }
    
  }
  async fileToObj(file) {
    return obj
  }
}





