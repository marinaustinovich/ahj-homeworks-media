import ModalGeo from './geolocation/ModalGeo';
import PostText from './PostText';
import getCurrentPositions from './geolocation/getCurrentPositions';
import ModalMedia from './media/ModalMedia';
import PostMedia from './PostMedia';
import { startTimer, stopTimer } from './media/getTimeMedia';

export default class Timeline {
  constructor(container) {
    this.container = container;
    this.textarea = null;
    this.drawUi();
    this.addEvents();
  }

  drawUi() {
    this.container.innerHTML = `
      <div class="modal-window"></div>
      <section id="posts">
        <h2>Лента постов</h2>
      <!-- Посты будут добавляться здесь -->
      </section>
      <section id="create-post">
        <form name="post" id="post-form">
          <div class="text-container">
            <textarea id="post-content" rows="2" required></textarea>
            <div class="media-button-wrapper">
              <button class="btn audio-button" type="button"></button>
              <button class="btn video-button" type="button"></button>
            </div>
            
            <div class="media-action-wrapper">
              <button class="btn start-media" type="button"></button>
              <div id="timer" class="timer">00:00</div>
              <button class="btn stop-media" type="button"></button>
            </div>
            
          </div>
        </form>
      </section>
    `;
  }

  addEvents() {
    this.textarea = document.getElementById('post-content');
    const audioButton = document.querySelector('.audio-button');
    const videoButton = document.querySelector('.video-button');
    this.startButton = this.container.querySelector('.start-media');
    this.stopButton = this.container.querySelector('.stop-media');

    this.startButton.addEventListener('click', () => this.startRecording());
    this.stopButton.addEventListener('click', () => this.stopRecording());
    this.textarea.addEventListener('input', () => this.changeHeightTextarea());
    this.textarea.addEventListener('keydown', (e) => this.addPost(e));
    audioButton.addEventListener('click', () => this.writeAudio());
    videoButton.addEventListener('click', () => this.writeVideo());
  }

  changeHeightTextarea() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }

  async addPost(e) {
    if (e.key === 'Enter') {
      e.preventDefault(); // Отмена действия по умолчанию (перевод строки в textarea)
      const result = await this.getGeoData();
      this.post = new PostText(result);
    }
  }

  async getGeoData() {
    if (navigator.geolocation) {
      return getCurrentPositions();
    }
    const modalGeo = new ModalGeo(this.container.querySelector('.modal-window'));
    return modalGeo.getCoords();
  }

  writeAudio() {
    this.toggleMediaButtonVisibility();
    this.setupMediaRecorder({ audio: true });
  }

  writeVideo() {
    this.toggleMediaButtonVisibility();
    this.setupMediaRecorder({ audio: true, video: true });
  }

  toggleMediaButtonVisibility() {
    this.container.querySelector('.media-button-wrapper').style.display = 'none';
    this.container.querySelector('.media-action-wrapper').style.display = 'block';
  }

  async setupMediaRecorder(constraints) {
    // Блокируем кнопку "Start" в начале функции
    this.startButton.disabled = true;
    let chunks = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.addEventListener('dataavailable', (event) => chunks.push(event.data));

      this.mediaRecorder.addEventListener('stop', async () => {
        stopTimer();

        const mediaUrl = Timeline.createMediaUrl(chunks, constraints);
        const result = await this.getGeoData();
        this.post = new PostMedia(result, mediaUrl, constraints);
        chunks = [];
        this.container.querySelector('.media-button-wrapper').style.display = 'block';
        this.container.querySelector('.media-action-wrapper').style.display = 'none';
      });
      // Разблокируем кнопку "Start" после успешной инициализации mediaRecorder
      this.startButton.disabled = false;
    } catch (error) {
      console.error('Ошибка при получении доступа к микрофону или камере:', error);
      this.startButton.disabled = false;
      const modalMedia = new ModalMedia(this.container.querySelector('.modal-window'));
      console.log(modalMedia);
    }
  }

  static createMediaUrl(chunks, constraints) {
    const mediaType = constraints.video ? 'video/webm' : 'audio/ogg; codecs=opus';
    const blob = new Blob(chunks, { type: mediaType });
    return URL.createObjectURL(blob);
  }

  startRecording() {
    if (this.mediaRecorder) {
      this.startButton.disabled = true;
      this.stopButton.disabled = false;

      this.mediaRecorder.start();
      startTimer();
    } else {
      console.error('Ошибка: mediaRecorder не определен');
    }
  }

  stopRecording() {
    this.startButton.disabled = false;
    this.stopButton.disabled = true;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}
