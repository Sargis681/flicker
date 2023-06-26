const API_Key = "543f23733be304a1d8ac1fb376ff70bf";
let xhr = new XMLHttpRequest();
let form = document.querySelector("form");
let search = document.querySelector(".form__input");

form.addEventListener( 
  "submit",
  (e) => {
    e.preventDefault();
    let data = [];
    xhr.open(
      "GET",
      `https://api.openweathermap.org/data/2.5/forecast?q=${search.value}&units=metric&cnt=40&appid=${API_Key}`,
      true
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
        main(data, search);
      } else {
        search.placeholder = "No such city exists";
      }
    };
    xhr.onerror = function () {
      console.log("Request failed");
    };

    xhr.send();
    search.value = "";
  },
  false
);

function main(resolve) {
  let wrapper = document.querySelector(".container__wrapper");
  wrapper.innerHTML = "";
  console.log(resolve);
  resolve.list.forEach((element) => {
    wrapper.innerHTML += `
  <div class="cart">
    <div class="cart__item cart__item--flex">
      <span>${resolve.city.name}</span>
      <span>${element.dt_txt.split(" ")[1].substring(0, 5)}</span>
      <span>${element.dt_txt.split(" ")[0].substring(0, 10)}</span>
    </div>

   <div class="cart__item cart__item--column">
    <p class="cart__main">${element.main.temp.toFixed()}  °C </p>
    <span class="cart__description">${element.weather[0].description}</span>
   </div>

    <div class="cart__item cart__item--any">
      <div class="cart__temp">
        <span>max: ${element.main.temp_max.toFixed()}  °C</span>
        <span>min: ${element.main.temp_min.toFixed()} °C</span>
        <span>wind:${element.wind.speed}:h</span>
      </div>
        <p class="cart__rotate" style="transform: rotate(${element.wind.deg}deg)">\u2191</p>
        <img class="cart__weather" src ="https://openweathermap.org/img/w/${element.weather[0].icon}.png"/>
  </div>
   `;
  });
}
