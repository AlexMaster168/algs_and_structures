namespace Patterns.Structural;

public sealed record VideoFile(string Name) { public string Codec => Name.Split('.').Last(); }
public sealed class CodecFactory { public string Extract(VideoFile file) => file.Codec + "-codec"; }
public sealed class BitrateReader
{
    public string Read(VideoFile file, string codec) => $"buffer({file.Name}, {codec})";
    public string Convert(string buffer, string format) => $"{buffer} -> {format}";
}
public sealed class AudioMixer { public string Fix(string result) => result + " + normalized audio"; }
public sealed class VideoConverter
{
    private readonly CodecFactory codecs = new();
    private readonly BitrateReader bitrate = new();
    private readonly AudioMixer audio = new();
    public string Convert(string filename, string format)
    {
        var file = new VideoFile(filename);
        return audio.Fix(bitrate.Convert(bitrate.Read(file, codecs.Extract(file)), format));
    }
}
