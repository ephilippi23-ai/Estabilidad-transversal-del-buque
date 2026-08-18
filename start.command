#!/bin/zsh
set -e
cd "${0:A:h}"

if command -v npm >/dev/null 2>&1; then
  NPM_BIN="$(command -v npm)"
elif [[ -x ".tools/node/bin/npm" ]]; then
  export PATH="$PWD/.tools/node/bin:$PATH"
  NPM_BIN="$PWD/.tools/node/bin/npm"
else
  echo "No se encontro Node.js. Consulte README.md para instalarlo."
  read -r "?Pulse Enter para cerrar..."
  exit 1
fi

[[ -d node_modules ]] || "$NPM_BIN" install
echo "Abriendo TrimLab en http://localhost:5173"
(sleep 2; open http://localhost:5173) &
"$NPM_BIN" run dev
