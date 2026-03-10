async function fetchProduct(barcode) {
  const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export {fetchProduct};