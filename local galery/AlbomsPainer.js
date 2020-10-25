class AlbomsPainer {
  constructor() {
    this.mainAlboms = document.getElementById('main_alboms');
    this.redactorAlboms = document.getElementById('redactor_alboms');
    this.albomDivs = this.redactorAlboms.getElementsByTagName('div')
    this.albomResult = document.getElementById('discr-albom-result')
    this.init()
  }
  init() {
    this.redactorAlboms.addEventListener('click', (e) => {
      if(e.target.dataset.albom) {
        this._checkedAlbom(e.target)
      }
    })    
  }
  draw(array, checkedAlbom) {
    this.mainAlboms.innerHTML = ''
    this.redactorAlboms.innerHTML = ''
    array.forEach((albom) => {
      let divMain = document.createElement('div');
      let divRedactor = document.createElement('div');
      divMain.innerHTML = albom + `<span>	&rarr;</span>`
      divMain.dataset.albom = albom
      divRedactor.dataset.albom = albom
      divRedactor.innerHTML = '&larr; ' + albom
      this.mainAlboms.appendChild(divMain)
      this.redactorAlboms.appendChild(divRedactor)
      if(albom == checkedAlbom) {
        divRedactor.click()
      }
    })
    this.mainAlboms.addEventListener('click', (e) => {
      if(e.target.dataset) {
        let divsArray = this.mainAlboms.getElementsByTagName('div')
        for(let i = 0; i < divsArray.length; i++) {
          divsArray[i].classList.remove('checked-albom')
        }
        e.target.classList.add('checked-albom');
      }
    })
  }
  _checkedAlbom(elem) {
    for(let i = 0; i < this.albomDivs.length; i++) {
      this.albomDivs[i].style.display = 'block'
    }
    this.albomResult.innerHTML = elem.innerHTML.slice(2)
    elem.style.display = 'none'
  }
  setCheckedAlbom(albom) {
    for(let i = 0; i < this.albomDivs.length; i++) {
      if(this.albomDivs[i].dataset.albom = albom) this.albomDivs[i].click()
    }
  }
  getCheckedAlbom() {
    let checkedAlbom = this.mainAlboms.getElementsByClassName('checked-albom')
    return checkedAlbom[0].dataset.albom
  }
}