const moon = document.querySelector(".moon");
const sun = document.querySelector(".sun");

const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

const iconToggle = () => {
  moon.classList.toggle("display-none");
  sun.classList.toggle("display-none");
};

const themeCheck = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    moon.classList.add("display-none");
    return;
  } else {
    sun.classList.add("display-none");
  }
};

const themeSwitch = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    iconToggle();
    return;
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    iconToggle();
  }
};

sun.addEventListener("click", () => {
  themeSwitch();
});
moon.addEventListener("click", () => {
  themeSwitch();
});

themeCheck();

const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguagedropdown = document.querySelector("#input-language"),
  outputLanguagedropdown = document.querySelector("#output-language");

function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = `${option.name} (${option.native})`;
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguagedropdown, languages);
populateDropdown(outputLanguagedropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", () => {
    dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      let selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});

document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

const inputTextElem = document.querySelector("#input-text");
const outputTextElem = document.querySelector("#output-text");
const inputLanguage = inputLanguagedropdown.querySelector(".selected");
const outputLanguage = outputLanguagedropdown.querySelector(".selected");

function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage =
    inputLanguagedropdown.querySelector(".selected").dataset.value;
  const outputLanguage =
    outputLanguagedropdown.querySelector(".selected").dataset.value;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
    inputText
  )}`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      outputTextElem.value = json[0].map((item) => item[0]).join("");
    })
    .catch((error) => {
      console.log(error);
      console.log("fuck you");
    });
}

inputTextElem.addEventListener("input", (e) => {
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000);
  }
  const length = inputTextElem.value.length;
  const letters = document.querySelector("#input-chars");
  letters.innerHTML = length;
  translate();
});

const swapPosition = document.querySelector(".swap-position");

swapPosition.addEventListener("click", () => {
  const selctedSwitch = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = selctedSwitch;

  const dataValueSwitch = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = dataValueSwitch;

  const textareaSwitch = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = textareaSwitch;

  translate();
});

const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (
    file.type === "application/pdf" ||
    file.type === "application/msword" ||
    file.type === "text/plain" ||
    file.type === "text/css" ||
    file.type === "text/html"
  ) {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);

    console.log(reader.readyState);
    console.log(reader);
    reader.onload = (e) => {
      inputTextElem.value = e.target.result;
    };
    translate();
  } else {
    alert("please select a valid file");
  }
});

const downloadBtn = document.querySelector("#download-document");

downloadBtn.addEventListener("click", (e) => {
  const outputText = outputTextElem.value;
  const outputLanguage =
    outputLanguagedropdown.querySelector(".selected").dataset.value;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" }); // this is take array and convert to bolb and add type of file
    console.log(blob);
    const url = URL.createObjectURL(blob); // translate bolb to url
    console.log(url);
    const a = document.createElement("a");
    a.setAttribute("download", `translated-to-${outputLanguage}.txt`); // title of download file # method one
    // a.download = `translated-to-${outputLanguage}.txt`; // title of download file # method two
    a.href = url; // url that we can download
    a.click(); // this function is let a clicked auto win you click in button
    console.log(a);
  }
});
