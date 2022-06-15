import {
    createUpdate,
    FilterCheckbox,
} from 'shared/components/query/filteredSearch/field/CheckboxFilterField';
import { CancerTreeSearchFilter } from 'shared/lib/query/textQueryUtils';
import { ListPhrase } from 'shared/components/query/filteredSearch/Phrase';

describe('FilteredSearchDropdownForm', () => {
    describe('createUpdate', () => {
        const dummyFilter = {
            phrasePrefix: 'test',
            nodeFields: ['studyId'],
            form: {
                input: FilterCheckbox,
                options: ['a', 'b', 'c', 'd', 'e'],
                label: 'Test label',
            },
        } as CancerTreeSearchFilter;

        it('creates shortest update with more Not than And', () => {
            const bd = new ListPhrase(
                'b,d',
                'test:b,d',
                dummyFilter.nodeFields
            );
            const toRemove: ListPhrase[] = [bd];
            const checked = ['a', 'd'];
            const result = createUpdate(toRemove, checked, dummyFilter);
            expect(result.toAdd.length).toEqual(1);
            expect(result.toAdd[0].isAnd()).toEqual(true);
            expect(result.toAdd[0].toString()).toEqual('test:a,d');
            expect(result.toRemove.length).toEqual(1);
            expect(result.toRemove[0].toString()).toEqual('test:b,d');
        });

        it('creates shortest update with more And than Not', () => {
            const checked = ['a', 'b', 'c'];
            const toRemove: ListPhrase[] = [];
            const result = createUpdate(toRemove, checked, dummyFilter);
            expect(result.toAdd.length).toEqual(1);
            expect(result.toAdd[0].toString()).toEqual('- test:d,e');
        });

        it('removes all update when only And', () => {
            const checked = dummyFilter.form.options;
            const toRemove: ListPhrase[] = [];
            const result = createUpdate(toRemove, checked, dummyFilter);
            expect(result.toAdd?.length).toEqual(0);
        });

        it('creates only Not when no And', () => {
            const checked: string[] = [];
            const toRemove: ListPhrase[] = [];
            const result = createUpdate(toRemove, checked, dummyFilter);
            expect(result.toAdd.length).toEqual(1);
            expect(result.toAdd[0].isNot()).toEqual(true);
            expect(result.toAdd[0].toString()).toEqual('- test:a,b,c,d,e');
        });
    });
});
