export class VideoFile {
    name;
    constructor(name) {
        this.name = name;
    }
    get codec() {
        return this.name.split('.').pop() ?? '';
    }
}
export class CodecFactory {
    extract(file) {
        return `${file.codec}-codec`;
    }
}
export class BitrateReader {
    read(file, codec) {
        return `buffer(${file.name}, ${codec})`;
    }
    convert(buffer, format) {
        return `${buffer} -> ${format}`;
    }
}
export class AudioMixer {
    fix(result) {
        return `${result} + normalized audio`;
    }
}
export class VideoConverter {
    codecs = new CodecFactory();
    bitrate = new BitrateReader();
    audio = new AudioMixer();
    convert(fileName, format) {
        const file = new VideoFile(fileName);
        const codec = this.codecs.extract(file);
        const buffer = this.bitrate.read(file, codec);
        const converted = this.bitrate.convert(buffer, format);
        return this.audio.fix(converted);
    }
}
