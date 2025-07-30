import XRegExp from "xregexp";

export function capitalizeWords(str = "") {
  return XRegExp.replace(str, XRegExp("\\p{L}+", "g"), (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}
