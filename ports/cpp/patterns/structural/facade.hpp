#pragma once
#include "../../support.hpp"
namespace algs {
struct VideoFile { std::string name; explicit VideoFile(std::string name): name(std::move(name)) {} std::string codec() const { auto pos = name.find_last_of('.'); return pos == std::string::npos ? name : name.substr(pos + 1); } };
struct CodecFactory { std::string extract(const VideoFile& file) const { return file.codec() + "-codec"; } };
struct BitrateReader { std::string read(const VideoFile& file, const std::string& codec) const { return "buffer(" + file.name + ", " + codec + ")"; } std::string convert(const std::string& buffer, const std::string& format) const { return buffer + " -> " + format; } };
struct AudioMixer { std::string fix(const std::string& result) const { return result + " + normalized audio"; } };
class VideoConverter { CodecFactory codecs; BitrateReader bitrate; AudioMixer audio; public: std::string convert(const std::string& fileName, const std::string& format) const { VideoFile file(fileName); return audio.fix(bitrate.convert(bitrate.read(file, codecs.extract(file)), format)); } };
}
