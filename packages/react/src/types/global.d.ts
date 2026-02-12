declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STORYBOOK_IMAGE_SRC: string;
    }
  }
}

export {};
