/**
 * Larger, pill-shaped call to action used across the homepage. The trailing
 * padding override is needed because the Button `lg` size reduces the right
 * padding (`has-data-[icon=inline-end]:pr-2`) when it holds a trailing icon,
 * which would otherwise leave the label off-center next to `px-6`.
 */
export const heroButtonClassName =
  "h-11 rounded-full px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5";
