interface Options {
    flag: boolean;
    cacheName: string;
}

export const cachedFetch = async (path: string, { flag, cacheName }: Options) => {
    if (!flag) return fetch(path).then(response => {
        if (!response.ok) throw response.statusText;
        return response;
    });

    const cache = await caches.open(cacheName);

    const cachedResponse = await cache.match(path);
    if (cachedResponse) return cachedResponse;

    return fetch(path).then(response => {
        if (!response.ok) throw response.statusText;
        cache.put(path, response.clone());
        return response;
    });
};