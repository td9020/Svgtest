import useAnimationStore from '../store/animationStore'

// HUD-style RPM tachometer overlay rendered as HTML
// Royal Enfield Classic 350 - green accent theme (#2D4A22)
export default function Tachometer() {
  const { engineRunning, engineRPM, wheelSpin, wheelSpeed } = useAnimationStore()

  const displayRPM = engineRunning ? Math.round(engineRPM * 2000) : 0
  const displaySpeed = wheelSpin ? Math.round(wheelSpeed * 40) : 0
  const needleAngle = -120 + (displayRPM / 10000) * 240 // -120 to +120 degrees

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      zIndex: 20,
      display: 'flex',
      gap: '12px',
      pointerEvents: 'none',
    }}>
      {/* Tachometer */}
      <div style={{
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #111 60%, #222 100%)',
        border: '3px solid #444',
        position: 'relative',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      }}>
        {/* RPM markings */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
          const a = (-120 + (n / 10) * 240) * Math.PI / 180
          const r = 55
          const x = 70 + Math.cos(a) * r
          const y = 70 + Math.sin(a) * r
          return (
            <span key={n} style={{
              position: 'absolute',
              left: x - 6,
              top: y - 6,
              fontSize: '9px',
              color: n >= 8 ? '#ff4444' : '#aaa',
              fontFamily: 'monospace',
              fontWeight: n >= 8 ? 'bold' : 'normal',
            }}>
              {n}
            </span>
          )
        })}

        {/* Tick marks */}
        {Array.from({ length: 41 }).map((_, i) => {
          const a = (-120 + (i / 40) * 240) * Math.PI / 180
          const isMajor = i % 4 === 0
          const r1 = isMajor ? 42 : 46
          const r2 = 50
          return (
            <div key={i} style={{
              position: 'absolute',
              left: 70 + Math.cos(a) * r1,
              top: 70 + Math.sin(a) * r1,
              width: '1px',
              height: `${r2 - r1}px`,
              background: i >= 32 ? '#ff4444' : '#888',
              transform: `rotate(${a + Math.PI / 2}rad)`,
              transformOrigin: 'top center',
            }} />
          )
        })}

        {/* Needle */}
        <div style={{
          position: 'absolute',
          left: '69px',
          top: '70px',
          width: '2px',
          height: '45px',
          background: '#ff3333',
          transformOrigin: 'bottom center',
          transform: `rotate(${needleAngle + 180}deg)`,
          transition: 'transform 0.1s ease-out',
          boxShadow: '0 0 6px #ff0000',
        }} />

        {/* Center cap */}
        <div style={{
          position: 'absolute',
          left: '64px',
          top: '64px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#333',
          border: '1px solid #555',
        }} />

        {/* RPM value */}
        <div style={{
          position: 'absolute',
          bottom: '25px',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#fff',
          fontSize: '14px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}>
          {displayRPM}
        </div>
        <div style={{
          position: 'absolute',
          bottom: '14px',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#888',
          fontSize: '8px',
          fontFamily: 'monospace',
          letterSpacing: '1px',
        }}>
          RPM x 1000
        </div>
      </div>

      {/* Speedometer (digital) */}
      <div style={{
        width: '100px',
        height: '140px',
        borderRadius: '10px',
        background: '#111',
        border: '2px solid #444',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          color: '#888',
          fontSize: '9px',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          marginBottom: '4px',
        }}>
          km/h
        </div>
        <div style={{
          color: '#4a7a3a',
          fontSize: '32px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(45,74,34,0.4)',
        }}>
          {displaySpeed}
        </div>
        <div style={{
          marginTop: '12px',
          display: 'flex',
          gap: '4px',
        }}>
          {/* Gear indicator */}
          <div style={{
            padding: '2px 8px',
            borderRadius: '3px',
            background: '#222',
            border: '1px solid #444',
            color: engineRunning ? '#ff8800' : '#444',
            fontSize: '11px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            {!engineRunning ? 'N' : wheelSpin ? (wheelSpeed > 2 ? '4' : wheelSpeed > 1.5 ? '3' : wheelSpeed > 0.8 ? '2' : '1') : 'N'}
          </div>
        </div>
        <div style={{
          marginTop: '8px',
          width: '70px',
          height: '4px',
          borderRadius: '2px',
          background: '#333',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${(displayRPM / 10000) * 100}%`,
            height: '100%',
            background: displayRPM > 8000 ? '#ff4444' : displayRPM > 5000 ? '#ffaa00' : '#4a7a3a',
            transition: 'width 0.1s, background 0.3s',
          }} />
        </div>
      </div>
    </div>
  )
}
