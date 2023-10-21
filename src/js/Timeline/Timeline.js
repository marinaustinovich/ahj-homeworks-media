import ModalGeo from '../ModalGeo/ModalGeo';
import ModalMedia from '../ModalMedia/ModalMedia';
import Post from '../posts/Post';

import './timeline.css';

export default class Timeline {
  constructor(container) {
    this.container = container;
    this.textarea = null;
    this.modalMedia = null;
    this.timerInterval = null;
  }

  init() {
    this.drawUi();
    this.addEvents();
  }

  drawUi() {
    this.container.innerHTML = `
      <div class="modal-window"></div>
      <section>
        <h2>Лента постов</h2>
        <div class="posts"></div>
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

    this.textarea = this.container.querySelector('#post-content');
    this.startButton = this.container.querySelector('.start-media');
    this.stopButton = this.container.querySelector('.stop-media');
    this.audioButton = this.container.querySelector('.audio-button');
    this.videoButton = this.container.querySelector('.video-button');
  }

  addEvents() {
    this.textarea.addEventListener('input', () => this.changeHeightTextarea());
    this.textarea.addEventListener('keydown', (e) => this.addPost(e));
    this.audioButton.addEventListener('click', () => this.writeMedia({ audio: true, video: false }));
    this.videoButton.addEventListener('click', () => this.writeMedia({ audio: true, video: true }));
    this.startButton.addEventListener('click', () => this.startRecording());
    this.stopButton.addEventListener('click', () => this.stopRecording());
  }

  changeHeightTextarea() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }

  async addPost(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const geoData = await this.getGeoData();

      if (geoData) {
        this.post = new Post(geoData, this.textarea.value);
        this.textarea.value = '';
      }
    }
  }

  async getGeoData() {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (error) => reject(error),
          );
        });
        const coordinates = {
          latitude: position.latitude,
          longitude: position.longitude,
        };
        return coordinates;
      } catch {
        return this.showModalGeo();
      }
    } else {
      return this.showModalGeo();
    }
  }

  showModalGeo() {
    const modalGeo = new ModalGeo(
      this.container.querySelector('.modal-window'),
    );

    return modalGeo.waitForOk();
  }

  writeMedia(constraints) {
    this.toggleMediaButtonVisibility();
    this.setupMediaRecorder(constraints);
  }

  toggleMediaButtonVisibility() {
    this.container.querySelector('.media-button-wrapper').style.display = 'none';
    this.container.querySelector('.media-action-wrapper').style.display = 'block';
  }

  async setupMediaRecorder(constraints) {
    this.startButton.disabled = true;
    this.chunks = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.recorder = new MediaRecorder(stream);

      this.recorder.addEventListener('start', () => console.log('start media'));
      this.recorder.addEventListener('dataavailable', (event) => this.chunks.push(event.data));
      this.recorder.addEventListener('stop', () => this.handleRecordingStop(constraints));

      this.startButton.disabled = false;
    } catch {
      this.handleError();
    }
  }

  handleRecordingStop(constraints) {
    this.stopTimer();

    const mediaUrl = Timeline.createMediaUrl(this.chunks, constraints);
    this.getGeoData()
      .then((result) => {
        this.post = new Post(
          result,
          this.textarea.value,
          mediaUrl,
          constraints,
        );
        this.textarea.value = '';
        this.container.querySelector('.media-button-wrapper').style.display = 'block';
        this.container.querySelector('.media-action-wrapper').style.display = 'none';
      })
      .catch((error) => this.handleError(error));

    this.chunks = [];
  }

  handleError() {
    this.startButton.disabled = false;
    this.modalMedia = new ModalMedia(
      this.container.querySelector('.modal-window'),
    );
  }

  static createMediaUrl(chunks, constraints) {
    const mediaType = constraints.video
      ? 'video/webm'
      : 'audio/ogg; codecs=opus';
    const blob = new Blob(chunks, { type: mediaType });
    return URL.createObjectURL(blob);
  }

  startRecording() {
    if (!this.recorder) {
      return;
    }

    this.startButton.disabled = true;
    this.stopButton.disabled = false;

    this.recorder.start();
    this.startTimer();
  }

  stopRecording() {
    this.startButton.disabled = false;
    this.stopButton.disabled = true;

    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.stop();
    }
  }

  startTimer() {
    let seconds = 0;
    let minutes = 0;

    const timerElement = document.getElementById('timer');
    timerElement.textContent = '00:00';

    this.timerInterval = setInterval(() => {
      seconds += 1;

      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      }

      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

      timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.container.querySelector('#timer').textContent = '00:00';
  }
}
