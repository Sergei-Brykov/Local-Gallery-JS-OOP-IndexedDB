class TagsPainer {
  constructor() {
    this.mainTags = document.getElementById('main_tags');
    this.redactorTags = document.getElementById('redactor_tags');
    this.tagsCreater = document.getElementById('tags-creater');
    this.tagsInRedactor = document.getElementById('redactor_tags_result');
    this.allTagsInRedactor = document.getElementById('redactor_tags');
  
    this.init()
  }
  init() {
    this.tagsCreater.addEventListener('keyup', (event) => {
      this.addTag(event)
    })
    this.allTagsInRedactor.addEventListener('click', (event) => {
      if(event.target !== this.allTagsInRedactor) {
        this._addTag(event.target)
      }
    })
  }
  _addTag(elem) {
    let tag = document.createElement('span')
    tag.innerHTML = elem.innerHTML
    elem.style.display = 'none'
    this.tagsInRedactor.appendChild(tag)
  }
  draw(set) {
    set.forEach((tag) => {
      let spanMain = document.createElement('span');
      let spanRedactor = document.createElement('span');
      spanMain.innerHTML = '#' + tag
      spanRedactor.innerHTML = '#' + tag
      spanRedactor.dataset.tag = tag
      this.mainTags.appendChild(spanMain)
      this.redactorTags.appendChild(spanRedactor)
    })
  }
  addTag(event) {
    if (this.tagsCreater.value.trim() && event.keyCode === 13) {
      let tag = document.createElement('span');
      tag.innerHTML = '#' + this.tagsCreater.value.trim()
      this.tagsInRedactor.appendChild(tag);
      this.tagsCreater.value = ''
    }
  }

  setTags(set) {
    set.forEach((tag) => {
      let span = document.createElement('span')
      span.innerHTML = '#' + tag
      this.tagsInRedactor.appendChild(span)
    })
  }
}