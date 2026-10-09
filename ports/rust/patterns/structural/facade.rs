pub struct VideoFile {
    pub name: String,
}
impl VideoFile {
    pub fn new(name: String) -> Self {
        Self { name }
    }
    pub fn codec(&self) -> &str {
        self.name.rsplit('.').next().unwrap_or("")
    }
}
pub struct CodecFactory;
impl CodecFactory {
    pub fn extract(&self, file: &VideoFile) -> String {
        format!("{}-codec", file.codec())
    }
}
pub struct BitrateReader;
impl BitrateReader {
    pub fn read(&self, file: &VideoFile, codec: &str) -> String {
        format!("buffer({}, {codec})", file.name)
    }
    pub fn convert(&self, buffer: &str, format: &str) -> String {
        format!("{buffer} -> {format}")
    }
}
pub struct AudioMixer;
impl AudioMixer {
    pub fn fix(&self, result: &str) -> String {
        format!("{result} + normalized audio")
    }
}
pub struct VideoConverter;
impl VideoConverter {
    pub fn convert(&self, file_name: &str, format: &str) -> String {
        let file = VideoFile::new(file_name.into());
        AudioMixer.fix(&BitrateReader.convert(
            &BitrateReader.read(&file, &CodecFactory.extract(&file)),
            format,
        ))
    }
}
