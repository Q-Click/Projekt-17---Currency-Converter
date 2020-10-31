import axios from "axios";
import { primary_c } from "./setupFunction";

export const getData = async () => {
  let currencyUrl = `https://api.frankfurter.app/currencies`;
  let currencyValue = `https://api.frankfurter.app/latest?from=PLN`;
  let qcountries = `https://restcountries.eu/rest/v2/all`;

  let currency_names = await query(currencyUrl);
  let countries = await query(qcountries);
  let currencyVal = await query(currencyValue);
  if (!currency_names || !countries || !currencyVal) return false;

  return filterResult(currency_names, countries, currencyVal.rates);
};

const query = async (url) => {
  let result = await axios
    .get(url)
    .then((res) => {
      if (res.status !== 200) return false;
      if (res.status === 200) return res.data;
    })
    .catch((err) => {
      if (err) return false;
    });
  return result;
};

const filterResult = async (currencies, countries, rates) => {
  let new_countries = await countries.filter((country) => {
    for (let i in currencies) {
      if (i === country.currencies[0].code) return country;
    }
  });

  let currency = generate_currency(currencies, rates);

  return { new_countries, currency };
};

const generate_currency = (currencies, rates) => {
  let h = [];
  for (let i in currencies) {
    for (let x in rates) {
      if (i === x) {
        h.push({
          code: i,
          name: currencies[i],
          value: rates[i],
        });
      }
    }
  }
  h.push(primary_c);
  return h;
};
