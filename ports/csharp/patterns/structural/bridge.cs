namespace Patterns.Structural;

public interface IDevice
{
    string Name { get; }
    bool IsEnabled();
    void Enable();
    void Disable();
    double GetVolume();
    void SetVolume(double volume);
}
public abstract class BaseDevice : IDevice
{
    private bool enabled;
    private double volume = 30;
    public abstract string Name { get; }
    public bool IsEnabled() => enabled;
    public void Enable() => enabled = true;
    public void Disable() => enabled = false;
    public double GetVolume() => volume;
    public void SetVolume(double value) => volume = Math.Clamp(value, 0, 100);
}
public sealed class Tv : BaseDevice { public override string Name => "TV"; }
public sealed class Radio : BaseDevice { public override string Name => "Radio"; }
public class RemoteControl(IDevice device)
{
    protected readonly IDevice Device = device;
    public void TogglePower() { if (Device.IsEnabled()) Device.Disable(); else Device.Enable(); }
    public void VolumeUp(double step = 10) => Device.SetVolume(Device.GetVolume() + step);
    public void VolumeDown(double step = 10) => Device.SetVolume(Device.GetVolume() - step);
}
public sealed class AdvancedRemoteControl(IDevice device) : RemoteControl(device) { public void Mute() => Device.SetVolume(0); }
