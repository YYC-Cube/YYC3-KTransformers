export default function SimplePage() {
  return (
    <div style={{
      backgroundColor: '#FFF9E6',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          小语AI守护系统
        </h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          公益 · 陪伴 · 成长
        </p>
        <div style={{
          width: '200px',
          height: '200px',
          backgroundColor: '#fff',
          margin: '20px auto',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #ddd'
        }}>
          <span style={{ fontSize: '48px' }}>👧</span>
        </div>
        <p style={{ color: '#888' }}>
          小语Q版形象 (测试显示)
        </p>
      </div>
    </div>
  )
}