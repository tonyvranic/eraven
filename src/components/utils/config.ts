// Layout config (copied from SCSS)
export interface LayoutConfig {
  dt: { columns: 24 }; // Desktop
  xl: { columns: 24 };
  lg: { columns: 12 };
  md: { columns: 12 };
  sm: { columns: 12 };
  xs: { columns: 12 };
  xxs: { columns: 12 };
}

export type LayoutBreakpoint = keyof LayoutConfig;

export const responsiveKeys: LayoutBreakpoint[] = [
  'dt', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs',
];


// Spacing config (copied from SCSS)
export type SpacingValue = '0' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export const spacingValues: SpacingValue[] = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
