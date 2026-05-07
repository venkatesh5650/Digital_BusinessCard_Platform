export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '500px', width: '100%', backgroundColor: 'transparent' }}>
      <div className="loader"></div>
      <style>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left-color: var(--orange, #ff6b00);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
