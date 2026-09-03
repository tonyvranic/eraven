import type { SvgComponent } from 'astro/types';

export type IconSize = 16 | 24 | 32;

export const iconRegistry = [
  'Close',
  'ChevronRight',
  'SocialYoutube',
  'SocialSpotify',
  'SocialBandcamp',
  'SocialItchio',
  'SocialMail',
  'SocialLinkedin',
  'SocialCopyLink'
] as const;

export type IconName = typeof iconRegistry[number];

export interface IconProps {
  name: IconName;
  size?: IconSize;
  class?: string;
}

export type IconMap = Record<IconName, SvgComponent>;