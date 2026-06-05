export class Base64Utils {

  static base64ToBuffer(base64: string): Buffer {

    const matches = base64.match(/^data:(.+);base64,(.+)$/);

    if (!matches) {
      throw new Error("Format base64 invalide");
    }

    return Buffer.from(matches[2], "base64");
  }

  static getFileExtension(base64: string): string {

    const matches = base64.match(/^data:(.+);base64,/);

    if (!matches) {
      return "bin";
    }

    const mimeType = matches[1];

    if (mimeType.includes("png")) return "png";
    if (mimeType.includes("jpeg")) return "jpg";
    if (mimeType.includes("jpg")) return "jpg";
    if (mimeType.includes("pdf")) return "pdf";

    return "bin";
  }

  static cleanBase64(base64: string): string {
    return base64.replace(/^data:.+;base64,/, "");
  }
}