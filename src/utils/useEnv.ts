export const useEnv = () => {
    return import.meta.env;
};

export const buildServerPath = (path: string) => {
    return useEnv().PUBLIC_BACKEND + path;
};
