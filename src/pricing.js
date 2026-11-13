// Single source of truth for document prices (USD per paper).
export const PRICES = {
  Copy: { Transcript: 1, Certificate: 1 },
  New: { Transcript: 2.5, Certificate: 5 },
};

export const REQUEST_KINDS = [
  { value: "Copy", label: "Copy", desc: "Copy of an existing document" },
  { value: "New", label: "New document", desc: "Newly issued original" },
];

export const formatUSD = (n) => `$${Number(n || 0).toFixed(2)}`;
