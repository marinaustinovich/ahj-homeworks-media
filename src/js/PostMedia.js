const dayjs = require('dayjs');

export default class PostMedia {
  constructor(geo, mediaUrl, constraints) {
    this.textarea = document.getElementById('post-content');
    this.geo = geo;
    this.mediaUrl = mediaUrl;
    this.constraints = constraints;
    this.post = null;
    this.createPostMedia();
  }

  createPostMedia() {
    this.post = document.createElement('div');
    this.post.classList.add('post');
    this.post.innerHTML = `
      <div class="post-date">${dayjs(Date.now()).format('DD.MM.YY HH:mm')}</div>
      <div class="post-content">
          <!-- Здесь будет содержимое поста (текст, аудио или видео) -->
          <p class="text-post">${this.textarea.value}</p>
          ${
  this.constraints.video
    ? `<video src="${this.mediaUrl}" controls></video>`
    : `<audio src="${this.mediaUrl}" controls></audio>`
}
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
