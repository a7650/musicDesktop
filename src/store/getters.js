export const singer = state=> state.singer

export const playList = state => state.playList

export const playing = state => state.playing

export const currentIndex = state => state.currentIndex

export const currentSong = state => {return state.playList[state.currentIndex] || {}}

export const playMode = state => state.playMode

export const sequenceList = state => state.sequenceList

export const favoriteMid = state => state.favoriteMid

export const myAlbum = state => state.myAlbum

export const favoriteSong = state => state.favoriteSong

export const collectAlbum = state => state.collectAlbum

