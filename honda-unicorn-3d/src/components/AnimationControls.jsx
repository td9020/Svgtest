import { useState } from 'react'
import useAnimationStore from '../store/animationStore'

const btnStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  background: active ? '#cc000044' : '#ffffff0a',
  color: active ? '#ff6666' : '#aaa',
  cursor: 'pointer',
  fontSize: '13px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'left',
  transition: 'all 0.2s',
  outline: active ? '1px solid #cc000066' : '1px solid transparent',
})

const sliderContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 12px 8px',
}

const sliderStyle = {
  flex: 1,
  accentColor: '#cc0000',
  height: '4px',
}

const labelStyle = {
  color: '#888',
  fontSize: '11px',
  fontFamily: 'monospace',
  minWidth: '32px',
  textAlign: 'right',
}

export default function AnimationControls() {
  const [collapsed, setCollapsed] = useState(false)

  const {
    wheelSpin, engineRunning, suspensionBounce, steeringSweep,
    kickstandDown, explodedView, headlightOn, turnSignals,
    wheelSpeed, engineRPM,
    toggle, setSpeed,
  } = useAnimationStore()

  const controls = [
    { key: 'wheelSpin', label: 'Wheel Spin', icon: '\u25CE', active: wheelSpin },
    { key: 'engineRunning', label: 'Engine Run', icon: '\u2699', active: engineRunning },
    { key: 'suspensionBounce', label: 'Suspension', icon: '\u2195', active: suspensionBounce },
    { key: 'steeringSweep', label: 'Steering', icon: '\u21C4', active: steeringSweep },
    { key: 'kickstandDown', label: 'Kickstand', icon: '\u2F02', active: kickstandDown, invert: true },
    { key: 'explodedView', label: 'Exploded View', icon: '\u2726', active: explodedView },
    { key: 'headlightOn', label: 'Headlight', icon: '\u2600', active: headlightOn },
    { key: 'turnSignals', label: 'Turn Signals', icon: '\u25C0\u25B6', active: turnSignals },
  ]

  return (
    <div style={{
      position: 'absolute',
      top: 90,
      right: 16,
      zIndex: 20,
      width: collapsed ? 'auto' : '210px',
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
        <span>ANIMATIONS</span>
        <span style={{ color: '#666', fontSize: '11px' }}>{collapsed ? '\u25B6' : '\u25BC'}</span>
      </button>

      {!collapsed && (
        <div style={{ padding: '6px 6px 10px' }}>
          {/* Toggle buttons */}
          {controls.map(({ key, label, icon, active, invert }) => (
            <div key={key} style={{ marginBottom: '3px' }}>
              <button
                onClick={() => toggle(key)}
                style={btnStyle(invert ? !active : active)}
              >
                <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{icon}</span>
                <span>{label}</span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '9px',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  background: (invert ? !active : active) ? '#cc000033' : '#ffffff08',
                  color: (invert ? !active : active) ? '#ff8888' : '#666',
                }}>
                  {(invert ? !active : active) ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          ))}

          {/* Speed sliders */}
          <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
            <div style={{ color: '#888', fontSize: '11px', padding: '0 12px 4px', fontFamily: 'Arial' }}>
              SPEED CONTROLS
            </div>

            <div style={sliderContainer}>
              <span style={{ ...labelStyle, minWidth: '48px' }}>Wheel</span>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={wheelSpeed}
                onChange={(e) => setSpeed('wheelSpeed', parseFloat(e.target.value))}
                style={sliderStyle}
              />
              <span style={labelStyle}>{wheelSpeed.toFixed(1)}x</span>
            </div>

            <div style={sliderContainer}>
              <span style={{ ...labelStyle, minWidth: '48px' }}>Engine</span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.25"
                value={engineRPM}
                onChange={(e) => setSpeed('engineRPM', parseFloat(e.target.value))}
                style={sliderStyle}
              />
              <span style={labelStyle}>{engineRPM.toFixed(1)}x</span>
            </div>
          </div>

          {/* Preset buttons */}
          <div style={{ marginTop: '6px', borderTop: '1px solid #333', paddingTop: '8px', display: 'flex', gap: '4px', padding: '8px 6px 2px' }}>
            <button
              onClick={() => {
                useAnimationStore.setState({
                  wheelSpin: true,
                  engineRunning: true,
                  kickstandDown: false,
                  headlightOn: true,
                  turnSignals: false,
                  suspensionBounce: true,
                })
              }}
              style={{
                flex: 1,
                padding: '6px',
                border: '1px solid #555',
                borderRadius: '5px',
                background: '#ffffff08',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'Arial',
              }}
            >
              Riding
            </button>
            <button
              onClick={() => {
                useAnimationStore.setState({
                  wheelSpin: false,
                  engineRunning: true,
                  kickstandDown: true,
                  headlightOn: true,
                  suspensionBounce: false,
                  steeringSweep: false,
                  turnSignals: false,
                  explodedView: false,
                })
              }}
              style={{
                flex: 1,
                padding: '6px',
                border: '1px solid #555',
                borderRadius: '5px',
                background: '#ffffff08',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'Arial',
              }}
            >
              Idle
            </button>
            <button
              onClick={() => {
                useAnimationStore.setState({
                  wheelSpin: false,
                  engineRunning: false,
                  kickstandDown: true,
                  headlightOn: false,
                  suspensionBounce: false,
                  steeringSweep: false,
                  turnSignals: false,
                  explodedView: false,
                })
              }}
              style={{
                flex: 1,
                padding: '6px',
                border: '1px solid #555',
                borderRadius: '5px',
                background: '#ffffff08',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'Arial',
              }}
            >
              Off
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
