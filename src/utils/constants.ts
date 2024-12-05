export const stats = [
  { label: "Movies", value: "10,000+" },
  { label: "Genres", value: "20+" },
  { label: "Languages", value: "50+" },
  { label: "New Weekly", value: "100+" },
];

export const features = [
  {
    title: "HD Quality",
    description: "Watch all movies in high definition quality",
    icon: "🎥",
  },
  {
    title: "Regular Updates",
    description: "New movies added every week",
    icon: "🔄",
  },
  {
    title: "Watch Anywhere",
    description: "Available on all your devices",
    icon: "📱",
  },
];

export const popularGenres = [28, 12, 35, 18, 27, 10749];

export const genreGradients: Record<number, string> = {
  28: "from-indigo-900 to-blue-800", // Action
  12: "from-slate-900 to-zinc-800", // Adventure
  35: "from-violet-900 to-purple-800", // Comedy
  18: "from-gray-900 to-neutral-800", // Drama
  27: "from-stone-900 to-zinc-800", // Horror
  10749: "from-zinc-900 to-slate-800", // Romance
};

export const filterButtonStyles = {
  base: "px-4 py-2 rounded-lg text-sm font-medium transition-all",
  inactive: "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white",
  active: "text-white shadow-lg",
  clearButton: "text-sm text-blue-400 hover:text-blue-300 transition-colors",
  resetButton:
    "w-full px-4 py-2.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-500 rounded-lg hover:from-red-500/30 hover:to-orange-500/30 transition-all text-sm font-medium flex items-center justify-center gap-2",
  exploreButton:
    "w-full px-4 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-lg hover:from-blue-800 hover:to-indigo-700 transition-all text-sm font-medium flex items-center justify-center gap-2 group",
};
