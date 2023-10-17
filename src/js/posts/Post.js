import dayjs from 'dayjs';

import './post.css';

export default class Post {
  constructor(geo, text, mediaUrl, constraints) {
    this.text = text;
    this.geo = geo;
    this.mediaUrl = mediaUrl;
    this.constraints = constraints;
    this.post = null;
    this.postsContainer = null;
    this.init();
  }

  init() {
    this.postsContainer = document.querySelector('.posts');
    this.createPostMedia();
  }

  createPostMedia() {
    this.createPost();
    if (this.mediaUrl) {
      const { video } = this.constraints;
      const mediaType = video ? 'video' : 'audio';
      const mediaElement = document.createElement(mediaType);
      mediaElement.src = this.mediaUrl;
      mediaElement.controls = true;
      mediaElement.crossOrigin = 'anonymous';
      this.post.querySelector('.post-content').appendChild(mediaElement);
    }

    this.postsContainer.appendChild(this.post);
  }

  createPost() {
    this.post = document.createElement('div');
    this.post.classList.add('post');
    this.post.innerHTML = `
    <div class="post-date">${dayjs(Date.now()).format('DD.MM.YY HH:mm')}</div>
    <div class="post-content">
      <!-- Здесь будет содержимое поста (текст, аудио или видео) -->
      <p class="text-post">${this.text}</p>
    </div>
    <div class="geodata">
      [${this.geo.latitude}, ${this.geo.longitude}] 
      <span class="geodata-icon"></span>
    </div>
  `;
  }
}
