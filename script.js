const layers = [
  { text: "@n @n", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@col @col", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@place @place", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@use @use", cols: 80, fontSize: 1.7, height: 2.1 },
  {
    text: "import css-doodle",
    cols: 43,
    fontSize: 3,
    textShadow: "0 0 .1vmin currentColor, 0 0 1vmin currentColor",
    height: 3.2,
  },
  { text: "@row @row", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@size @size", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@rand @rand", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@repeat @repeat", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "seed seed", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: ":container :container", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@stripe @stripe", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@svg @svg", cols: 80, fontSize: 1.7, height: 2.1 },
  {
    text: "<css-doodle> </css-doodle>",
    cols: 43,
    fontSize: 3,
    textShadow: "0 0 .1vmin currentColor, 0 0 .3vmin currentColor",
    height: 3.2,
  },
  { text: ":doodle :doodle", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@calc @calc", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@var @var", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "update update", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "export export", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@match @match", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "grid grid", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@hex @hex", cols: 80, fontSize: 1.7, height: 2.1 },
  {
    text: "npm install css-doodle",
    cols: 43,
    fontSize: 3,
    textShadow: "0 0 .1vmin currentColor, 0 0 1vmin currentColor",
    height: 3.2,
  },
  { text: "@index @index", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@shaders @shaders", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@<Math> @<Math>", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "use use", cols: 80, fontSize: 1.7, height: 2.1 },
  { text: "@plot @plot", cols: 80, fontSize: 1.7, height: 2.1 },
]

const COLORS = ["--color-1", "--color-2"]

function getGridParams(text, cols) {
  const words = text.split(" ")
  const cycle = words.reduce((sum, w) => sum + w.length + 1, 0)
  const cellWidth = 70 / cols
  const cycleWidth = cycle * cellWidth
  const minWidth = 55 + cycleWidth
  const gridWidth = Math.max(70, Math.ceil(minWidth))
  const adjustedCols = Math.round(gridWidth / cellWidth)
  return { gridWidth, adjustedCols, cycleWidth: cycleWidth.toFixed(1) }
}

function generateColRules(words) {
  const cycle = words.reduce((sum, w) => sum + w.length + 1, 0)
  const rules = []
  let pos = 0
  words.forEach((word, wi) => {
    const color = COLORS[wi % 2]
    for (const ch of word) {
      const sel = pos === 0 ? `${cycle}n` : `${cycle}n+${pos}`
      rules.push(
        `@col(${sel}) {\n` +
          `            ::before { content: '${ch}'; color: @var(${color}); }\n` +
          `          }`,
      )
      pos++
    }
    pos++
  })
  return rules.join("\n          ")
}

function generateRule({ text, cols, fontSize, textShadow, height }, index) {
  const words = text.split(" ")
  const { gridWidth, adjustedCols } = getGridParams(text, cols)
  return `(
    :doodle {
      @grid: ${adjustedCols}x1 / ${gridWidth}vmin ${height}vmin;
      font-family: "Share Tech Mono", monospace;
      line-height: 1;
      --color-1: #fff;
      overflow: visible;
      contain: initial;
      will-change: transform;
      animation: x-${index} 10s linear infinite;
      --delay: @r(2)s;
    }

    font-size: ${fontSize}vmin;${textShadow ? `\n          text-shadow: ${textShadow};` : ""}
    --dy: @p(-1, 1);
    --rx: @p(-1, 1);
    --ry: @p(-1, 1);
    --rz: @p(-1, 0, 1);
    animation: flake 12s ease-in-out calc(@var(--delay) + @i * .03s) both infinite;

    @keyframes flake {
      0% {
        translate: @r(30, 35)vmin calc(@var(--dy) * @r(5, 10) * 1vmin) 0;
        rotate: @var(--rx) @var(--ry) @var(--rz) @p(-2400, 2400)deg;
        scale: 0;
        opacity: 0;
      }
      8%, 54% {
        translate: 0 0 0;
        rotate: @var(--rx) @var(--ry) @var(--rz) 0deg;
        scale: 1;
        opacity: 1;
      }
      62%, 100% {
        translate: -@r(30, 35)vmin calc(@var(--dy) * @r(5, 10) * 1vmin) 0;
        rotate: @var(--rx) @var(--ry) @var(--rz) @p(-2400, 2400)deg;
        scale: 0;
        opacity: 0;
      }
    }

    ${generateColRules(words)}
  )`
}

const xKeyframes = layers
  .map((layer, i) => {
    const { cycleWidth } = getGridParams(layer.text, layer.cols)
    return `@keyframes x-${i} { 0% { translate: 0 0; } 100% { translate: -${cycleWidth}vmin 0; } }`
  })
  .join("\n")

const style = document.createElement("style")
style.textContent =
  xKeyframes +
  "\ncss-doodle {\n" +
  layers
    .map((layer, i) => `  --rule-${i}: ${generateRule(layer, i)};`)
    .join("\n") +
  "\n}"
document.head.appendChild(style)

const wrapper = document.getElementById("wrapper")
wrapper.innerHTML = layers
  .map((_, i) => `<css-doodle use="var(--rule-${i})"></css-doodle>`)
  .join("")