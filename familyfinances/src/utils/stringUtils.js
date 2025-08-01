export function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ""
    )
    .join(" ");
}
