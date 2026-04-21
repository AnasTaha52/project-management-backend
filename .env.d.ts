declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    CORS_ORIGIN?: string;
    MONGO_URI: string;
    NODE_ENV?: "development" | "production" | "test";
  }
}
