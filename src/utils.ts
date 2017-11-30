const candidates = 'abcdefghijklmnopqrstuvwxyz'.split('')

export function generateFreeIdentifier(usedIdentifiers: string[]) {
  return candidates.find(_ => usedIdentifiers.indexOf(_) < 0)!
}
