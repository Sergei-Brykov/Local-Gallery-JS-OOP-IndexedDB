class Loader {
  constructor(localGalery, redactor) {
    this.localGalery = localGalery
    this.redactor = redactor
    this.input = document.querySelector('#input-file');
    this.divs = document.querySelector('.imgs-conteiner');
    this.galery = document.querySelector('#addet-img');
    this.saveChangeButton = document.getElementById('save-change')
    this.objStore = []
    this.initButon = document.querySelector('#add-img');
    this.initButon.addEventListener('click', () => {
      this.initLoader()
    })
    this.openRedactorChecked = document.querySelector('#redactor-check');
    this.saveChangeButton.addEventListener('click', () => {
      this.objStore[this.openInRedactorImgIndex] = this.redactor.getIndexDbObject()
      this.reprintImgs()
    });
    this.saveAllButton = document.querySelector('#save-all-img');
    this.saveAllButton.addEventListener('click', async () => {
      await this.localGalery.addImageInIndexedDB(this.objStore);
      setTimeout(window.location.reload.bind(window.location), 250);
    })
    this.input.addEventListener('change', () => {
      this.setArrayImgObj(this.input.files);
      this.printImgs(this.input.files);
      this.divs.addEventListener('click', (e) => {
        let index = e.target.dataset.i;
        this.openInRedactorImgIndex = e.target.dataset.i;
        this.openRedactorChecked.checked = false;
        let changeObj = this.objStore[index];
        this.redactor.setIndexObjectData(changeObj);
      })
    })
  }
  async setArrayImgObj(files) {
    for (let i = 0; i < files.length; i++) {
      this.objStore[i] = {};
      this.objStore[i].name = files[i].name;
      this.objStore[i].type = files[i].type;
      this.objStore[i].lastModifiedDate = files[i].lastModifiedDate;
      this.objStore[i].format = '';
      this.objStore[i].description = '';
      this.objStore[i].alboms = '';
      this.objStore[i].tags = new Set;
      this.objStore[i].size = files[i].size;
      let reader = new FileReader;
      let img = new Image;
      reader.readAsDataURL(files[i]);
      reader.onload = () => {
        img.src = reader.result;
        this.objStore[i].src = reader.result
        img.onload = () => {
          this.objStore[i].width = img.naturalWidth;
          this.objStore[i].height = img.naturalHeight;
        }
      }
    }
  }
  printImgs(files) {
    this.galery.innerHTML = ''
    for (let i = 0; i < files.length; i++) {
      let div = document.createElement('div');
      let img = new Image;
      img.dataset.i = i;
      let reader = new FileReader;
      reader.readAsDataURL(files[i])
      reader.onload = () => {
        img.src = reader.result;
        div.appendChild(img)
        this.galery.appendChild(div)
      }
    }
    this.openInRedactorImgIndex = 0;
  }

  reprintImgs() {
    this.galery.innerHTML = '';
    for (let i = 0; i < this.objStore.length; i++) {
      let div = document.createElement('div');
      let img = new Image;
      img.dataset.i = i;   
      img.src = this.objStore[i].src;
      div.appendChild(img);
      this.galery.appendChild(div);
    }
  }
  clear() {
    this.divs.style.display = 'none';
    this.input.style.display = 'none';
    this.saveAllButton.style.display = 'none';
  }
  initLoader() {
    this.divs.style.display = 'block';
    this.input.style.display = 'block';
    this.saveAllButton.style.display = 'block';
    this.openRedactorChecked.checked = true;
  }
}