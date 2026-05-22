export function amazonLink(searchTerm: string): string {
  return `https://www.amazon.co.il/s?k=${encodeURIComponent(searchTerm)}`;
}

export function aliexpressLink(searchTerm: string): string {
  return `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(searchTerm)}&shipCountry=IL`;
}
