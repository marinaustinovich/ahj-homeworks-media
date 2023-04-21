const dayjs = require('dayjs');

export default class PostText {
  constructor(geo) {
    this.textarea = document.getElementById('post-content');
    this.geo = geo;
    this.post = null;
    this.createPost();
  }

  createPost() {
    this.post = document.createElement('div');
    this.post.classList.add('post');
    this.post.innerHTML = `
      <div class="post-date">${dayjs(Date.now()).format('DD.MM.YY HH:mm')}</div>
      <div class="post-content">
          <p class="text-post">${this.textarea.value}</p>
      </div>
      <div class="geodata">
          [${this.geo.latitude}, ${this.geo.longitude}] 
          <span class="geodata-icon"></span>
      </div>
    `;
    document.getElementById('posts').appendChild(this.post);
    this.textarea.value = '';
  }
}
