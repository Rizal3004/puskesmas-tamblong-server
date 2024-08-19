
export function base64Encode (buf: ArrayBuffer) {
  let string = '';
  (new Uint8Array(buf)).forEach(
      (byte) => { string += String.fromCharCode(byte) }
    )
  return btoa(string)
}

export function base64Decode (str: string) {
  str = atob(str);
  const
    length = str.length,
    buf = new ArrayBuffer(length),
    bufView = new Uint8Array(buf);
  for (var i = 0; i < length; i++) { bufView[i] = str.charCodeAt(i) }
  return buf
}