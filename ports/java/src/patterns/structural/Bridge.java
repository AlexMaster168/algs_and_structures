package patterns.structural;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Bridge {
public interface Device{String name();boolean isEnabled();void enable();void disable();double getVolume();void setVolume(double volume);}private abstract static class BaseDevice implements Device{private boolean enabled;private double volume=30;public boolean isEnabled(){return enabled;}public void enable(){enabled=true;}public void disable(){enabled=false;}public double getVolume(){return volume;}public void setVolume(double v){volume=Math.max(0,Math.min(100,v));}}public static class Tv extends BaseDevice{public String name(){return "TV";}}public static class Radio extends BaseDevice{public String name(){return "Radio";}}public static class RemoteControl{protected final Device device;public RemoteControl(Device d){device=d;}public void togglePower(){if(device.isEnabled())device.disable();else device.enable();}public void volumeUp(){volumeUp(10);}public void volumeUp(double s){device.setVolume(device.getVolume()+s);}public void volumeDown(){volumeDown(10);}public void volumeDown(double s){device.setVolume(device.getVolume()-s);}}public static class AdvancedRemoteControl extends RemoteControl{public AdvancedRemoteControl(Device d){super(d);}public void mute(){device.setVolume(0);}}
}
