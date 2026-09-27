import { useEffect, useState } from 'react';
import * as A from '../game/actions';
import { configureAudio } from './audio';
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

  useEffect(() => {
    configureAudio(save.settings.sound, save.settings.volume);
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
