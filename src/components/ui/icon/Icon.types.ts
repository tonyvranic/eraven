import type { SvgComponent } from 'astro/types';

export type IconSize = 16 | 24 | 32;

export const numberMap = [
  'Number0',
  'Number1',
  'Number2',
  'Number3',
  'Number4',
  'Number5',
  'Number6',
  'Number7',
  'Number8',
  'Number9'
] as const;

export const iconRegistry = [
  'Close',
  'ChevronRight',
  'SocialYoutube',
  'SocialSpotify',
  'SocialBandcamp',
  'SocialItchio',
  'SocialMail',
  'SocialLinkedin',
  'SocialCopyLink',
  ...numberMap,
  'CheckboxUnchecked',
  'CheckboxChecked'
] as const;



export type IconName = typeof iconRegistry[number];

export interface IconProps {
  name: IconName;
  size?: IconSize;
  class?: string;
}

export type IconMap = Record<IconName, SvgComponent>;