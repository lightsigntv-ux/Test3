"""Vertont alle Sprechzeilen mit kostenlosen Microsoft-Edge-Neuralstimmen (edge-tts).

Aufruf:  npx tsx scripts/dump-lines.ts > /tmp/lines.json && python3 scripts/tts.py /tmp/lines.json
Vorhandene Dateien werden übersprungen; das Manifest wird neu geschrieben.
"""
import asyncio, json, os, ssl, sys
import edge_tts.communicate as C
import edge_tts.voices as V

# Hinter einem TLS-Proxy: dessen CA verwenden, falls vorhanden
CA = '/root/.ccr/ca-bundle.crt'
if os.path.exists(CA):
    ctx = ssl.create_default_context(cafile=CA)
    C._SSL_CTX = ctx
    if hasattr(V, '_SSL_CTX'):
        V._SSL_CTX = ctx
import edge_tts

# Besetzung: Stimme, Tempo, Tonhöhe
CAST = {
    'fritz': ('de-DE-KillianNeural', '-6%', '-8Hz'),        # ruhig, direkt, tief
    'ivo': ('de-DE-FlorianMultilingualNeural', '+8%', '+3Hz'),  # schnell, redselig
    'sera': ('de-DE-SeraphinaMultilingualNeural', '-4%', '+2Hz'),  # warm, freundlich
    'narrator': ('de-DE-ConradNeural', '-10%', '-4Hz'),     # Erzähler
    'yuumi': ('de-DE-KatjaNeural', '-8%', '+0Hz'),          # erzählte Katzenmomente, sanft
    'mira': ('de-AT-IngridNeural', '+2%', '+2Hz'),
    'waechter': ('de-CH-JanNeural', '-18%', '-22Hz'),
    'archivarin': ('de-DE-AmalaNeural', '-12%', '-10Hz'),
    'hueter': ('de-AT-JonasNeural', '-15%', '-18Hz'),
}
MOOD = {'sad': (-6, -3), 'happy': (3, 3), 'smile': (0, 2), 'serious': (-3, -2)}

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'voice')
MANIFEST = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'voice-manifest.json')

def adj(base, delta, unit):
    v = int(base.replace(unit, '').replace('+', '')) + delta
    return f'{v:+d}{unit}'

async def render(line, sem):
    path = os.path.join(OUT, line['key'] + '.mp3')
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        return True
    voice, rate, pitch = CAST[line['speaker']]
    dr, dp = MOOD.get(line.get('mood') or '', (0, 0))
    rate, pitch = adj(rate, dr, '%'), adj(pitch, dp, 'Hz')
    async with sem:
        for attempt in range(5):
            try:
                c = edge_tts.Communicate(line['text'], voice, rate=rate, pitch=pitch, proxy=os.environ.get('HTTPS_PROXY'))
                await c.save(path + '.part')
                if os.path.getsize(path + '.part') < 1000:
                    raise RuntimeError('leere Ausgabe')
                os.replace(path + '.part', path)
                return True
            except Exception as e:  # Netzwerk-/Dienstfehler: mit Pause erneut versuchen
                print('  Fehler', line['key'], e, file=sys.stderr)
                await asyncio.sleep(2 ** attempt)
    return False

async def main():
    lines = json.load(open(sys.argv[1]))
    os.makedirs(OUT, exist_ok=True)
    sem = asyncio.Semaphore(4)
    ok = await asyncio.gather(*(render(l, sem) for l in lines))
    keys = sorted(l['key'] for l, good in zip(lines, ok) if good)
    json.dump({'keys': keys}, open(MANIFEST, 'w'), indent=0)
    print(f'{sum(ok)}/{len(lines)} Zeilen vertont')

asyncio.run(main())
