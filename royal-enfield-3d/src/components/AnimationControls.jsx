import { useState } from 'react'
import useAnimationStore from '../store/animationStore'

const ACCENT = '#2D4A22'
const ACCENT_LIGHT = '#4a7a3a'

const btnStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  background: active ? `${ACCENT}66` : '#ffffff0a',
  color: active ? ACCENT_LIGHT : '#aaa',
  cursor: 'pointer',
  fontSize: '13px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'left',
  transition: 'all 0.2s',
  outline: active ? `1px solid ${ACCENT}88` : '1px solid transparent',
})

const sectionHeader = {
  color: '#888',
  fontSize: '11px',
  padding: '0 12px 4px',
  fontFamily: 'Arial',
  marginTop: '8px',
  borderTop: '1px solid #333',
  paddingTop: '8px',
}

const sliderContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 12px 8px',
}

const sliderStyle = {
  flex: 1,
  accentColor: ACCENT,
  height: '4px',
}

const labelStyle = {
  color: '#888',
  fontSize: '11px',
  fontFamily: 'monospace',
  minWidth: '32px',
  textAlign: 'right',
}

// Part specs for Royal Enfield Classic 350
const PART_SPECS = {
  frame: { name: 'Double Cradle Frame', specs: 'Steel tubular' },
  rearWheel: { name: 'Rear Wheel', specs: '120/80-18, Drum brake' },
  frontWheel: { name: 'Front Wheel', specs: '90/90-19, 300mm disc' },
  engine: { name: 'Engine', specs: '349cc single, 20.2 HP @ 6100 RPM' },
  fuelTank: { name: 'Fuel Tank', specs: '13L capacity, Teardrop shape' },
  seat: { name: 'Seat', specs: 'Dual seat, 805mm height' },
  exhaust: { name: 'Exhaust', specs: 'Upswept silencer, Chrome' },
  frontFork: { name: 'Front Fork', specs: '41mm telescopic, 130mm travel' },
  tail: { name: 'Tail Section', specs: 'Round tail light, Twin shocks' },
  chain: { name: 'Chain Drive', specs: 'O-ring chain, 16T/37T' },
}

export default function AnimationControls() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('anim')

  const {
    wheelSpin, engineRunning, suspensionBounce, steeringSweep,
    kickstandDown, explodedView, headlightOn, turnSignals,
    spokedWheels, nightMode, povCamera, showCables, chainAnimate,
    paintColor, selectedPart,
    wheelSpeed, engineRPM,
    toggle, setSpeed, setPaintColor,
  } = useAnimationStore()

  const animControls = [
    { key: 'wheelSpin', label: 'Wheel Spin', icon: '\u25CE', active: wheelSpin },
    { key: 'engineRunning', label: 'Engine Run', icon: '\u2699', active: engineRunning },
    { key: 'suspensionBounce', label: 'Suspension', icon: '\u2195', active: suspensionBounce },
    { key: 'steeringSweep', label: 'Steering', icon: '\u21C4', active: steeringSweep },
    { key: 'kickstandDown', label: 'Kickstand', icon: '\u2F02', active: kickstandDown, invert: true },
    { key: 'headlightOn', label: 'Headlight', icon: '\u2600', active: headlightOn },
    { key: 'turnSignals', label: 'Turn Signals', icon: '\u25C0\u25B6', active: turnSignals },
    { key: 'chainAnimate', label: 'Chain Drive', icon: '\u26D3', active: chainAnimate },
    { key: 'explodedView', label: 'Exploded View', icon: '\u2726', active: explodedView },
  ]

  const visualControls = [
    { key: 'spokedWheels', label: spokedWheels ? 'Wire Spokes' : 'Alloy Wheels', icon: '\u2742', active: spokedWheels, toggleLabel: true },
    { key: 'showCables', label: 'Cable Routing', icon: '\u223F', active: showCables },
    { key: 'nightMode', label: nightMode ? 'Night Mode' : 'Day Mode', icon: nightMode ? '\u263D' : '\u2600', active: nightMode, toggleLabel: true },
    { key: 'povCamera', label: 'Rider POV', icon: '\u2316', active: povCamera },
  ]

  const tabs = [
    { key: 'anim', label: 'ANIM' },
    { key: 'visual', label: 'VISUAL' },
  ]

  const partInfo = selectedPart && PART_SPECS[selectedPart]

  return (
    <div style={{
      position: 'absolute',
      top: 90,
      right: 16,
      zIndex: 20,
      width: collapsed ? 'auto' : '220px',
      background: '#0a0a1acc',
      backdropFilter: 'blur(12px)',
      borderRadius: '10px',
      border: '1px solid #333',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px 14px',
          border: 'none',
          borderBottom: collapsed ? 'none' : '1px solid #333',
          background: 'transparent',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}
      >
        <span>CONTROLS</span>
        <span style={{ color: '#666', fontSize: '11px' }}>{collapsed ? '\u25B6' : '\u25BC'}</span>
      </button>

      {!collapsed && (
        <div style={{ padding: '6px 6px 10px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '6px', padding: '0 6px' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                style={{
                  flex: 1,
                  padding: '5px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeSection === tab.key ? `${ACCENT}66` : '#ffffff08',
                  color: activeSection === tab.key ? ACCENT_LIGHT : '#777',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ANIMATION TAB */}
          {activeSection === 'anim' && (
            <>
              {animControls.map(({ key, label, icon, active, invert }) => (
                <div key={key} style={{ marginBottom: '3px' }}>
                  <button onClick={() => toggle(key)} style={btnStyle(invert ? !active : active)}>
                    <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{icon}</span>
                    <span>{label}</span>
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: (invert ? !active : active) ? `${ACCENT}44` : '#ffffff08',
                      color: (invert ? !active : active) ? ACCENT_LIGHT : '#666',
                    }}>
                      {(invert ? !active : active) ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              ))}

              {/* Speed sliders */}
              <div style={sectionHeader}>SPEED CONTROLS</div>
              <div style={sliderContainer}>
                <span style={{ ...labelStyle, minWidth: '48px' }}>Wheel</span>
                <input type="range" min="0.1" max="3" step="0.1"
                  value={wheelSpeed}
                  onChange={(e) => setSpeed('wheelSpeed', parseFloat(e.target.value))}
                  style={sliderStyle}
                />
                <span style={labelStyle}>{wheelSpeed.toFixed(1)}x</span>
              </div>
              <div style={sliderContainer}>
                <span style={{ ...labelStyle, minWidth: '48px' }}>Engine</span>
                <input type="range" min="0.5" max="5" step="0.25"
                  value={engineRPM}
                  onChange={(e) => setSpeed('engineRPM', parseFloat(e.target.value))}
                  style={sliderStyle}
                />
                <span style={labelStyle}>{engineRPM.toFixed(1)}x</span>
              </div>

              {/* Presets */}
              <div style={{ ...sectionHeader, display: 'flex', gap: '4px', paddingTop: '8px' }}>
                {[
                  { label: 'Riding', state: { wheelSpin: true, engineRunning: true, kickstandDown: false, headlightOn: true, turnSignals: false, suspensionBounce: true, chainAnimate: true } },
                  { label: 'Idle', state: { wheelSpin: false, engineRunning: true, kickstandDown: true, headlightOn: true, suspensionBounce: false, steeringSweep: false, turnSignals: false, explodedView: false } },
                  { label: 'Off', state: { wheelSpin: false, engineRunning: false, kickstandDown: true, headlightOn: false, suspensionBounce: false, steeringSweep: false, turnSignals: false, explodedView: false } },
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => useAnimationStore.setState(preset.state)}
                    style={{
                      flex: 1, padding: '6px', border: `1px solid ${ACCENT}88`, borderRadius: '5px',
                      background: '#ffffff08', color: '#ccc', cursor: 'pointer', fontSize: '11px', fontFamily: 'Arial',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* VISUAL TAB */}
          {activeSection === 'visual' && (
            <>
              {visualControls.map(({ key, label, icon, active, toggleLabel }) => (
                <div key={key} style={{ marginBottom: '3px' }}>
                  <button onClick={() => toggle(key)} style={btnStyle(active)}>
                    <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{icon}</span>
                    <span>{label}</span>
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: active ? `${ACCENT}44` : '#ffffff08',
                      color: active ? ACCENT_LIGHT : '#666',
                    }}>
                      {toggleLabel ? (active ? 'A' : 'B') : (active ? 'ON' : 'OFF')}
                    </span>
                  </button>
                </div>
              ))}

              {/* Paint color picker */}
              <div style={sectionHeader}>PAINT COLOR</div>
              <div style={{ padding: '4px 12px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  '#2D4A22', '#1a1a1a', '#8B0000', '#daa520', '#0a3d6b',
                  '#4a3728', '#cc0000', '#f5f5dc', '#555555', '#006400',
                ].map(color => (
                  <button
                    key={color}
                    onClick={() => setPaintColor(color)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: paintColor === color ? '2px solid #fff' : '2px solid #444',
                      background: color,
                      cursor: 'pointer',
                      transition: 'transform 0.1s',
                      transform: paintColor === color ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={paintColor}
                  onChange={(e) => setPaintColor(e.target.value)}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '2px solid #444',
                    borderRadius: '4px',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                  title="Custom color"
                />
              </div>
            </>
          )}

          {/* Selected part info */}
          {partInfo && (
            <div style={{
              margin: '6px 6px 0',
              padding: '8px 10px',
              background: '#00aaff15',
              border: '1px solid #00aaff44',
              borderRadius: '6px',
            }}>
              <div style={{ color: '#00ccff', fontSize: '12px', fontWeight: 'bold', fontFamily: 'Arial' }}>
                {partInfo.name}
              </div>
              <div style={{ color: '#888', fontSize: '10px', fontFamily: 'monospace', marginTop: '3px' }}>
                {partInfo.specs}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
