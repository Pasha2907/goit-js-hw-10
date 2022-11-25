import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { populationFormat } from './populationFormat';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(evt) {
  evt.preventDefault();

  const name = evt.target.value.trim();

  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';

  if (!name) {
    return;
  }

  fetchCountries(name)
    .then(country => {
      if (country.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (country.length <= 10 && country.length >= 2) {
        return createMarkupForCountries(country);
      }
      if (country.length === 1) {
        return createCardForCountry(country);
      }
    })
    .catch(error => {
      return Notiflix.Notify.failure(
        'Oops, there is no country with that name'
      );
    });
}

function createMarkupForCountries(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
                <li class="country-list__item">
                    <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 35px height = 20px>
                    <p class="country-list__name">${name.official}</p>
                </li>
                `;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function createCardForCountry(country) {
  const markup = country
    .map(({ flags, name, capital, population, languages }) => {
      const totalPeople = populationFormat(population);
      return `<img width="200px" height="100px" src='${flags.svg}'
      alt='${name.official} flag' />
        <ul class="country-info__list">
            <li class="country-info__item country-info__item--name"><p><b>Name: </b>${
              name.official
            }</p></li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${totalPeople}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(
              languages
            )}</p></li>
        </ul>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}
