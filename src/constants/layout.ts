export const APP_SHELL = {
  // content
  container: "mx-auto w-full px-4 sm:px-6 lg:px-8",

  // responsive width steps (mobile -> tablet -> desktop)
  width: "max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl",

  // bottom nav wrapper (fixed centered, same width as content)
  navWrapper: "fixed bottom-0 left-1/2 z-50 -translate-x-1/2 w-full",
} as const;
