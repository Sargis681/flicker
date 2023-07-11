let form = document.querySelector("form");
let input = document.querySelector(".form__input");
let box = document.querySelector(".box");
let container__images = document.querySelector(".container__images");
let boxs = document.querySelector(".boxs");
let draggedItem = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let searchTerms = input.value
    .trim()
    .split(" ")
    .filter((e) => e.trim().length > 0);
  if (input.value === "") {
    input.placeholder = "field is empty...";
  } else {
    let uniqueSearchTerms = searchTerms.filter(
      (item, index) => searchTerms.indexOf(item) === index
    );

    async function fetchData(term) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "GET",
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b3ce50d157bf5280e6b91ebc5f42bdd8&format=json&nojsoncallback=1&text=${term}&per_page=5`
        );

        xhr.onload = () => {
          if (xhr.status === 200) {
            const json = JSON.parse(xhr.responseText);
            const images = json.photos.photo.map((photo) => {
              return {
                k_name: term,
                img: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
              };
            });
            resolve({ name: term, images });
          } else {
            reject(new Error(`Failed to fetch data for term: ${term}`));
          }
        };
        xhr.onerror = () => {
          reject(new Error(`Failed to fetch data for term: ${term}`));
        };
        xhr.send();
      });
    }

    try {
      const results = [];
      for (const term of uniqueSearchTerms) {
        try {
          const data = await fetchData(term);
          results.push(data);
        } catch (error) {
          console.error(error);
        }
      }
      const allData = results.flatMap((result) => result.images);
      main(allData, uniqueSearchTerms);
    } catch (error) {
      console.error(error);
    }
  }
});

function main(datas, searchTerms) {
  boxs.innerText = "";
  container__images.innerText = "";
  searchTerms = searchTerms.filter((term) =>
    datas.some((el) => el.k_name === term)
  );
  if (datas.length === 0) {
    container__images.innerText = "There are no pictures with that name...";
  }
  datas
    .sort(() => Math.random() - 0.5)
    .forEach((el) => {
      let licImg = document.createElement("img");
      licImg.setAttribute("src", el.img);
      licImg.setAttribute("alt", el.k_name);
      licImg.setAttribute("class", "container__img");

      licImg.setAttribute("id", el.k_name);
      licImg.addEventListener("dragstart", handleDragStart);
      licImg.addEventListener("dragend", handleDragEnd);
      licImg.addEventListener("drag", handleDrag);
      container__images.appendChild(licImg);
    });
  searchTerms.forEach((el) => {
    let boxBox = document.createElement("div");
    boxBox.setAttribute("class", "boxBox");
    boxBox.innerHTML = `<p class="container__name" >${el}</p>`;
    boxBox.addEventListener("click", zoomClick);
    boxBox.setAttribute("id", el);
    boxBox.addEventListener("dragenter", handleDragEnter);
    boxBox.addEventListener("dragleave", handleDragLeave);
    boxBox.addEventListener("dragover", handleDragOver);
    boxBox.addEventListener("drop", handleDrop);
    boxs.appendChild(boxBox);
  });
  input.value = "";
}

function handleDragStart(event) {
  this.classList.add("container__img--active");
  container__images.classList.add("container__images--active");
  draggedItem = this;
}

function handleDragEnd() {
  this.classList.remove("container__img--active");
  draggedItem = null;
  container__images.classList.remove("container__images--active");
}

function handleDrag(event) {}

function handleDragEnter(event) {
  event.preventDefault();
  this.classList.add("boxBox--active");
}

function handleDragLeave(event) {
  this.classList.remove("boxBox--active");
}

function handleDragOver(event) {
  this.classList.remove("boxBox--active");
  event.preventDefault();
}

function handleDrop() {
  if (draggedItem.id === this.id) {
    this.append(draggedItem);
  } else {
  }
  if (container__images.childElementCount === 0) {
    let win = document.createElement("p");
    win.setAttribute("class", "container__win");
    win.innerText = "YOU WIN   )))))";
    container__images.append(win);
  }
}

function zoomClick() {
  if (this.classList.contains("boxBox--zoom")) {
    this.classList.remove("boxBox--zoom");
  } else {
    this.classList.add("boxBox--zoom");
  }
}
