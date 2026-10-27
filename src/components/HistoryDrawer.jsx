import React from 'react';

export function HistoryDrawer({ isOpen, onClose, history = [], onRestore, onClear }) {
  if (!isOpen) return null;

  return (
    <div className="history-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Drafts Archive">
      <div className="history-docket" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <div>
            <h3 className="history-title">Stationery Archives</h3>
            <p className="history-subtitle">Previously drafted letters stored locally on your desk</p>
          </div>
          <button
            type="button"
            className="btn-close-history"
            onClick={onClose}
            aria-label="Close archives"
            id="close-history-btn"
          >
            ✕
          </button>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">
              <span className="history-empty__icon" aria-hidden="true">🗄️</span>
              <p>No archived letters yet.</p>
              <span>Letters you pen will automatically be cataloged here.</span>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-card__meta">
                  <span className="history-card__company">{item.company || 'Unknown Company'}</span>
                  <span className="history-card__date">
                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="history-card__role">
                  {item.role || 'Role'} · <em>{item.tone || 'confident'} tone</em>
                </div>

                <p className="history-card__snippet">
                  {item.letterText ? item.letterText.slice(0, 140) + '...' : ''}
                </p>

                <div className="history-card__actions">
                  <button
                    type="button"
                    className="btn-desk-tool"
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                  >
                    <span>Restore Draft ↩</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="history-footer">
            <button
              type="button"
              className="btn-desk-tool"
              onClick={onClear}
              id="clear-history-btn"
            >
              <span>Clear Archive</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
