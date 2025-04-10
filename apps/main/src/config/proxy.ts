export type ProxyEnvType = "dev";

export const proxy: Record<ProxyEnvType, Record<string, any>> = {
  dev: {
    "/api": {
      target: "",
    },
  },
};
