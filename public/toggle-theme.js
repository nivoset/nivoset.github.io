const primaryColorScheme = ""; // "light" | "dark"

const currentTheme = localStorage.getItem("theme");
const currentPalette = localStorage.getItem("palette");

function getPreferTheme() {
  if (currentTheme === "light" || currentTheme === "dark") return currentTheme;
  if (primaryColorScheme) return primaryColorScheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();
let paletteValue = currentPalette === "purple" || currentTheme === "purple" ? "purple" : "green";

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);
  document.firstElementChild.setAttribute("data-palette", paletteValue);
  const paletteButton = document.querySelector("#palette-btn");
  if (paletteButton) {
    const nextPalette = paletteValue === "green" ? "purple" : "green";
    paletteButton.textContent = nextPalette === "purple" ? "💜" : "🌿";
    paletteButton.setAttribute("aria-label", `Switch to ${nextPalette} theme`);
    paletteButton.setAttribute("title", `Switch to ${nextPalette} theme`);
  }
}

function setTheme(theme) {
  themeValue = theme;
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

function setPalette(palette) {
  paletteValue = palette;
  localStorage.setItem("palette", paletteValue);
  reflectPreference();
}

reflectPreference();

window.onload = () => {
  reflectPreference();
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    setTheme(themeValue === "light" ? "dark" : "light");
  });
  document.querySelector("#palette-btn")?.addEventListener("click", () => {
    setPalette(paletteValue === "green" ? "purple" : "green");
  });
};

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches: isDark }) => {
  if (!localStorage.getItem("theme") || localStorage.getItem("theme") === "purple") {
    setTheme(isDark ? "dark" : "light");
  }
});

