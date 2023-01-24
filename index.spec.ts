import { createStoreon, StoreonStore } from 'storeon';
import { expect, use } from 'chai';
import * as sinonChai from "sinon-chai";
import { until } from './index';
use(sinonChai);

describe(`simple scenarios`, () => {
    let store: StoreonStore;
    beforeEach(() => {
        store = createStoreon([]);
        store.on('a', async (_, data) => {
            store.dispatch('b', data);
        });
        store.on('b', () => {});
    });

    it('should continue when no condition', async () => {
        const promise = until(store, 'b');
        store.dispatch('a');
        await promise;
        expect(true).to.be.true;
    });

    it('should continue when no condition, short version', async () => {
        await until(store, 'b').dispatchOver('a');
        expect(true).to.be.true;
    });

    it('should continue when condition', async () => {
        const promise = until(store, 'b', (_, d) => d === true);
        store.dispatch('a', true);
        await promise;
        expect(true).to.be.true;
    });

    it('should continue when condition, short version', async () => {
        await until(store, 'b', (_, d) => d === true).dispatchOver('a', true);
        expect(true).to.be.true;
    });

    it('should not condition when condition returns false', async () => {
        let result;
        until(store, 'b', (_, d) => d === true).then(d => { result = d });
        store.dispatch('a', false);
        await Promise.resolve();
        expect(result).to.be.undefined;
        store.dispatch('a', true);
        await Promise.resolve();
        expect(result).to.be.true;
    });

    it('should not condition when condition returns false', async () => {
        let result;
        until(store, 'b', (_, d) => d === true).then(d => { result = d });
        store.dispatch('a', false);
        await Promise.resolve();
        expect(result).to.be.undefined;
        store.dispatch('a', true);
        await Promise.resolve();
        expect(result).to.be.true;
    });

});

// describe('typed store', () => {
//     interface State {}
//     interface Events {
//         'a': undefined;
//         'b': number;
//     }
//     const store = createStoreon<State,Events>([]);
//     until(store, 'b').dispatchOver('a')
//     until(store, 'a').dispatchOver('b', 1)
//
// })
