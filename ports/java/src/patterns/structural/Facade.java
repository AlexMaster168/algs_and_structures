package patterns.structural;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Facade {
public static class VideoFile{public final String name;public VideoFile(String name){this.name=name;}public String codec(){int i=name.lastIndexOf('.');return i<0?name:name.substring(i+1);}}public static class CodecFactory{public String extract(VideoFile file){return file.codec()+"-codec";}}public static class BitrateReader{public String read(VideoFile file,String codec){return "buffer("+file.name+", "+codec+")";}public String convert(String buffer,String format){return buffer+" -> "+format;}}public static class AudioMixer{public String fix(String result){return result+" + normalized audio";}}public static class VideoConverter{private final CodecFactory codecs=new CodecFactory();private final BitrateReader bitrate=new BitrateReader();private final AudioMixer audio=new AudioMixer();public String convert(String name,String format){VideoFile f=new VideoFile(name);return audio.fix(bitrate.convert(bitrate.read(f,codecs.extract(f)),format));}}
}
