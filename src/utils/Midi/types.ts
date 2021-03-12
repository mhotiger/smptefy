
export interface TCtime{
	h: number
	m: number
	s: number
	f: number
}

export const fps24 = 0
export const fps25 = 1
export const fps2997 = 2
export const fps30 = 3

export type TCFramerate = typeof fps24 | typeof fps25 | typeof fps2997 | typeof fps30

