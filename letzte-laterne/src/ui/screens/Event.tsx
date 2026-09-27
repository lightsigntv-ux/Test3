import { useState } from 'react';
import { EVENTS, SPEAKER_NAME } from '../../content/story';
import * as A from '../../game/actions';
import { lineVisible, Speaker } from '../Dialog';
import { play } from '../audio';
import { useGame } from '../store';
import { VoiceButton, useSequentialSpeech } from '../voice';
import { YuumiArt } from '../art';

export function EventScreen() {
  const { save, act } = useGame();
  const run = save.run!;
  const ev = EVENTS[run.event!.id];
  const [busy, setBusy] = useState(false);
  const isNew = !save.meta.seenDialogs.includes(`event:${ev.id}`);
  const memory = ev.story && run.memory;
  const intro = ev.intro.filter((l) => lineVisible(l, save));
  const speakingIdx = useSequentialSpeech(intro, `event:${ev.id}:${run.station}`);
  return (
    <div className="screen event-screen">
      <div className="row gap center-v">
        <span className="event-icon">{ev.icon}</span>
        <h2>{ev.title}</h2>
        {isNew && <span className="badge-new">NEU</span>}
        {memory && <span className="pill">Erinnerung</span>}
      </div>
      {ev.id === 'miauen' && (
        <div className="cat-scene">
          <YuumiArt size={90} />
          <span className="small muted">*miau?*</span>
        </div>
      )}
      <div className="event-lines">
        {intro
          .map((l, i) => (
            <div key={i} className={`event-line ${l.speaker === 'narrator' ? 'narrator' : ''} ${i === speakingIdx ? 'speaking-line' : ''}`}>
              {l.speaker !== 'narrator' && (
                <div className="event-portrait">
                  <Speaker line={l} size={48} />
                </div>
              )}
              <div>
                {l.speaker !== 'narrator' && <b>{SPEAKER_NAME[l.speaker]}: </b>}
                {l.text} <VoiceButton line={l} />
              </div>
            </div>
          ))}
      </div>
      <div className="event-choices">
        {ev.choices.map((c, i) => (
          <button
            key={i}
            data-sfx="none"
            className="choice-card"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              if (ev.id === 'miauen' && i === 0) play('meow');
              else play('confirm');
              act((s) => A.chooseEventOption(s, i));
            }}
          >
            <b>{c.label}</b>
            <div className="small">{c.preview}</div>
            {c.risk && <div className="small warn-text">{c.risk}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
