import { StoreonStore } from 'storeon';

type Until = <S, E, K extends keyof E>(
    store: StoreonStore<S, E>,
    event: K,
    resolveCondition?: (state: S, data: E[K]) => boolean) => Promise<E[K]>;

/**
 * Create promise which will be resolved when provided event will occurs on provided store.
 * @param store observed storeon store
 * @param event event which we wait for
 * @param resolveCondition optional condition of resolving
 */
export const until: Until = (store, event, resolveCondition) => new Promise(res => {
    const un = store.on(event, (state, eventData) => {
        if (!resolveCondition || resolveCondition(state, eventData)) {
            un();
            res(eventData);
        }
    });
});
