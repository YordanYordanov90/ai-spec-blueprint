import type { GeneratedArtifact } from "../schemas/generated-artifact";

const LOCAL_FILE_HEADER = 0x04034b50;
const CENTRAL_DIRECTORY_HEADER = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const STORE_METHOD = 0;
const ZIP_VERSION = 20;

const CRC_TABLE = new Uint32Array(256);

for (let index = 0; index < 256; index += 1) {
  let value = index;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  CRC_TABLE[index] = value >>> 0;
}

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;

  for (const byte of data) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(target: number[], value: number): void {
  target.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeUint32(target: number[], value: number): void {
  target.push(
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  );
}

function encodeUtf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

/**
 * Deterministic ZIP store archive. Timestamps are zeroed so equivalent
 * artifacts produce identical bytes.
 */
export function buildZipArchive(
  artifacts: readonly GeneratedArtifact[],
): Uint8Array {
  const local: number[] = [];
  const central: number[] = [];
  let offset = 0;

  for (const artifact of artifacts) {
    const nameBytes = encodeUtf8(artifact.relativePath);
    const dataBytes = encodeUtf8(artifact.content);
    const checksum = crc32(dataBytes);
    const size = dataBytes.byteLength;
    const localHeaderOffset = offset;

    writeUint32(local, LOCAL_FILE_HEADER);
    writeUint16(local, ZIP_VERSION);
    writeUint16(local, 0);
    writeUint16(local, STORE_METHOD);
    writeUint16(local, 0);
    writeUint16(local, 0);
    writeUint32(local, checksum);
    writeUint32(local, size);
    writeUint32(local, size);
    writeUint16(local, nameBytes.byteLength);
    writeUint16(local, 0);
    local.push(...nameBytes);
    local.push(...dataBytes);

    offset += 30 + nameBytes.byteLength + size;

    writeUint32(central, CENTRAL_DIRECTORY_HEADER);
    writeUint16(central, ZIP_VERSION);
    writeUint16(central, ZIP_VERSION);
    writeUint16(central, 0);
    writeUint16(central, STORE_METHOD);
    writeUint16(central, 0);
    writeUint16(central, 0);
    writeUint32(central, checksum);
    writeUint32(central, size);
    writeUint32(central, size);
    writeUint16(central, nameBytes.byteLength);
    writeUint16(central, 0);
    writeUint16(central, 0);
    writeUint16(central, 0);
    writeUint16(central, 0);
    writeUint32(central, 0);
    writeUint32(central, localHeaderOffset);
    central.push(...nameBytes);
  }

  const centralOffset = offset;
  const end: number[] = [];

  writeUint32(end, END_OF_CENTRAL_DIRECTORY);
  writeUint16(end, 0);
  writeUint16(end, 0);
  writeUint16(end, artifacts.length);
  writeUint16(end, artifacts.length);
  writeUint32(end, central.length);
  writeUint32(end, centralOffset);
  writeUint16(end, 0);

  return Uint8Array.from([...local, ...central, ...end]);
}
