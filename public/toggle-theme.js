const primaryColorScheme = "dark"; // "light" | "dark"

const currentTheme = localStorage.getItem("theme");
// Retire the previous palette preference; purple is now the shared theme.
localStorage.removeItem("palette");

function getPreferTheme() {
  if (currentTheme === "light" || currentTheme === "dark") return currentTheme;
  if (primaryColorScheme) return primaryColorScheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);
  document.firstElementChild.removeAttribute("data-palette");
  const themeButton = document.querySelector("#theme-btn");
  if (themeButton) themeButton.setAttribute("aria-label", `Switch to ${themeValue === "dark" ? "light" : "dark"} mode`);

}

function setTheme(theme) {
  themeValue = theme;
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}



reflectPreference();

window.onload = () => {
  reflectPreference();
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    setTheme(themeValue === "light" ? "dark" : "light");
  });

};

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches: isDark }) => {
  if (!localStorage.getItem("theme") || localStorage.getItem("theme") === "purple") {
    setTheme(isDark ? "dark" : "light");
  }
});

