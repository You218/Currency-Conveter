const BASE_URL =
  "https://v6.exchangerate-api.com/v6/13b48c38228afa1ab16d14fa/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const fromCurrency = fromCurr.value;
  const toCurrency = toCurr.value;
  const URL = `${BASE_URL}/${fromCurrency}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    if (data.result === "success") {
      let rate = data.conversion_rates[toCurrency];

      if (rate) {
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount.toFixed(
          2
        )} ${toCurrency}`;
      } else {
        msg.innerText = `Exchange rate not found for ${fromCurrency} to ${toCurrency}`;
      }
    } else {
      msg.innerText = "Error fetching exchange rate. Please try again later.";
    }
  } catch (error) {
    msg.innerText = "Error fetching exchange rate. Please try again later.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
