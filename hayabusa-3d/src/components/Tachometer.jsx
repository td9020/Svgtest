import useAnimationStore from '../store/animationStore'

// HUD-style RPM tachometer overlay for Suzuki Hayabusa GSX1300R
// Displays up to 12000 RPM, shows 1340cc Inline-4 info
// Uses Suzuki blue accents (#003DA5)

const SUZUKI_BLUE = '#003DA5'
const SUZUKI_BLUE_GLOW = '#4488cc'

export default function Tachometer() {
  const { engineRunning, engineRPM, wheelSpin, wheelSpeed } = useAnimationStore()

  const displayRPM = engineRunning ? Math.round(engineRPM * 2400) : 0  // Hayabusa idles higher
  const displaySpeed = wheelSpin ? Math.round(wheelSpeed * 60) : 0     // Hayabusa is faster
  const needleAngle = -120 + (displayRPM / 12000) * 240  // up to 12000 RPM

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
        border: `3px solid ${SUZUKI_BLUE}66`,
        position: 'relative',
        boxShadow: `0 0 20px rgba(0,61,165,0.3)`,
      }}>
        {/* RPM markings - 0 to 12 */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => {
          const a = (-120 + (n / 12) * 240) * Math.PI / 180
          const r = 55
          const x = 70 + Math.cos(a) * r
          const y = 70 + Math.sin(a) * r
          return (
            <span key={n} style={{
              position: 'absolute',
              left: x - 6,
              top: y - 6,
              fontSize: '8px',
              color: n >= 10 ? '#ff4444' : '#aaa',
              fontFamily: 'monospace',
              fontWeight: n >= 10 ? 'bold' : 'normal',
            }}>
              {n}
            </span>
          )
        })}

        {/* Tick marks */}
        {Array.from({ length: 49 }).map((_, i) => {
          const a = (-120 + (i / 48) * 240) * Math.PI / 180
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
              background: i >= 40 ? '#ff4444' : SUZUKI_BLUE_GLOW,
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
          border: `1px solid ${SUZUKI_BLUE}`,
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
          color: SUZUKI_BLUE_GLOW,
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
        border: `2px solid ${SUZUKI_BLUE}44`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 20px rgba(0,61,165,0.2)`,
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
          color: SUZUKI_BLUE_GLOW,
          fontSize: '32px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: `0 0 10px rgba(0,61,165,0.4)`,
        }}>
          {displaySpeed}
        </div>
        <div style={{
          marginTop: '8px',
          display: 'flex',
          gap: '4px',
        }}>
          {/* Gear indicator */}
          <div style={{
            padding: '2px 8px',
            borderRadius: '3px',
            background: '#222',
            border: `1px solid ${SUZUKI_BLUE}44`,
            color: engineRunning ? '#ff8800' : '#444',
            fontSize: '11px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            {!engineRunning ? 'N' : wheelSpin ? (wheelSpeed > 2.5 ? '6' : wheelSpeed > 2 ? '5' : wheelSpeed > 1.5 ? '4' : wheelSpeed > 1 ? '3' : wheelSpeed > 0.5 ? '2' : '1') : 'N'}
          </div>
        </div>
        {/* RPM bar */}
        <div style={{
          marginTop: '8px',
          width: '70px',
          height: '4px',
          borderRadius: '2px',
          background: '#333',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${(displayRPM / 12000) * 100}%`,
            height: '100%',
            background: displayRPM > 10000 ? '#ff4444' : displayRPM > 7000 ? '#ffaa00' : SUZUKI_BLUE_GLOW,
            transition: 'width 0.1s, background 0.3s',
          }} />
        </div>
        {/* Engine info */}
        <div style={{
          marginTop: '6px',
          color: '#555',
          fontSize: '7px',
          fontFamily: 'monospace',
          textAlign: 'center',
          letterSpacing: '0.5px',
        }}>
          1340cc Inline-4
        </div>
      </div>
    </div>
  )
}
