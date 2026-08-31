export const typographyConfig = {
  display: ['3xl', '2xl', 'xl', 'lg', 'md', 'sm'],
  heading: ['xl', 'lg', 'md', 'sm', 'xs', '2xs'],
  body: ['lg', 'md'],
  label: ['md'],
} as const;

export type TypographyConfig = typeof typographyConfig;

type TypographyRole = keyof TypographyConfig;

export type TypographyType = {
  [Role in TypographyRole]: `${Role}-${TypographyConfig[Role][number]}`;
}[TypographyRole];

export type TextElement = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';