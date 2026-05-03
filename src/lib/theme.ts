export type ThemeColors = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

export const DEFAULT_THEME: ThemeColors = {
  primaryColor: "#0B2A4A",
  secondaryColor: "#1F4E79",
  accentColor: "#F57C00",
  backgroundColor: "#F5F7FA",
  textColor: "#1A1A1A",
};

const hexToRgbTriplet = (hex: string): string => {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
};

export const applyTheme = (theme: Partial<ThemeColors> | undefined) => {
  const t = { ...DEFAULT_THEME, ...(theme || {}) };
  const root = document.documentElement;
  root.style.setProperty("--primary-color", hexToRgbTriplet(t.primaryColor));
  root.style.setProperty("--secondary-color", hexToRgbTriplet(t.secondaryColor));
  root.style.setProperty("--accent-color", hexToRgbTriplet(t.accentColor));
  root.style.setProperty("--background-color", hexToRgbTriplet(t.backgroundColor));
  root.style.setProperty("--text-color", hexToRgbTriplet(t.textColor));
};

export const resetTheme = () => applyTheme(DEFAULT_THEME);
