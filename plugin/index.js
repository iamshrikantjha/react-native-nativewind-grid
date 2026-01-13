const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addUtilities, matchUtilities, theme }) {
  // Base grid utility
  addUtilities({
    '.grid': {
      // We don't need actual styles here as our runtime component handles it,
      // but this ensures Tailwind generates the class
    },
    '.grid-flow-row': {},
    '.grid-flow-col': {},
    '.auto-cols-fr': {},
    '.auto-rows-fr': {},
  });

  // Grid columns: grid-cols-1 through grid-cols-12
  matchUtilities(
    {
      'grid-cols': (value) => ({}),
      'grid-rows': (value) => ({}),
    },
    {
      values: {
        ...Array.from({ length: 12 }, (_, i) => i + 1).reduce(
          (acc, curr) => ({ ...acc, [curr]: curr }),
          {}
        ),
      },
    }
  );

  // Spans: col-span-1 through col-span-12
  // Starts/Ends: 1 through 13
  matchUtilities(
    {
      'col-span': (value) => ({}),
      'row-span': (value) => ({}),
    },
    {
      values: {
        ...Array.from({ length: 12 }, (_, i) => i + 1).reduce(
          (acc, curr) => ({ ...acc, [curr]: curr }),
          {}
        ),
      },
    }
  );

  matchUtilities(
    {
      'col-start': (value) => ({}),
      'row-start': (value) => ({}),
      'col-end': (value) => ({}),
      'row-end': (value) => ({}),
    },
    {
      values: {
        ...Array.from({ length: 13 }, (_, i) => i + 1).reduce(
          (acc, curr) => ({ ...acc, [curr]: curr }),
          {}
        ),
      },
    }
  );

  // Gap utilities
  matchUtilities(
    {
      'gap': (value) => ({}),
      'gap-x': (value) => ({}),
      'gap-y': (value) => ({}),
    },
    { values: theme('spacing') }
  );
});
