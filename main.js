// https://www.youtube.com/watch?v=QGzgE7jWDxk

const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidtyOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

let cityInput = "London";

// обработчик события "клик" по городу на панели справа
cities.forEach((city) => {
  city.addEventListener('click', (e) => {
    // изменить город на выбранный
    cityInput = e.target.innerHTML;
    // функции, которые извлекают и отображают все данные из Weather API
    fetchWeatherData(cityInput);
    // исчезновение приложения (простая анимация)
    app.style.transition = '700ms';
    app.style.opacity = '0'; // here be 0
  });
});

// добавить кнопку события для формы
form.addEventListener('submit', (e) => {
  // если поле ввода (панель поиска) пусто, выдать предупреждение
  if(search.value.length === 0) {
    alert('Пожалуйства, введите название города');
  } 
  // изменить гоород по умолчанию на тот, который указан в поле ввода 
  else {
    cityInput = search.value;
    // функции, которые извлекают и отображают все данные из Weather API
    fetchWeatherData(cityInput);
    // отчистка поля ввода
    search.value = "";
    // исчезновение приложения (простая анимация)
    app.style.opacity = '0'; // here be 0
  }
  // предотвращает поведение формы по умолчанию 
  e.preventDefault();
});

// функция, которая возвращает день недели как дату
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return weekday[new Date(year, month - 1, day).getDay()];
};

// функции, которые извлекают и отображают все данные из Weather API
function fetchWeatherData() {
  // извлечь данные и динамически добавить название города с литералами шаблона
  // ИСПОЛЬЗУЙТЕ СВОЙ СОБСТВЕННЫЙ КЛЮЧ
  fetch(`https://api.weatherapi.com/v1/current.json?key=d2184d7a725640298ef210507222208&q=${cityInput}`)
  // взять данные (в формате JSON) и преобразовать в обычный объект js
  .then((res) => res.json())
  .then(data => {
    // примтупим к добавлениб температуры и погодных условий на страницу
    temp.innerHTML = data.current.temp_c + "&#176;"
    conditionOutput.innerHTML = data.current.condition.text;

    // получить дату по времени из города и извлечь день, месяц, год и время в отдельные переменные
    const date = data.location.localtime;
    const y = parseInt(date.substr(0, 4));
    const m = parseInt(date.substr(5, 2));
    const d = parseInt(date.substr(8, 2));
    const time = date.substr(11);

    // преобразовать данные в что-то более привлекательное и добавить на страницу
    dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}.${m}.${y}`;
    timeOutput.innerHTML = time;
    // добавить название города на страницу
    nameOutput.innerHTML = data.location.name;
    // получить соответсвующий значок для погоды и извлечь его часть
    const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
    // преобразовать занчок url в ваш собственный, 
    // путь к локальной папке, и добавьте его на страницу 
    icon.src = "./icons/" + iconId;

    // добавить детали о погоде на страницу 
    cloudOutput.innerHTML = data.current.cloud + " %";
    humidtyOutput.innerHTML = data.current.humidity + " %";
    windOutput.innerHTML = (data.current.wind_kph * 1000 / 3600).toFixed(1) + " m/s";
    
    // установить время суток по умолчанию
    let timeOfDay = "day";

    const code = data.current.condition.code;
    // изменить ночь, если в городе ночное время
    if(!data.current.is_day) {
      timeOfDay = "night";
    }
  
    if(code == 1000) {
      // уставноить фоновое изображение на прозрачное, если погода ясная
      app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
      // изменить фоновый цвет кнопки в зависимости от того, день это или ночь 
      btn.style.background = "#e5ba92";
      if(timeOfDay === "night") {
        btn.style.background = "#181e27";
      }
    }
    // пасмурная погода
    else if(
      code == 1003 ||
      code === 1006 ||
      code === 1009 ||
      code === 1030 ||
      code === 1069 ||
      code === 1087 ||
      code === 1135 ||
      code === 1273 ||
      code === 1276 ||
      code === 1279 ||
      code === 1282 
    ) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
      btn.style.background = "#fa6d1b";
      if(timeOfDay === "night") {
        btn.style.background = "#181e27";
      }
    }
    // дождь
    else if(
      code === 1063 ||
      code === 1069 ||
      code === 1072 ||
      code === 1150 ||
      code === 1153 ||
      code === 1180 ||
      code === 1183 ||
      code === 1186 ||
      code === 1189 ||
      code === 1192 ||
      code === 1195 ||
      code === 1204 ||
      code === 1207 ||
      code === 1240 ||
      code === 1243 ||
      code === 1246 ||
      code === 1249 ||
      code === 1252
    ) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
      btn.style.background = "#647d75";
      if(timeOfDay == "night") {
        btn.style.background = "#325c80";
      }
    }
    // снег
    else {
      app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
      btn.style.background = "#4d72aa";
      if(timeOfDay == "night") {
        btn.style.background = "#1b1b1b";
      }
    }
    // скрыть со страницы, как будет все сделано 
    app.style.opacity = "1";
  })
  // если пользователь введет название города, которого не существует вывести alert
  .catch(() => {
    alert("Город не был найден, пожалуйста, повторите попытку!");
    app.style.opacity = "1";
  });
}

// вызов функции на странице при загрузке
fetchWeatherData();

// скрыть со страницы
app.style.opacity = "1";  