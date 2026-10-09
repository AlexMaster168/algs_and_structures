package structural

import (
	"fmt"
	"strings"
)

type VideoFile struct{ Name string }

func (f VideoFile) Codec() string { parts := strings.Split(f.Name, "."); return parts[len(parts)-1] }

type CodecFactory struct{}

func (CodecFactory) Extract(file VideoFile) string { return file.Codec() + "-codec" }

type BitrateReader struct{}

func (BitrateReader) Read(file VideoFile, codec string) string {
	return fmt.Sprintf("buffer(%s, %s)", file.Name, codec)
}
func (BitrateReader) Convert(buffer, format string) string { return buffer + " -> " + format }

type AudioMixer struct{}

func (AudioMixer) Fix(result string) string { return result + " + normalized audio" }

type VideoConverter struct {
	codecs  CodecFactory
	bitrate BitrateReader
	audio   AudioMixer
}

func (v VideoConverter) Convert(filename, format string) string {
	file := VideoFile{filename}
	return v.audio.Fix(v.bitrate.Convert(v.bitrate.Read(file, v.codecs.Extract(file)), format))
}
