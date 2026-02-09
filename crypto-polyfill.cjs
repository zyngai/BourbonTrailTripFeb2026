const crypto = require('crypto')
if (!globalThis.crypto) globalThis.crypto = {}
if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = (arr) => crypto.randomFillSync(arr)
}
