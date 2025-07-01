// Array of light pastel colors that work well with text
export const avatarColors = [
  'bg-blue-100',
  'bg-green-100',
  'bg-amber-100',
  'bg-rose-100',
  'bg-violet-100',
  'bg-cyan-100',
  'bg-fuchsia-100',
  'bg-pink-100',
  'bg-emerald-100',
  'bg-sky-100'
];

/**
 * Generates a consistent color class based on an input string
 * @param {string} str - The input string to generate a color for
 * @returns {string} A Tailwind CSS background color class
 */
export const getColorFromString = (str) => {
  if (!str) return 'bg-gray-200'; // default color if string is empty
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};
