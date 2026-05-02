export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
    }}>
      <div style={{
        background: 'white', borderRadius: '14px', padding: '2rem',
        width: '100%', maxWidth: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        margin: '0 1rem', textAlign: 'center'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 600, color: '#1a1a1a' }}>
          Confirmation
        </h3>
        <p style={{ margin: '0 0 1.5rem', fontSize: '14px', color: '#666', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={onCancel}
            style={{ padding: '10px 24px', background: 'white', color: '#666', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={onConfirm}
            style={{ padding: '10px 24px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}