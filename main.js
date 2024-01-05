const API_KEY = "ed05d71e47b4a9e1b36dd20d";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// fetch(`${BASE_URL}/codes`).then((response) => {
//     console.log(response);
//     return response.json();
// }).then((data) => {
//     console.log(data);
// })
async function getSupportedCodes() {
  try {
    const response = await fetch(`${BASE_URL}/codes`);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const codes = data["supported_codes"];
      console.log(codes);
      return codes;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
// getSupportedCodes().then((result) => {
//     console.log(result);
// });

async function getConversionRate(basecode, targetcode) {
  try {
    const response = await fetch(`${BASE_URL}/pair/${basecode}/${targetcode}`);

    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      const rate = data["conversion_rate"];
      return rate;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}
// getConversionRate("USD", "VND").then((result) => console.log(result));
const baseUnit = document.querySelector("#base-unit");
const targetRate = document.querySelector("#target-rate");

const inputBaseAmount = document.querySelector("#base-amount");
const selectBaseCode = document.querySelector("#base-code");
const inputTargetAmount = document.querySelector("#target-amount");
const selectTargetcode = document.querySelector("#target-code");

const errorMsg = document.querySelector(".error-message");

let supportedCodes = [];
let conversionRate = 0;

const updateExchangeRate = async () => {
  const baseCode = selectBaseCode.value;
  const targetCode = selectTargetcode.value;

  errorMsg.textContent = "Loading data...";
  conversionRate = await getConversionRate(baseCode, targetCode);
  if (conversionRate === 0) {
    errorMsg.textContent = "Loading conversion rate fail";
    return;
  } else {
    errorMsg.textContent = "";
    // console.log(conversionRate);

    const baseName = supportedCodes.find((e) => e[0] === baseCode)[1];
    const targetName = supportedCodes.find((e) => e[0] === targetCode)[1];
    baseUnit.textContent = `1 ${baseName} equals `;
    targetRate.textContent = `${conversionRate} ${targetName}`;
  }
};
const initialize = async () => {
  //get supported code from the API
  errorMsg.textContent = "Loading data...";
  supportedCodes = await getSupportedCodes();
  if (!supportedCodes.length) {
    errorMsg.textContent = "No currency to choose";
    return;
  } else {
    errorMsg.textContent = "";
    console.log(supportedCodes);
  }
  //put options into the select boxs
  supportedCodes.forEach((element) => {
    const selection = document.createElement("option");
    selection.value = element[0];
    selection.textContent = element[1];
    selectBaseCode.appendChild(selection);

    const targetOption = document.createElement("option");
    targetOption.value = element[0];
    targetOption.textContent = element[1];
    selectTargetcode.appendChild(targetOption);
  });

  //set VND to USD as default
  selectBaseCode.value = "VND";
  selectTargetcode.value = "USD";
  //update exchange rate
  await updateExchangeRate();
};
selectBaseCode.addEventListener("change", updateExchangeRate);
selectTargetcode.addEventListener("change", updateExchangeRate);
inputBaseAmount.addEventListener("input", () => {
  inputTargetAmount.value =
    Math.round(inputBaseAmount.value * conversionRate * 10 ** 6) / 10 ** 6;
});
inputTargetAmount.addEventListener("input", () => {
  inputBaseAmount.value =
    Math.round((inputTargetAmount.value / conversionRate) * 10 ** 6) / 10 ** 6;
});
initialize();
