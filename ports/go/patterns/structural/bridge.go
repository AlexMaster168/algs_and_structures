package structural

type Device interface {
	Name() string
	IsEnabled() bool
	Enable()
	Disable()
	GetVolume() float64
	SetVolume(float64)
}
type BaseDevice struct {
	enabled     bool
	volume      float64
	initialized bool
}

func (d *BaseDevice) IsEnabled() bool { return d.enabled }
func (d *BaseDevice) Enable()         { d.enabled = true }
func (d *BaseDevice) Disable()        { d.enabled = false }
func (d *BaseDevice) GetVolume() float64 {
	if !d.initialized {
		return 30
	}
	return d.volume
}
func (d *BaseDevice) SetVolume(value float64) {
	d.volume = max(0, min(100, value))
	d.initialized = true
}

type Tv struct{ BaseDevice }

func (*Tv) Name() string { return "TV" }

type Radio struct{ BaseDevice }

func (*Radio) Name() string { return "Radio" }

type RemoteControl struct{ Device Device }

func (r RemoteControl) TogglePower() {
	if r.Device.IsEnabled() {
		r.Device.Disable()
	} else {
		r.Device.Enable()
	}
}
func (r RemoteControl) VolumeUp(steps ...float64) {
	step := 10.0
	if len(steps) > 0 {
		step = steps[0]
	}
	r.Device.SetVolume(r.Device.GetVolume() + step)
}
func (r RemoteControl) VolumeDown(steps ...float64) {
	step := 10.0
	if len(steps) > 0 {
		step = steps[0]
	}
	r.Device.SetVolume(r.Device.GetVolume() - step)
}

type AdvancedRemoteControl struct{ RemoteControl }

func (r AdvancedRemoteControl) Mute() { r.Device.SetVolume(0) }
