import { crc32 } from "../export/zip";
import {
  CURRENT_BLUEPRINT_SCHEMA_VERSION,
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";

const LOCAL_FILE_HEADER = 0x04034b50;
const CENTRAL_DIRECTORY_HEADER = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const STORE_METHOD = 0;
const BLUEPRINT_PATH = "blueprint.json";
export const MAX_BLUEPRINT_IMPORT_BYTES = 5 * 1024 * 1024;
const MAX_ZIP_ENTRIES = 1_024;

function readUint16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

function assertRange(
  bytes: Uint8Array,
  offset: number,
  length: number,
  label: string,
): void {
  if (
    offset < 0 ||
    length < 0 ||
    offset > bytes.byteLength ||
    length > bytes.byteLength - offset
  ) {
    throw new Error(`The ZIP has an invalid ${label}.`);
  }
}

function decodeUtf8(decoder: TextDecoder, bytes: Uint8Array, label: string): string {
  try {
    return decoder.decode(bytes);
  } catch {
    throw new Error(`The ZIP contains invalid UTF-8 in its ${label}.`);
  }
}

function hasZipLocalFileSignature(bytes: Uint8Array): boolean {
  return (
    bytes.byteLength >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  );
}

function looksLikeJson(bytes: Uint8Array): boolean {
  const sample = new TextDecoder().decode(bytes.subarray(0, 512));
  return sample.replace(/^\uFEFF/, "").trimStart().startsWith("{");
}

export function extractBlueprintDocumentFromZip(bytes: Uint8Array): string {
  if (bytes.byteLength > MAX_BLUEPRINT_IMPORT_BYTES) {
    throw new Error("The imported ZIP is too large. Keep exports under 5 MB.");
  }
  if (!hasZipLocalFileSignature(bytes)) {
    throw new Error("The imported file does not start with a ZIP local-file signature.");
  }
  if (bytes.byteLength < 22) {
    throw new Error("The ZIP is missing a valid end-of-central-directory record.");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const minimumEndOffset = Math.max(0, bytes.byteLength - 65_557);
  let endOffset = -1;

  for (let offset = bytes.byteLength - 22; offset >= minimumEndOffset; offset -= 1) {
    if (readUint32(view, offset) !== END_OF_CENTRAL_DIRECTORY) continue;
    const commentLength = readUint16(view, offset + 20);
    if (offset + 22 + commentLength !== bytes.byteLength) continue;
    const candidateDiskNumber = readUint16(view, offset + 4);
    const candidateCentralDisk = readUint16(view, offset + 6);
    const candidateEntriesOnDisk = readUint16(view, offset + 8);
    const candidateEntryCount = readUint16(view, offset + 10);
    const candidateCentralSize = readUint32(view, offset + 12);
    const candidateCentralOffset = readUint32(view, offset + 16);
    if (
      candidateDiskNumber === 0 &&
      candidateCentralDisk === 0 &&
      candidateEntriesOnDisk === candidateEntryCount &&
      candidateEntryCount > 0 &&
      candidateEntryCount <= MAX_ZIP_ENTRIES &&
      candidateCentralOffset <= offset &&
      candidateCentralSize <= offset - candidateCentralOffset &&
      candidateCentralOffset + candidateCentralSize === offset
    ) {
      endOffset = offset;
      break;
    }
  }

  if (endOffset < 0) {
    throw new Error("The ZIP is missing a valid end-of-central-directory record.");
  }

  const diskNumber = readUint16(view, endOffset + 4);
  const centralDisk = readUint16(view, endOffset + 6);
  const entriesOnDisk = readUint16(view, endOffset + 8);
  const entryCount = readUint16(view, endOffset + 10);
  const centralSize = readUint32(view, endOffset + 12);
  const centralOffset = readUint32(view, endOffset + 16);

  if (
    diskNumber !== 0 ||
    centralDisk !== 0 ||
    entriesOnDisk !== entryCount ||
    entryCount === 0 ||
    entryCount > MAX_ZIP_ENTRIES ||
    centralOffset > endOffset ||
    centralSize > endOffset - centralOffset ||
    centralOffset + centralSize !== endOffset
  ) {
    throw new Error("The ZIP central directory is not a supported single-disk archive.");
  }

  type CentralEntry = {
    name: string;
    checksum: number;
    compressedSize: number;
    uncompressedSize: number;
    flags: number;
    method: number;
    localOffset: number;
  };

  const entries: CentralEntry[] = [];
  const names = new Set<string>();
  let centralCursor = centralOffset;

  for (let index = 0; index < entryCount; index += 1) {
    assertRange(bytes, centralCursor, 46, "central-directory entry");
    if (readUint32(view, centralCursor) !== CENTRAL_DIRECTORY_HEADER) {
      throw new Error("The ZIP central directory contains an invalid entry.");
    }

    const flags = readUint16(view, centralCursor + 8);
    const method = readUint16(view, centralCursor + 10);
    const checksum = readUint32(view, centralCursor + 16);
    const compressedSize = readUint32(view, centralCursor + 20);
    const uncompressedSize = readUint32(view, centralCursor + 24);
    const nameLength = readUint16(view, centralCursor + 28);
    const extraLength = readUint16(view, centralCursor + 30);
    const commentLength = readUint16(view, centralCursor + 32);
    const diskStart = readUint16(view, centralCursor + 34);
    const localOffset = readUint32(view, centralCursor + 42);
    const entryLength = 46 + nameLength + extraLength + commentLength;
    assertRange(bytes, centralCursor, entryLength, "central-directory entry data");

    if (
      flags !== 0 ||
      method !== STORE_METHOD ||
      compressedSize !== uncompressedSize ||
      diskStart !== 0
    ) {
      throw new Error("The ZIP uses an unsupported compression or header format.");
    }

    const name = decodeUtf8(
      decoder,
      bytes.subarray(centralCursor + 46, centralCursor + 46 + nameLength),
      "file name",
    );
    if (!name || names.has(name)) {
      throw new Error("The ZIP contains a duplicate or empty file name.");
    }
    names.add(name);
    entries.push({
      name,
      checksum,
      compressedSize,
      uncompressedSize,
      flags,
      method,
      localOffset,
    });
    centralCursor += entryLength;
  }

  if (centralCursor !== endOffset || entries.filter((entry) => entry.name === BLUEPRINT_PATH).length !== 1) {
    throw new Error("The ZIP must contain exactly one blueprint.json entry.");
  }

  const sortedEntries = [...entries].sort((left, right) => left.localOffset - right.localOffset);
  let localCursor = 0;
  let blueprintDocument: string | null = null;

  for (const entry of sortedEntries) {
    if (entry.localOffset !== localCursor) {
      throw new Error("The ZIP local entries do not match the central directory offsets.");
    }
    assertRange(bytes, entry.localOffset, 30, "local-file header");
    if (readUint32(view, entry.localOffset) !== LOCAL_FILE_HEADER) {
      throw new Error("The ZIP local-file header is invalid.");
    }

    const localFlags = readUint16(view, entry.localOffset + 6);
    const localMethod = readUint16(view, entry.localOffset + 8);
    const localChecksum = readUint32(view, entry.localOffset + 14);
    const localCompressedSize = readUint32(view, entry.localOffset + 18);
    const localUncompressedSize = readUint32(view, entry.localOffset + 22);
    const nameLength = readUint16(view, entry.localOffset + 26);
    const extraLength = readUint16(view, entry.localOffset + 28);
    const nameStart = entry.localOffset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const dataEnd = dataStart + entry.compressedSize;
    assertRange(bytes, nameStart, nameLength + extraLength, "local-file name and extra data");
    assertRange(bytes, dataStart, entry.compressedSize, "local-file data");

    const localName = decodeUtf8(decoder, bytes.subarray(nameStart, nameStart + nameLength), "file name");
    if (
      localName !== entry.name ||
      localFlags !== entry.flags ||
      localMethod !== entry.method ||
      localChecksum !== entry.checksum ||
      localCompressedSize !== entry.compressedSize ||
      localUncompressedSize !== entry.uncompressedSize ||
      dataEnd > centralOffset
    ) {
      throw new Error("The ZIP local-file header does not match its central-directory entry.");
    }

    const data = bytes.subarray(dataStart, dataEnd);
    if (crc32(data) !== entry.checksum) {
      throw new Error(`The ZIP entry ${entry.name} failed its integrity check.`);
    }
    if (entry.name === BLUEPRINT_PATH) {
      blueprintDocument = decodeUtf8(decoder, data, "blueprint.json");
    }
    localCursor = dataEnd;
  }

  if (localCursor !== centralOffset || blueprintDocument === null) {
    throw new Error("The ZIP does not contain a complete blueprint.json entry.");
  }
  return blueprintDocument;
}

export function parseImportedBlueprintDocument(document: string): ProjectBlueprint {
  let parsed: unknown;

  try {
    parsed = JSON.parse(document);
  } catch {
    throw new Error("The imported blueprint is not valid JSON.");
  }

  const result = ProjectBlueprintSchema.safeParse(parsed);
  if (!result.success) {
    const issue = result.error.issues[0];
    const location = issue?.path.length ? ` at ${issue.path.join(".")}` : "";
    throw new Error(`The imported blueprint does not match schema 1.0${location}.`);
  }

  if (result.data.metadata.schemaVersion !== CURRENT_BLUEPRINT_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported blueprint schema version ${result.data.metadata.schemaVersion}. Expected ${CURRENT_BLUEPRINT_SCHEMA_VERSION}.`,
    );
  }

  return result.data;
}

export function importBlueprintBytes(
  bytes: Uint8Array,
  filename: string,
): ProjectBlueprint {
  if (bytes.byteLength > MAX_BLUEPRINT_IMPORT_BYTES) {
    throw new Error("The imported file is too large. Keep exports under 5 MB.");
  }
  const normalizedFilename = filename.toLowerCase();
  const isZipFilename = normalizedFilename.endsWith(".zip");
  const isJsonFilename = normalizedFilename.endsWith(".json");
  const hasZipSignature = hasZipLocalFileSignature(bytes);
  const appearsJson = looksLikeJson(bytes);

  if (!isZipFilename && !isJsonFilename) {
    const detectedFormat = hasZipSignature ? "ZIP" : appearsJson ? "JSON" : "unknown";
    throw new Error(
      `Unsupported import filename. Rename the ${detectedFormat} export to .zip or .json before importing.`,
    );
  }
  if (isZipFilename && !hasZipSignature) {
    throw new Error(
      appearsJson
        ? "This .zip file contains JSON, not a ZIP export. Rename it to .json."
        : "This .zip file does not start with a valid ZIP local-file signature.",
    );
  }
  if (isJsonFilename && hasZipSignature) {
    throw new Error("This .json file contains a ZIP export. Rename it to .zip.");
  }

  const document = isZipFilename
    ? extractBlueprintDocumentFromZip(bytes)
    : new TextDecoder().decode(bytes);

  return parseImportedBlueprintDocument(document);
}
