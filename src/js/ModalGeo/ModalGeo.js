import isValidGeo from '../utils/isValidGeo';
import './modal-geo.css';

export default class ModalGeo {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.init();
  }

  init() {
    this.drawUi();
    this.events();
  }

  drawUi() {
    this.container.innerHTML = `
      <div id="modal" class="modal">
        <div class="modal-content">
          <h4>Что-то пошло не так</h4>
          <p>К сожалению, нам не удалось определить Ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную</p>
          <label for="geo">Широта и долгота через запятую</label>
          <input name="geo" type="text" id="geo-input" class="geo-input" placeholder="51.50851, −0.12572" />
          <div class="btn-modal-wrapper">
            <button class="close-btn">Отмена</button>
            <button class="add-geo">Ok</button>
          </div>
        </div>
        <div class="error-container"></div>
      </div>
    `;
    this.modal = this.container.querySelector('#modal');
    this.addButton = this.container.querySelector('.add-geo');
    this.closeButton = this.container.querySelector('.close-btn');
    this.input = this.container.querySelector('#geo-input');
    this.error = this.container.querySelector('.error-container');
  }

  events() {
    this.input.addEventListener('click', () => {
      this.input.value = '';
      this.hideError();
    });
  }

  closeModal() {
    this.modal.remove();
  }

  showError(message) {
    this.error.textContent = message;
    this.error.style.display = 'flex';
  }

  hideError() {
    this.error.style.display = 'none';
  }

  getCoords() {
    return this.coords;
  }

  waitForOk() {
    return new Promise((resolve) => {
      this.addButton.addEventListener('click', () => {
        const geo = this.input.value;
        if (geo) {
          const result = isValidGeo(geo);
          if (typeof result === 'string') {
            this.showError(result);
          } else {
            this.coords = result;
            this.modal.style.display = 'none';
            resolve(this.getCoords());
          }
        } else {
          this.showError('Пожалуйста, введите ваши координаты');
        }
      });

      this.closeButton.addEventListener('click', () => {
        this.closeModal();
        resolve(null);
      });
    });
  }
}
