// Array of light pastel colors that work well with text
export const avatarColors = [
  'bg-blue-400',
  'bg-green-400',
  'bg-amber-400',
  'bg-rose-400',
  'bg-violet-400',
  'bg-cyan-400',
  'bg-fuchsia-400',
  'bg-pink-400',
  'bg-emerald-400',
  'bg-sky-400'
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
