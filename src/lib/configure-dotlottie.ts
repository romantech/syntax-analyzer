import { setWasmUrl as setDotLottieWasmUrl } from '@lottiefiles/dotlottie-react';

// Keep the WASM asset aligned with the `@lottiefiles/dotlottie-web`
// version bundled under `@lottiefiles/dotlottie-react@0.18.4`.
const DOTLOTTIE_WEB_WASM_VERSION = '0.66.0';

const dotLottieWasmConfig = {
  module_or_path:
    `https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@${DOTLOTTIE_WEB_WASM_VERSION}/dist/dotlottie-player.wasm`,
} as const;

// `@lottiefiles/dotlottie-react@0.18.4` still types this as a string,
// but the runtime accepts the new object form and avoids the init deprecation warning.
setDotLottieWasmUrl(
  dotLottieWasmConfig as unknown as Parameters<typeof setDotLottieWasmUrl>[0],
);
