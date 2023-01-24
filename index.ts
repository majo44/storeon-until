import { createStoreon, StoreonStore } from 'storeon';

type DispatchableEvents<S> = createStoreon.DispatchableEvents<S>;
type DataTypes<Map, Key extends keyof Map> = Map extends never
    ? [any?]
    : Map[Key] extends never | undefined
        ? [never?]
        : [Map[Key]];

type UntilDispatch<S, E, RE extends keyof E> = (<Event extends keyof E>(
    event: Event, ...data: DataTypes<Partial<E>, Event>) => UntilResult<S, E, RE>);
type AllEvents<S, E> = E & DispatchableEvents<S>;
type Resolver<S, E, K extends keyof AllEvents<S, E>> = (state: S, data: AllEvents<S, E>[K]) => boolean;
type UntilResult<S, E, K extends keyof AllEvents<S, E>> = Promise<AllEvents<S, E>[K]> & {
    dispatchOver: UntilDispatch<S, AllEvents<S, E>, K>;
};

/**
 * Create promise which will be resolved when provided event will occurs on provided store.
 * @param store observed storeon store
 * @param event event which we wait for
 * @param resolveCondition optional condition of resolving
 */
export const until = <S, E, K extends keyof AllEvents<S, E>>(
    store: StoreonStore<S, E>,
    event: K,
    resolveCondition?: Resolver<S, E, K>): UntilResult<S, E, K> => {
    const promise: UntilResult<S, E, K> = Object.assign(
        new Promise<AllEvents<S, E>[K]>(res => {
            const un = store.on(event, (state, eventData) => {
                if (!resolveCondition || resolveCondition(state, eventData)) {
                    un();
                    res(eventData);
                }
            });
        }),
        {
            dispatchOver: <T extends keyof (E & DispatchableEvents<S>)>(event: T, ...data: DataTypes<Partial<E & DispatchableEvents<S>>, T>) => {
                store.dispatch(event, ...data);
                return promise
            }
        }
    );

    return promise;
}
