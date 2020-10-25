class Galery {
  constructor(localGalery) {
    this.localGalery = localGalery
    this.divConteiners = document.getElementsByClassName('img-conteiner')
    this.discription = {
      name: document.getElementById('dsc-name'),
      alboms: document.getElementById('dsc-albom'),
      descrip: document.getElementById('dsc-discrip'),
      type: document.getElementById('dsc-type'),
      size: document.getElementById('dsc-size'),
      width: document.getElementById('dsc-width'),
      height: document.getElementById('dsc-height'),
      tags: document.getElementById('dsc-tags'),
      modified: document.getElementById('dsc-modified'),
      divImg: document.getElementById('img-display')
    }
    this.indexImg = ''
    this.divAllImg = document.getElementById('main-allimg');
    this.divAlbomImg = document.getElementById('main-albom');
    this.divWithoutAlbomImg = document.getElementById('main-without-album');
    this.divSearchResults = document.getElementById('main-search-results');
    this.addImgToAlbom = document.getElementById('add_img_to_albom');
    this.addImg = document.getElementById('add_img_to_albom_walbom');
    this.addImgToAlbom.addEventListener('click', async (e) => {
      this.addImg.classList.remove('display-none');
      e.target.classList.add('disable');
      this._addListenerToAddAlbom();
    })
    this.printInfo()
  }
  _addListenerToAddAlbom() {
    this.divWithoutAlbomImg.classList.add('filter');
    let imgs = this.divWithoutAlbomImg.querySelectorAll('img');
    imgs.forEach((img) => {
      img.insertAdjacentHTML('afterend', '<input type="checkbox"/>');
    })
    this.divWithoutAlbomImg.addEventListener('click', (e) => {
      if(e.target.outerHTML == `<input type="checkbox">`) {
        e.target.previousSibling.classList.toggle('filter');
      }
    })
  }
  getArrayIndexToAddAlbom(){
    let arrayIndex = [];
    let arrayDomElements = this.divWithoutAlbomImg.getElementsByClassName('filter');
    for(let i = 0; i < arrayDomElements.length; i++){
      arrayIndex.push(arrayDomElements[i].dataset.index);
    }
    return arrayIndex;
  }
  drawGalery(array, flag, startTrue) {
    if (!flag) {
      this.drawAllImages(array, startTrue);
    } else if (flag === true) {
      this.drawSearchResults(array);
    } else {
      this.drawAlbom(array);
      this.drawOther(flag);
    }
  }
  drawAllImages(array, startTrue) {
    this._clearGalery();
    this._draw(this.divAllImg, array);
    this._drawDiscription(array[array.length - 1], startTrue);
    this._addListenerToChangeImgDiscr(this.divAllImg);
  }
  drawSearchResults(array) {
    this.divSearchResults.innerHTML = '';
    this._clearGalery();
    this._draw(this.divSearchResults, array);
    this._drawDiscription(array[array.length - 1]);
    this._addListenerToChangeImgDiscr(this.divSearchResults);
  }
  drawAlbom(array) {
    this.divAlbomImg.innerHTML = ''
    this._clearGalery();
    this._draw(this.divAlbomImg, array);
    this._drawDiscription(array[array.length - 1]);
    this._addListenerToChangeImgDiscr(this.divAlbomImg);
  }
  drawOther(array) {
    this.divWithoutAlbomImg.innerHTML = '';
    this._drawWitoutAlboms(this.divWithoutAlbomImg, array);
  }

  _draw(elem, array) {
    elem.closest('.img-conteiner').classList.remove('display-none')
    this.arrayDB = array
    array.map((obj) => {
      let div = document.createElement('div');
      let img = document.createElement('img');
      img.src = obj.src;
      img.alt = obj.name;
      img.title = obj.name;
      img.dataset.index = obj.index
      div.appendChild(img);
      elem.appendChild(div);
    })
  }
  _drawWitoutAlboms(elem, array) {
    elem.closest('.img-conteiner').classList.remove('display-none')
    array.map((obj) => {
      let div = document.createElement('div');
      let label = document.createElement('label');
      let img = document.createElement('img');
      img.src = obj.src;
      img.alt = obj.name;
      img.title = obj.name;
      img.dataset.index = obj.index;
      label.appendChild(img);
      div.appendChild(label);
      elem.appendChild(div);
    })
  }
  _drawDiscription(imgObj, startTrue) {

    if(imgObj) {
      this.discription.divImg.innerHTML = '';
      this.discription.name.innerHTML = imgObj.name;
      this.discription.alboms.innerHTML = imgObj.alboms;
      this.discription.descrip.innerHTML = imgObj.description;
      this.discription.type.innerHTML = imgObj.type;
      this.discription.size.innerHTML = imgObj.size;
      this.discription.width.innerHTML = imgObj.width;
      this.discription.height.innerHTML = imgObj.height;
      let tags = []
      imgObj.tags.forEach((tag) => {
        tag = '#' + tag
        tags.push(tag)
      })
      this.discription.tags.innerHTML = tags.join(', ');
      this.discription.modified.innerHTML = imgObj.lastModifiedDate;
      let img = new Image
      img.src = imgObj.src;
      img.dataset.index = imgObj.index;
      this.discription.divImg.appendChild(img);
      this.indexImg = imgObj.index;
    } else if (startTrue) this.discription.divImg.innerHTML = 'CLICK ADD A PHOTO PLEASE <img id="arrow" src="./local galery/arrow.png" alt="Add a photo pliz">'
    else this.discription.divImg.innerHTML = "WE DIDN'T FIND FIND ANYTHING"
    this.localGalery.addDownload()
  }
  _addListenerToChangeImgDiscr(elem) {
    elem.addEventListener('click', (e) => {
      let clickElem = e.target
      let searchObj = this.arrayDB.reduce((result, obj) => {
        if (obj.index == clickElem.dataset.index) {
          result = obj
        }
        return result
      })
      this._drawDiscription(searchObj)
    })
  }
  getImageIndex() {
    return this.indexImg
  }
  _clearGalery() {
    for (let i = 0; i < this.divConteiners.length; i++) {
      this.divConteiners[i].classList.add('display-none')
    }
  }
  async printInfo(length) {
    let size = Math.round((await navigator.storage.estimate()).quota / 1000000);
    let useSize = Math.round((await navigator.storage.estimate()).usage / 1000000);
    document.querySelector('#size-lenght').innerHTML = length ;
    document.querySelector('#size-used').innerHTML = useSize + 'MB';
    document.querySelector('#size-total').innerHTML = size + 'MB';
    let percent = Math.round(useSize / size);
    document.querySelector('.progres-item').style.width = (percent * 240) + 'px';
    document.querySelector('#percent').innerHTML = percent + '%';
  }
}