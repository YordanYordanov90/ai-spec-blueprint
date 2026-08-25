import { crc32 } from "../export/zip";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";

const LOCAL_FILE_HEADER = 0x04034b50;
const CENTRAL_DIRECTORY_HEADER = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const STORE_METHOD = 0;
const BLUEPRINT_PATH = "blueprint.json";
const SUPPORTED_BLUEPRINT_SCHEMA_VERSION = "1.0";

function readUint16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

export function extractBlueprintDocumentFromZip(bytes: Uint8Array): string {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder();
  let offset = 0;

  while (offset + 4 <= bytes.byteLength) {
    const signature = readUint32(view, offset);
    if (
      signature === CENTRAL_DIRECTORY_HEADER ||
      signature === END_OF_CENTRAL_DIRECTORY
    ) {
      break;
    }

    if (signature !== LOCAL_FILE_HEADER || offset + 30 > bytes.byteLength) {
      throw new Error("The ZIP is not a supported AI Spec Blueprint export.");
    }

    const flags = readUint16(view, offset + 6);
    const method = readUint16(view, offset + 8);
    const checksum = readUint32(view, offset + 14);
    const compressedSize = readUint32(view, offset + 18);
    const uncompressedSize = readUint32(view, offset + 22);
    const nameLength = readUint16(view, offset + 26);
    const extraLength = readUint16(view, offset + 28);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const dataEnd = dataStart + compressedSize;

    if (
      flags !== 0 ||
      method !== STORE_METHOD ||
      compressedSize !== uncompressedSize ||
      dataEnd > bytes.byteLength
    ) {
      throw new Error("The ZIP uses an unsupported compression or header format.");
    }

    const name = decoder.decode(bytes.subarray(nameStart, nameStart + nameLength));
    const data = bytes.subarray(dataStart, dataEnd);

    if (name === BLUEPRINT_PATH) {
      if (crc32(data) !== checksum) {
        throw new Error("blueprint.json failed its ZIP integrity check.");
      }
      return decoder.decode(data);
    }

    offset = dataEnd;
  }

  throw new Error("The ZIP does not contain blueprint.json.");
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

  if (result.data.metadata.schemaVersion !== SUPPORTED_BLUEPRINT_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported blueprint schema version ${result.data.metadata.schemaVersion}. Expected ${SUPPORTED_BLUEPRINT_SCHEMA_VERSION}.`,
    );
  }

  return result.data;
}

export function importBlueprintBytes(
  bytes: Uint8Array,
  filename: string,
): ProjectBlueprint {
  const normalizedFilename = filename.toLowerCase();

  if (!normalizedFilename.endsWith(".zip") && !normalizedFilename.endsWith(".json")) {
    throw new Error("Import a blueprint.json file or an AI Spec Blueprint ZIP export.");
  }

  const document = normalizedFilename.endsWith(".zip")
    ? extractBlueprintDocumentFromZip(bytes)
    : new TextDecoder().decode(bytes);

  return parseImportedBlueprintDocument(document);
}
