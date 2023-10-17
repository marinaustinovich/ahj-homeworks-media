[![Build status](https://ci.appveyor.com/api/projects/status/vjtoctclia1lim2g/branch/main?svg=true)](https://ci.appveyor.com/project/marinaustinovich/ahj-homeworks-media/branch/main)

deployment: https://marinaustinovich.github.io/ahj-homeworks-media/
### Общая легенда

Вам предстоит создать проект Timeline — некую ленту постов человека, где он может прикреплять текстовые посты, а также записывать аудио и видео в привязке к своей геопозиции.

Затем посты с текстом можно просматривать, посты с аудио — прослушивать, посты с видео — проигрывать.

Примерно это должно выглядеть так:

![](./src/img/timeline.png)

Записи отображаются сверху вниз, наверху — самая последняя.

Первая запись — пример текстовой записи.

Вторая запись — пример аудиозаписи, при нажатии на Play происходит проигрывание.

Третья запись — пример видеозаписи, при нажатии на Play происходит проигрывание.

Для каждой записи указаны координаты, где она сделана.

---

### Задача 1. Текстовые записи с координатами

При создании текстовой записи (пользователь вводит текст в нижнее поле ввода и нажимает Enter) запросите координаты пользователя (через Geolocation API). Если координаты доступны, то добавьте сообщение в Timeline. Если же координаты не доступны - выведите пользователю соответствующее предупреждение с помощью модального окна и предложите указать координаты вручную (в реальном приложении, вы, конечно, будете использовать провайдера карт, но мы пока поступим именно так):

![](./src/img/test.png)

Напишите автотест для функции, которая будет обрабатывать пользовательский ввод координат. Функция должна корректно обрабатывать следующие ситуации и выводить объект, содержащий широту и долготу:
1. 51.50851, −0.12572 — есть пробел.
1. 51.50851,−0.12572 — нет пробела.
1. [51.50851, −0.12572] — есть квадратные скобки.

При несоответствии формата функция должна генерировать исключение, которое должно влиять на валидацию поля.

---

### Задача 2. Аудио-записи с координатами*

При нажатии на иконку микрофона в поле ввода текста начните записывать аудио. Если недоступно API либо пользователь не выдал прав, выводите соответствующее всплывающее окно о необходимости выдачи прав или об использовании другого браузера.

Вид при записи аудио:

![](./src/img/audio.png)

Т. е. иконки микрофона и камеры пропадают, появляются иконки Ok и «Отмена», между ними — таймер, показывающий, сколько секунд аудио записано.

По нажатию кнопки Оk запись завершается, далее определяются геокоординаты. Если они недоступны, выводится всплывающее уведомление о просьбе ввести вручную.

После этого запись добавляется в виде `<audio>` в Timeline. При нажатии Play запись должна воспроизводиться.

При записи звук дублироваться не должен.

---

### Задача 3. Видео-записи с координатами*

При нажатии на иконку камеры в поле ввода текста начните записывать видео. Если недоступно API либо пользователь не выдал прав, выводите соответствующее всплывающее окно о необходимости выдачи прав или об использовании другого браузера.

Вид при записи видео:

![](./src/img/video.png)


Т. е. иконки микрофона и камеры пропадают, появляются иконки Ok и «Отмена», между ними — таймер, показывающий, сколько секунд видео записано.

При этом дополнительно появляется всплывающий блок, в котором дублируется **только изображение**, т. е. звук не дублируется — см. атрибут `muted`.

По нажатию кнопки Оk запись завершается, далее определяются геокоординаты, если они недоступны, выводится всплывающее уведомление о просьбе ввести вручную.

После этого запись добавляется в виде `<video>` в Timeline. При нажатии Play запись должна воспроизводиться.
