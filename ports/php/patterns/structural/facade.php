<?php
declare(strict_types=1);
namespace Ports\Patterns\Structural;

class VideoFile { public function __construct(public readonly string $name) {} public function __get(string $key): string { $parts = explode('.', $this->name); return end($parts); } }
class CodecFactory { public function extract(VideoFile $file): string { return $file->codec . '-codec'; } }
class BitrateReader { public function read(VideoFile $file, string $codec): string { return "buffer($file->name, $codec)"; } public function convert(string $buffer, string $format): string { return "$buffer -> $format"; } }
class AudioMixer { public function fix(string $result): string { return "$result + normalized audio"; } }
class VideoConverter {
    private CodecFactory $codecs; private BitrateReader $bitrate; private AudioMixer $audio;
    public function __construct() { $this->codecs = new CodecFactory(); $this->bitrate = new BitrateReader(); $this->audio = new AudioMixer(); }
    public function convert(string $filename, string $format): string { $file = new VideoFile($filename); return $this->audio->fix($this->bitrate->convert($this->bitrate->read($file, $this->codecs->extract($file)), $format)); }
}
