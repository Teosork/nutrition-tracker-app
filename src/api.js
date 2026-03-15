async function fetchProduct(barcode) {
  const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);

  if (!response.ok) {
    const error = new Error(`HTTP error: ${response.status}`);
    error.status = response.status; 
    throw error;
  }

  const data = await response.json();
  return data;
}

async function fetchProductWithRetry(barcode, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const productData = await fetchProduct(barcode);
      return productData;
    } catch (error) {
        if (error.status === 404) {
          throw error;
        }
        if (attempt === maxRetries) {
          throw error;
        }
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export { fetchProductWithRetry };