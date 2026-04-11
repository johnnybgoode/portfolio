import { style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';

// ── Shared ────────────────────────────────────────────────────────────────────

export const pageContainer = style({
  maxWidth: '100%',
  paddingInline: vars.space['600'],
  paddingBlock: vars.space['600'],
});

export const pageTitle = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  fontWeight: vars.typography.weight['500'],
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: colorVars.body,
  opacity: 0.4,
  marginBottom: vars.space['600'],
  textAlign: 'center',
});

export const breadcrumb = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space['300'],
  marginBottom: vars.space['600'],
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
});

export const breadcrumbLink = style({
  color: colorVars.body,
  opacity: 0.35,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'opacity 0.15s',
  selectors: {
    '&:hover': { opacity: 0.65 },
  },
});

export const breadcrumbSep = style({
  color: colorVars.body,
  opacity: 0.2,
});

export const breadcrumbCurrent = style({
  color: colorVars.body,
  opacity: 0.75,
});

// ── Album Grid ────────────────────────────────────────────────────────────────

export const albumGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space['350'],
  maxWidth: '920px',
  marginInline: 'auto',
});

export const albumCard = style({
  position: 'relative',
  aspectRatio: '4 / 3',
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: '2px',
  display: 'block',
  textDecoration: 'none',
});

export const albumCover = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s ease',
  selectors: {
    [`${albumCard}:hover &`]: { transform: 'scale(1.04)' },
  },
});

export const albumOverlay = style({
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: vars.space['500'],
});

export const albumName = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['200'],
  fontWeight: vars.typography.weight['500'],
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#fff',
});

export const albumCount = style({
  fontFamily: vars.typography.font.body,
  fontSize: vars.typography.size['50'],
  color: 'rgba(255,255,255,0.55)',
  marginTop: vars.space['100'],
  letterSpacing: '0.04em',
});

// ── Sub-Album Grid (masonry) ──────────────────────────────────────────────────

export const subAlbumGrid = style({
  columns: 2,
  columnGap: vars.space['350'],
  maxWidth: '1200px',
  marginInline: 'auto',
});

export const subAlbumItem = style({
  breakInside: 'avoid',
  marginBottom: vars.space['350'],
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: '2px',
  display: 'block',
  textDecoration: 'none',
});

export const subAlbumCover = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  transition: 'transform 0.35s ease',
  selectors: {
    [`${subAlbumItem}:hover &`]: { transform: 'scale(1.03)' },
  },
});

export const subAlbumOverlay = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: vars.space['400'],
  opacity: 0,
  transition: 'opacity 0.2s',
  selectors: {
    [`${subAlbumItem}:hover &`]: { opacity: 1 },
  },
});

export const subAlbumName = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  fontWeight: vars.typography.weight['500'],
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#fff',
});

export const subAlbumCount = style({
  fontFamily: vars.typography.font.body,
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.5)',
  marginTop: vars.space['100'],
});

// ── Photo Grid (justified rows) ───────────────────────────────────────────────

export const photoGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space['300'],
  maxWidth: '1200px',
  marginInline: 'auto',
});

export const photoRow = style({
  display: 'flex',
  gap: vars.space['300'],
  height: '220px',
});

export const photoItem = style({
  position: 'relative',
  overflow: 'hidden',
  cursor: 'zoom-in',
  borderRadius: '1px',
  flexShrink: 0,
});

export const photoImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'filter 0.25s',
  selectors: {
    [`${photoItem}:hover &`]: { filter: 'brightness(1.08)' },
  },
});

export const photoHint = style({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.2s',
  selectors: {
    [`${photoItem}:hover &`]: { opacity: 1 },
  },
});

export const photoHintIcon = style({
  width: '36px',
  height: '36px',
  border: '1.5px solid rgba(255,255,255,0.7)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '18px',
  lineHeight: 1,
});

// ── Lightbox ──────────────────────────────────────────────────────────────────

export const lightboxBackdrop = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

export const lightboxInner = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space['400'],
  padding: `${vars.space['800']} 80px`,
  width: '100%',
  maxWidth: '1000px',
  position: 'relative',
});

export const lightboxImg = style({
  maxWidth: '100%',
  maxHeight: '82vh',
  objectFit: 'contain',
  borderRadius: '2px',
  display: 'block',
});

export const lightboxMeta = style({
  textAlign: 'center',
});

export const lightboxTitle = style({
  fontFamily: vars.typography.font.body,
  fontSize: vars.typography.size['100'],
  color: colorVars.body,
  opacity: 0.65,
  letterSpacing: '0.04em',
});

export const lightboxAlbum = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  color: colorVars.body,
  opacity: 0.3,
  marginTop: vars.space['100'],
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
});

const navButton = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '44px',
  height: '44px',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '22px',
  background: 'rgba(255,255,255,0.04)',
  transition: 'background 0.15s, border-color 0.15s',
  selectors: {
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      borderColor: 'rgba(255,255,255,0.3)',
    },
  },
});

export const lightboxPrev = style([navButton, { left: '20px' }]);
export const lightboxNext = style([navButton, { right: '20px' }]);

export const lightboxClose = style([
  navButton,
  { position: 'absolute', top: '16px', right: '20px', transform: 'none' },
]);
