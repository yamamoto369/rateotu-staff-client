export function addThousandsSeparator(n) {
  const parts = n.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function formatCurrency(value, precision = 2) {
  /*
    Returns a string with with decimal seperator.
    Note: Returns 0.00 if the amount is "falsey".
  */
  return Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  });
}
