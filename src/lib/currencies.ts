export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "IDR", label: "Rp Rupiah", locale: "id-ID" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound Sterling", locale: "en-GB" },
];

export type Currency = (typeof Currencies)[number];
