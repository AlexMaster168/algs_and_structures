export class VideoFile {
  constructor(readonly name: string) {}

  get codec(): string {
    return this.name.split('.').pop() ?? '';
  }
}

export class CodecFactory {
  extract(file: VideoFile): string {
    return `${file.codec}-codec`;
  }
}

export class BitrateReader {
  read(file: VideoFile, codec: string): string {
    return `buffer(${file.name}, ${codec})`;
  }

  convert(buffer: string, format: string): string {
    return `${buffer} -> ${format}`;
  }
}

export class AudioMixer {
  fix(result: string): string {
    return `${result} + normalized audio`;
  }
}

export class VideoConverter {
  private readonly codecs = new CodecFactory();
  private readonly bitrate = new BitrateReader();
  private readonly audio = new AudioMixer();

  convert(fileName: string, format: 'mp4' | 'ogg'): string {
    const file = new VideoFile(fileName);
    const codec = this.codecs.extract(file);
    const buffer = this.bitrate.read(file, codec);
    const converted = this.bitrate.convert(buffer, format);
    return this.audio.fix(converted);
  }
}
