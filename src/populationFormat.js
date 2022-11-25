export { populationFormat };

function populationFormat(numbers) {
  const numberNew = numbers.toString();
  return numberNew.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
