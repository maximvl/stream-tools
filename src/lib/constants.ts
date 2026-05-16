import type { ChatServer } from './types'

export const ServerIcons: Record<ChatServer, string> = {
  twitch: 'https://cdn-icons-png.flaticon.com/512/3992/3992643.png',
  vkvideo: 'https://vkvideo.ru/images/icons/favicons/fav_vk_video_2x.ico?8',
  kick: 'https://kick.com/favicon.ico',
  // goodgame: 'https://static.goodgame.ru/images/favicon/favicon-32x32.png',
  // nuum: 'https://cdn-icons-png.flaticon.com/512/7261/7261483.png',
  // youtube: 'https://www.youtube.com/s/desktop/e1590144/img/logos/favicon_32x32.png'
}

export const VkColorsMap: { [key: number]: string } = {
  0: '#D66E34',
  1: '#B8AAFF',
  2: '#1D90FF',
  3: '#9961F9',
  4: '#59A840',
  5: '#E73629',
  6: '#DE6489',
  7: '#20BBA1',
  8: '#F8B301',
  9: '#0099BB',
  10: '#7BBEFF',
  11: '#E542FF',
  12: '#A36C59',
  13: '#8BA259',
  14: '#00A9FF',
  15: '#A20BFF',
}

export const STATIC_ROOT = 'https://mapcar.alwaysdata.net/static'
export const IMG_ROOT = `${STATIC_ROOT}/img`

export const FIREWORKS_IMG = `${IMG_ROOT}/fireworks.gif`

export const ANIME_BACKGROUND_IMG = `${IMG_ROOT}/sakura1.webp`
export const PRAY_IMG = `${IMG_ROOT}/pray.webp`
export const CAT_DANCE_IMG = `${IMG_ROOT}/cat_dance.webp`

export const POG_IMG = `${IMG_ROOT}/pog_smile.png`
export const EZ_SMILE_IMG = `${IMG_ROOT}/ez_smile.avif`
export const GAGA_SMILE_IMG = `${IMG_ROOT}/gaga_smile.avif`