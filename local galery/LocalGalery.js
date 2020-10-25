class LocalGalery {
  constructor(idb) {
    this.idb = idb
    this.galery = new Galery(this);
    this.albomsPainer = new AlbomsPainer;
    this.tagsPainer = new TagsPainer;
    this.redactor = new Redactor(this.albomsPainer, this.tagsPainer);
    this.loader = new Loader(this, this.redactor);
    this.lastIndex = '';
    this.createDB()
    this.deleteOneImgButton = document.querySelector('#main-delete');
    this.changeButton = document.getElementById('main-change');
    this.openRedactor = document.getElementById('input1');
    this.saveButtonInRedactor = document.getElementById('save-change');
    this.changeButtonInRedactor = document.getElementById('change-and-save');
    this.clearButton = document.getElementById('clear');
    this.newAlbomBottonMain = document.getElementById('new_albom');
    this.newAlbomBottonRedactor = document.getElementById('new_albom_redactor');
    this.albomsConteiner = document.getElementById('main_alboms');
    this.tagsConteiner = document.getElementById('main_tags');
    this.searhByNameInput = document.getElementById('searh');
    this.addImgToAlbomButton = document.getElementById('add_img_to_albom_walbom');
    this.deleteAlbomButton = document.getElementById('delete-albom');
    this.deleteAlbomAndImageButton = document.getElementById('delete-albandimg');
    this.downloadAlbomButton = document.getElementById('download-alboms');
    this.downloadImgButton = document.getElementById('download-img');
    this.downloadImg = document.getElementById('img-display').getElementsByTagName('img');
    this.mainTags = document.getElementById('r');
    this.redactorTags = document.getElementById('r');
    this._init()
    this.drawGalery()
    this.drawAlboms()
    this.drawTags()
    this.changeObj = {}
  }
  _init() {
    this.changeButton.addEventListener('click', async () => {
      this.openRedactor.checked = true;
      this.loader.openRedactorChecked.checked = false;
      this.loader.clear()
      this.changeObj = await this.getOneObjInDB(this.galery.getImageIndex());
      await this.redactor.setIndexObjectData(this.changeObj);
      this.changeRedactorButtons()
      this.redactor._inputFile.addEventListener('change', this.changeRedactorButtons.bind(this), { once: true })
    })
    this.changeButtonInRedactor.addEventListener('click', async () => {
      // console.log(this.redactor.getIndexChangeObject());
      await this.redactor._setIndexObject(this.changeObj);
      await this.changeAndSaveinDB(this.redactor.getIndexChangeObject())
      setTimeout(window.location.reload.bind(window.location), 100);
    })
    this.clearButton.addEventListener('click', () => {
      this.clearDB();
    })
    this.newAlbomBottonRedactor.addEventListener('click', async () => {
      await this.addNewAlbom();
      this.drawAlboms(this.newAlbom);
    })
    this.newAlbomBottonMain.addEventListener('click', () => {
      this.addNewAlbom();
      this.drawAlboms();
    })
    this.albomsConteiner.addEventListener('click', (event) => {
      this.searchAlbom(event.target.dataset.albom);
    })
    this.tagsConteiner.addEventListener('click', (e) => {
      this.searchTag(e);
    })
    this.searhByNameInput.addEventListener('keydown', (e) => {
      this.searchByName(e);
    })
    this.addImgToAlbomButton.addEventListener('click', () => {
      this.addImgToAlbom();
    })
    this.deleteAlbomButton.addEventListener('click', async () => {
      await this.deleteAlbom();
      await this.goOverObjAndDeleteAlbom();
      setTimeout(window.location.reload.bind(window.location), 250);
    })
    this.deleteAlbomAndImageButton.addEventListener('click', async () => {
      await this.deleteAlbom();
      await this.goOverObjAndDeleteImageInAlbom();
      setTimeout(window.location.reload.bind(window.location), 250);
    })
    this.downloadAlbomButton.addEventListener('click', async () => {
      await this.zipAlbom();
    })
    this.deleteOneImgButton.addEventListener('click', async () => {
      await this.deleteImageInDB(this.galery.getImageIndex());
      setTimeout(window.location.reload.bind(window.location), 250);
    })
  }
  async initDB() {
    this.db = await this.idb.openDb('imagesDb', 1, async db => {
      db.createObjectStore('images', { keyPath: 'index' });
      db.createObjectStore('alboms', { keyPath: 'name' });
    });
  }
  async addDownload() {
    if(this.downloadImg[0]){
      let obj = await this.getOneObjInDB(this.downloadImg[0].dataset.index)
      this.downloadImgButton.href = obj.src
      this.downloadImgButton.download = obj.name
    }
  }
  async createDB() {
    await this.initDB()
    let tx = this.db.transaction('alboms', 'readwrite');
    let albumsStore = tx.objectStore('alboms');
    let albomsInDB = await albumsStore.get('alboms')
    if (!albomsInDB) {
      let alboms = []
      alboms.name = 'alboms'
      alboms.array = []
      await tx.objectStore('alboms').add(alboms)
    }
  }
  async addImageInIndexedDB(objs) {
    let tx = this.db.transaction('images', 'readwrite');
    let imagesStore = tx.objectStore('images');
    let images = await imagesStore.getAll()
    if (images[0]) {
      this._setLastIndex(images[images.length - 1].index);
    } else this.lastIndex = '00001index'
    if (!objs[0].index) {
      this.redactor.indexObj.index = this.lastIndex
    }
    for await (let obj of objs) {
      obj.index = this.lastIndex
      this._setLastIndex(this.lastIndex)      
      await tx.objectStore('images').add(obj).then(console.dir);
    }
  }
  _setLastIndex(index) {
    let result = ''
    let num = parseInt(index) + 1
    let numOfNull = 5 - num.toString().length
    for (let i = 1; i <= numOfNull; i++) {
      result += '0'
    }
    result += num + 'index'
    this.lastIndex = result
  }
  async drawGalery() {
    let objs = await this._getAllDBobject()
    this.galery.printInfo(objs.length)
    this.galery.drawGalery(objs, false, true)
  }
  async getOneObjInDB(index) {
    await this.initDB()
    let tx = this.db.transaction('images', 'readwrite');
    let imagesStore = tx.objectStore('images');
    let image = await imagesStore.get(index)
    return image
  }
  async _getAllDBobject() {
    await this.initDB()
    let tx = this.db.transaction('images', 'readwrite');
    let imagesStore = tx.objectStore('images');
    let images = await imagesStore.getAll()
    return images
  }
  changeRedactorButtons() {
    this.saveButtonInRedactor.classList.toggle("display-none")
    this.changeButtonInRedactor.classList.toggle("display-none")
  }
  async deleteImageInDB(index) {
    await this.initDB()
    let tx = this.db.transaction('images', 'readwrite');
    let imagesStore = tx.objectStore('images');
    await imagesStore.delete(index)
  }
  async changeAndSaveinDB(obj) {
    await this.initDB()
    let tx = this.db.transaction('images', 'readwrite');
    let imagesStore = tx.objectStore('images');
    await imagesStore.delete(obj.index)
    await imagesStore.add(obj)

  }
  async addNewAlbom() {
    this.newAlbom = prompt('Enter the name of the NEW ALBOM');
    if(this.newAlbom) {
      await this.initDB();
      let tx = this.db.transaction('alboms', 'readwrite');
      let albumsStore = tx.objectStore('alboms');
      let alboms = await albumsStore.get('alboms');
      alboms.array.push(this.newAlbom);
      await tx.objectStore('alboms').delete("alboms");
      await tx.objectStore('alboms').add(alboms);
    }
  }
  async clearDB() {
    if(confirm('Realy???')) {
      await this.initDB()
      let tx = this.db.transaction('images', 'readwrite');
      await tx.objectStore('images').clear()
      await this.initDB()
      let tx2 = this.db.transaction('alboms', 'readwrite');
      await tx2.objectStore('alboms').clear()
      location.reload()
    }
  }
  async drawAlboms(checkedAlbom) {
    await this.initDB();
    let tx = this.db.transaction('alboms', 'readwrite');
    let albumsStore = tx.objectStore('alboms');
    let alboms = await albumsStore.get('alboms');
    this.albomsPainer.draw(alboms.array, checkedAlbom)
  }
  async drawTags() {
    let arayObj = await this._getAllDBobject()
    let tags = new Set
    arayObj.forEach((elem) => {
      elem.tags.forEach((tag) => {
        tags.add(tag)
      })
    })
    this.tagsPainer.draw(tags)
  }
  async searchAlbom(albom) {
    let arrayObj = await this._getAllDBobject()
    let albomArray = [], otherArray = [];
    arrayObj.forEach((obj) => {
      if (obj.alboms == albom) {
        albomArray.push(obj)
      } else {
        if (obj.alboms == '') {
          otherArray.push(obj)
        }
      }
    })
    this.galery.drawGalery(albomArray, otherArray)
  }
  async searchTag(event) {
    let arrayObj = await this._getAllDBobject()
    let searchArray = []
    arrayObj.forEach((obj) => {
      obj.tags.forEach((tag) => {
        if (tag == event.target.innerHTML.slice(1)) searchArray.push(obj)
      })
    })
    this.galery.drawGalery(searchArray, true)
  }
  async searchByName(event) {
    if (event.keyCode === 13 && this.searhByNameInput.value.trim()) {

      let arrayObj = await this._getAllDBobject()
      let searchArray = []
      let search = this.searhByNameInput.value.trim();
      arrayObj.forEach((obj) => {
        if (obj.name.indexOf(search) != -1) searchArray.push(obj)
      })
      this.galery.drawGalery(searchArray, true)
    }

  }
  async addImgToAlbom() {
    let arrayIndex = this.galery.getArrayIndexToAddAlbom()
    for await(let index of arrayIndex) {
      let obj = await this.getOneObjInDB(index);
      obj.alboms = this.albomsPainer.getCheckedAlbom()
      await this.changeAndSaveinDB(obj)
      await this.searchAlbom(obj.alboms)
    }
  }
  async deleteAlbom() {
    await this.initDB();
    let tx = this.db.transaction('alboms', 'readwrite');
    let albumsStore = tx.objectStore('alboms');
    let alboms = await albumsStore.get('alboms');
    let newAlboms = []
    for (let albom of alboms.array) {
      if (albom != this.albomsPainer.getCheckedAlbom()) {
        newAlboms.push(albom)
      }
    }
    alboms.array = newAlboms
    await albumsStore.delete(alboms.name)
    await albumsStore.add(alboms)
  }
  async goOverObjAndDeleteAlbom() {
    let arrayObj = await this._getAllDBobject()
    for await (let obj of arrayObj) {
      if (obj.alboms == this.albomsPainer.getCheckedAlbom()) {
        obj.alboms = ''
        await this.changeAndSaveinDB(obj)
      }
    }

  }
  async goOverObjAndDeleteImageInAlbom() {
    let arrayObj = await this._getAllDBobject()
    for await (let obj of arrayObj) {
      if (obj.alboms == this.albomsPainer.getCheckedAlbom()) {
        await this.deleteImageInDB(obj.index)
      }
    }
  }
  async zipAlbom() {
    let arrayObj = await this._getAllDBobject()
    let albomArray = []
    arrayObj.forEach((obj) => {
      if (obj.alboms == this.albomsPainer.getCheckedAlbom()) {
        albomArray.push(obj)
      }
    })
    let zip = new JSZip();
    let folder = zip.folder(this.albomsPainer.getCheckedAlbom());
    albomArray.forEach((obj) => {
      folder.file(obj.name, obj.src.split(',')[1], { base64: true })
    })
    zip.generateAsync({ type: "base64" })
      .then(function (content) {
        location.href = "data:application/zip;base64," + content;
      });
  }
}

let localGalery = new LocalGalery(idb)