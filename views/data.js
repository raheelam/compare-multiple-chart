const addCryptoFile = async (name = 'ADA') => {
  console.log(name);
  const body = JSON.stringify({ name: name });
  try {
    return await fetch(`ohlcv/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    });
  } catch (err) {
    console.log(err);
  }
};
