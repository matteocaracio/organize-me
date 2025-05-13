
/// <reference types="vite/client" />

// Add global definitions to help with the "require is not defined" error
interface Window {
  process: any;
  global: Window;
}

declare const process: {
  env: {
    NODE_ENV: string;
    [key: string]: string | undefined;
  };
};

