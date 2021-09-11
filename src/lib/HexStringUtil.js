export function stringToHex(string) {
  return string
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

export function hexToString(hex) {
  return decodeURIComponent(
    hex
      .replace(/\s+/g, "")
      .replace(/[0-9a-f]{2}/g, "%$&")
      .substring(2)
  );
}
