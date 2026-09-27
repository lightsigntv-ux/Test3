import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ITEMS, RARITY_LABEL, RARITY_SYMBOL, RELICS, TAG_LABEL, TAG_SYMBOL, itemText, type EquipItem } from '../content/items';
import { LootArt } from './lootArt';
import type { BuildTag, Rarity, RelicId } from '../content/types';

export function Tip({ children, tip, wide }: { children: ReactNode; tip: ReactNode; wide?: boolean }) {
  return (
    <span className="tip-host" tabIndex={0}>
      {children}
      <span className={`tip ${wide ? 'wide' : ''}`} role="tooltip">
        {tip}
      </span>
    </span>
  );
}

export function Tags({ tags }: { tags: BuildTag[] }) {
  return (
    <span className="tags">
      {tags.map((t) => (
        <span key={t} className={`tag tag-${t}`} title={TAG_LABEL[t]}>
          {TAG_SYMBOL[t]} {TAG_LABEL[t]}
        </span>
      ))}
    </span>
  );
}

export function Rar({ r }: { r: Rarity }) {
  return (
    <span className={`rar q-${r}`}>
      {RARITY_SYMBOL[r]} {RARITY_LABEL[r]}
    </span>
  );
}

export function Bar({ value, max, shield = 0, color = '#5fbf6a', height = 10, label }: { value: number; max: number; shield?: number; color?: string; height?: number; label?: boolean }) {
  const total = Math.max(max, value + shield);
  const pv = Math.max(0, Math.min(100, (value / total) * 100));
  const ps = Math.max(0, Math.min(100 - pv, (shield / total) * 100));
  return (
    <div className="bar" style={{ height }}>
      <div className="bar-fill" style={{ width: `${pv}%`, background: color }} />
      {shield > 0 && <div className="bar-shield" style={{ left: `${pv}%`, width: `${ps}%` }} />}
      {label && (
        <span className="bar-label">
          {Math.max(0, Math.round(value))}/{Math.round(max)}
          {shield > 0 ? ` +${Math.round(shield)}🛡` : ''}
        </span>
      )}
    </div>
  );
}

/** Kompakter Gegenstand mit Bild; Details im Tooltip. */
export function ItemLine({ item, compact }: { item: EquipItem; compact?: boolean }) {
  const it = ITEMS[item.id];
  return (
    <Tip
      wide
      tip={
        <>
          <b className={`qt-${item.q}`}>{it.name}</b> <Rar r={item.q} />
          <div>{itemText(item)}</div>
          <div className="muted small">{it.synergy}</div>
        </>
      }
    >
      <span className={`item-chip q-border-${item.q}`}>
        <LootArt kind="item" id={item.id} size={compact ? 20 : 26} />
        <span className={`qt-${item.q}`}>{it.name}</span>
      </span>
    </Tip>
  );
}

export function RelicLine({ id }: { id: RelicId }) {
  const it = RELICS[id];
  return (
    <Tip
      wide
      tip={
        <>
          <b className={`qt-${it.rarity}`}>{it.name}</b> <Rar r={it.rarity} />
          <div>{it.description}</div>
          {it.flavor && <div className="flavor">{it.flavor}</div>}
        </>
      }
    >
      <span className={`item-chip relic-chip q-border-${it.rarity}`}>
        <LootArt kind="relic" id={id} size={26} />
        <span className={`qt-${it.rarity}`}>{it.name}</span>
      </span>
    </Tip>
  );
}

export function Modal({ title, children, onClose, wide }: { title: string; children: ReactNode; onClose?: () => void; wide?: boolean }) {
  const node = (
    <div className="modal-back" onClick={onClose}>
      <div className={`modal ${wide ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          {onClose && (
            <button className="btn ghost" onClick={onClose} aria-label="Schließen">
              ✕
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
  // Portal: Modals dürfen nicht von transformierten/gefilterten Eltern eingeengt werden
  return typeof document !== 'undefined' ? createPortal(node, document.body) : node;
}

export function ConfirmButton({ label, confirmText, onConfirm, className = 'btn', disabled }: { label: string; confirmText: string; onConfirm: () => void; className?: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)} disabled={disabled}>
        {label}
      </button>
      {open && (
        <Modal title="Bist du sicher?" onClose={() => setOpen(false)}>
          <p>{confirmText}</p>
          <div className="row gap">
            <button
              className="btn danger"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              Ja
            </button>
            <button className="btn" onClick={() => setOpen(false)}>
              Abbrechen
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export function Hint({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="hint" role="status">
      <div>{children}</div>
      <button className="btn small" onClick={onClose}>
        Verstanden
      </button>
    </div>
  );
}
