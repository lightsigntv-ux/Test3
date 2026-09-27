import { useEffect, useState } from 'react';
import * as A from '../game/actions';
import { configureAudio, installUiSounds, setMusic } from './audio';
import { DialogOverlay } from './Dialog';
import { Hub } from './Hub';
import { RunView } from './RunView';
import { GameContext, useGameStore } from './store';
import { Title } from './Title';
import { Modal } from './components';

export default function App() {
  const store = useGameStore();
  const { save, act } = store;
  const [view, setView] = useState<'title' | 'game'>('title');

  useEffect(() => installUiSounds(), []);
  // Ruhige Musik überall außer im laufenden Kampf (den steuert der Kampfbildschirm selbst)
  const inCombat = save.run?.phase === 'combat' && view === 'game';
  useEffect(() => {
    if (!inCombat) setMusic('calm');
  }, [inCombat]);

  useEffect(() => {
    const st = save.settings;
    configureAudio({ sound: st.sound, volume: st.volume, musicVolume: st.musicVolume, sfxVolume: st.sfxVolume, voiceVolume: st.voiceVolume, voice: st.voice });
    document.body.classList.toggle('no-anim', !save.settings.animations);
  }, [save.settings]);

  const dialogId = save.dialogQueue[0];
  return (
    <GameContext.Provider value={store}>
      {view === 'title' ? <Title onEnter={() => setView('game')} /> : save.run ? <RunView /> : <Hub onTitle={() => setView('title')} />}
      {view === 'game' && dialogId && (
        <DialogOverlay
          key={dialogId}
          save={save}
          dialogId={dialogId}
          isNew={!save.meta.seenDialogs.includes(dialogId)}
          autoAdvance={save.settings.autoAdvance}
          onDone={() => act(A.dismissDialog)}
        />
      )}
      {save.notice && (
        <Modal title="Hinweis" onClose={() => act(A.clearNotice)}>
          <p>{save.notice}</p>
          <button className="btn primary" onClick={() => act(A.clearNotice)}>
            OK
          </button>
        </Modal>
      )}
    </GameContext.Provider>
  );
}
