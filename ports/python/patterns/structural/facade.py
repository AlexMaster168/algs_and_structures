class VideoFile:
    def __init__(self, name):
        self.name = name

    @property
    def codec(self):
        return self.name.split('.')[-1]


class CodecFactory:
    def extract(self, file):
        return f'{file.codec}-codec'


class BitrateReader:
    def read(self, file, codec):
        return f'buffer({file.name}, {codec})'

    def convert(self, buffer, format):
        return f'{buffer} -> {format}'


class AudioMixer:
    def fix(self, result):
        return f'{result} + normalized audio'


class VideoConverter:
    def __init__(self):
        self.codecs, self.bitrate, self.audio = CodecFactory(), BitrateReader(), AudioMixer()

    def convert(self, file_name, format):
        file = VideoFile(file_name)
        return self.audio.fix(self.bitrate.convert(self.bitrate.read(file, self.codecs.extract(file)), format))
