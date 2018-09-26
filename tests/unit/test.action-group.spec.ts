import Vue from 'vue';
import store from '../store-non-namespaced';

const item = {
    foo: 'bar',
};
  
const other = {
    cool: 'idea',
};

const state: any = store.state;

describe("Testing undo/redo of grouped mutations (i.e. Actions)", () => {
    it('Add 4 items to list', async () => {
        // Commit the items with action groups to the store and assert
        store.commit('addItem', { item });
        store.commit('addItem', { item, actionGroup: 'firstGroup' });
        store.commit('addItem', { item: other, actionGroup: 'firstGroup' });
        store.commit('addItem', { item, actionGroup: 'secondGroup' });
    });

    it('Assert items: should contain 4 items', async () => {
        const expectedState = [{ ...item }, { ...item }, { ...other }, { ...item }];
        expect(state.list).toEqual(expectedState);
    });

    it('Undo secondGroup', async () => {
        await store.dispatch('undo');
    });

    it('Assert items: should contain 3 items', async () => {
        expect(state.list).toEqual([
            { ...item },
            { ...item },
            { ...other },
        ]);
    });

    it('Undo firstGroup', async () => {
        await store.dispatch('undo');
    });

    it('Assert items: should contain 1 item', () => {
        expect(state.list).toEqual([{ ...item }]);
    });

    it('Redo firstGroup', async () => {
        await store.dispatch('redo');
    });

    it('Assert items: should contain 3 items', async () => {
        expect(state.list).toEqual([
            { ...item },
            { ...item },
            { ...other },
        ]);
    });

    it('Redo secondGroup', async () => {
        await store.dispatch('redo');
    });

    it('Assert items: should contain 4 items', async () => {
        expect(state.list).toEqual([
            { ...item },
            { ...item },
            { ...other },
            { ...item },
        ]);
    });

    it('Repeat action: "firstGroup"', () => {
        store.commit('addItem', { item, actionGroup: 'firstGroup' });
        store.commit('addItem', { item: other, actionGroup: 'firstGroup' });
    });

    it('Assert items: should contain 6 items', async () => {
        expect(state.list).toEqual([
            { ...item },
            { ...item },
            { ...other },
            { ...item },
            { ...item },
            { ...other },
        ]);
    });

    it('Undo firstGroup', async () => {
        await store.dispatch('undo');
    });

    it('Assert items: should contain 6 items', async () => {
        expect(state.list).toEqual([
            { ...item },
            { ...item },
            { ...other },
            { ...item },
        ]);
    });
});