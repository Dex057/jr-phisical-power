# Academia Jr Phisical Power — Site

Site estático (HTML/CSS/JS + GSAP) com identidade neon verde baseada na logo e no espaço real da academia.

## Como abrir
Basta abrir `index.html` no navegador (duplo clique) ou rodar um servidor local:
```
cd JrAcademia
python3 -m http.server 8000
```
e acessar `http://localhost:8000`.

## Estrutura
```
index.html
css/style.css
js/main.js
assets/img/espaco-interno.webp -> foto real do espaço
assets/video/hero-loop.mp4    -> vídeo de fundo do topo (atleta + neon verde)
assets/video/planos-bg.mp4    -> vídeo de fundo abstrato na seção de Planos
```

## Vídeos gerados no Google Flow

Os dois vídeos que você gerou já estão integrados:
- **`hero-loop.mp4`** (ex-`prompt2.mp4`): atleta levantando peso com contorno neon
  verde — fundo em loop da seção principal (hero).
- **`planos-bg.mp4`** (ex-`prompt3.mp4`): textura abstrata de energia verde —
  fundo sutil (opacidade baixa, atrás do texto) na seção de Planos/CTA.

Se algum dia quiser trocar por um novo vídeo, é só substituir o arquivo mantendo
o mesmo nome — não precisa mexer em código. Caso o arquivo seja removido, o hero
volta automaticamente para a foto estática (fallback já programado em `main.js`).

Quer gerar mais vídeos para outras seções (ex.: Estrutura ou Convênios)? Alguns
prompts que funcionam bem com esse estilo:

```
Cinematic slow dolly-in shot inside a modern dark gym at night. Black rubber
flooring, matte black weight machines and dumbbell racks, moody low-key
lighting. Thin strips of bright neon green light glow along the ceiling edges
and equipment frames, casting soft green reflections on the floor and metal
surfaces. Fine dust particles float visibly in the green light beams. Camera
moves slowly forward at eye level through the empty gym aisle. Photorealistic,
shallow depth of field, subtle lens flare, 24fps cinematic motion, no text,
no logos, no people.
```

Especificações que funcionam bem: 16:9, 6–10s, sem necessidade de áudio (o
`<video>` já está `muted`), evite texto/logo dentro do próprio vídeo.

## Links já configurados
- Telefone / WhatsApp: `(91) 98546-5062` → botões no header, hero, CTA de planos e botão flutuante
- Instagram: `_academiajrphisicalpower_`
- Facebook: `jrphisicalpower`
- Avaliação Google: link `share.google` no rodapé/contato
- Mapa: embed automático a partir do endereço (Rua Betânia, 275, Bengui, Belém-PA)

## Personalização rápida
- Cores neon: variáveis `--neon`, `--neon-soft`, `--neon-dark` no topo de `css/style.css`
- Textos: direto no `index.html`, cada seção tem `id` (`#hero`, `#diferenciais`, `#estrutura`, `#convenios`, `#horarios`, `#planos`, `#contato`)
- Planos com preços: seção `#planos` no `index.html` (busque por `PLANOS E VALORES`).
  Cada card fica em `.plan-card` e a lista de extras (casal, família, 15 dias,
  avaliação física) em `.plans-extra-row` — edite os valores direto no HTML.
- Cache do navegador: `css/style.css` e `js/main.js` são carregados com
  `?v=N` no `index.html`. Sempre que editar esses arquivos, aumente o número
  da versão (ex.: `?v=4`) para garantir que quem já visitou o site veja a
  atualização em vez de uma versão em cache.
- A logo (`assets/img/logo.jpeg`) não aparece mais no header/rodapé (ficava
  ilegível reduzida a um ícone pequeno) — hoje é usada só como favicon da aba
  do navegador. O cabeçalho usa apenas o nome estilizado "JR PHISICAL POWER".
