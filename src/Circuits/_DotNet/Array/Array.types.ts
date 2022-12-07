// @ts-ignore
interface Array<T>
{
    /**
     * Gets the elements count of the array. The same as Array.length.
     */
    xCount(): number;

    

    /**
     * Retruns a new array with items are the returned value of "refomer" run on each item. It's the same as array.map()
     * @param reformer 
     */
    xSelect<RType>(reformer: (op: T) => RType): RType[];

    /**
     * Returns a new array whose values consist of the concatenated arrays returned by the running "rangeSelector" given each item.
     * @param rangeSelector The function that deduces a range of "RType" items from an item of this array.
     */
    xSelectMany<RType>(rangeSelector: (arg: T) => RType[]): RType[];

    /**
     * Returns a new array with items sorted by the "compareFn"
     * @param comparFn Should return 1 in case a > b,   -1 if a<b   and 0 if a===b  
     */
    xSort(comparFn: (a: T, b:T)=>number): T[];

    /**
     * Returns a new array with the items reversed in order
     */
    xReverse(): T[];

    /**
     * It runs the specified "action" on each item.
     * @param action 
     */
    xForeach(action: (arg: T) => void): void;

    /**
     * Returns true if any of the elements passes the "checker" (The "checker" returns true), and false otherwise
     * @param checker Checks for a custom condition on each element. If not provided it's considered as ()=>true
     */
    xAny(checker?: (arg: T) => boolean): boolean;

    /**
     * Returns true if all items pass the "checker" (The "checker" returns true), and false if any of them fails (The "checker" returns false)
     * @param checker A function checks for a custom condition on each element.
     */
    xAll(checker?: (arg: T) => boolean): boolean;

    /**
     * Returns true if the array has zero elemnts, and false otherwise
     */
    xIsEmpty(): boolean;

    /**
     * Mutates the array by adding "item" to the end of the array.
     * @param item The item to add to this array
     */
    xAdd(item: T): void;

    /**
     * Mutates the array. It tries to find an item using the provided "checker" and return it, or otherwise append the provided "item" and returns it
     * @param item The item to insert in case the no item matched.
     * @param checker The function that checks for the desired item.
     */
    xEnsureItem(item: T, comparer?: (item1: T, item2: T) => boolean): T;

    xOfType<T>(type: new (...args: any[]) => T) : T[];

    /**
     * Mutates the array by appending new items to it
     * @param The new items to add to the array
     */
    xAddRange(items: any[]): void;

    /**
     * Returns the "another" array items concatenated to this array items
     * @param another
     */
    xUnion(another: T[]): T[];

    /**
     * Returns a new array of the items matching the selector.
     * @param selector 
     */
    xWhere(selector: (arg: T) => boolean): T[];

    /**
     * Returns the item at the specified index. If the index is out of the array range, it throws an exception.
     * @param index The index to find an item against.
     */
    xItemAt(index: number): T;


    /**
     * Returns the index of the first occurence of the item
     * @param item The item to find its first occurence index in the array. Otherwise it returns -1
     */
    xIndexOf(item: T): number;
    
    /**
     * Mutates the array by removing the item at the specified index.
     * @param index The index to remove the item at
     */
    xRemoveAt(index: any): void;

    /**
     * Mutates the array by removing the specified range.
     * @param index The starting index at which it start removing
     * @param length The total number to remove
     */
    xRemoveRange(index: number, length: number): void;

    /**
     * Mutates the array by removing the items that matches the selector if any.
     * @param selector The selector used to find the items to remove.
     */
    xRemoveWhere(selector: (arg: T) => boolean): void;
    

    /**
     * Returns a new array with the specified range.
     * @param index The index to start from
     * @param length The length of items to return, if not provided it returns all the succeeding item to the end of the array.
     */
    xGetRange(index: number, length?: number | undefined): T[];

    /**
     * Mutates the array by inserting the provided item at the provided index
     * @param index The index to insert item at.
     * @param item The item to insert
     */
    xInsert(index: number, item: T): void;

    /**
     * Mutates the array by inserting the provided items at the provided index.
     * @param index The index to insert items at
     * @param items The items to insert
     */
    xInsertRange(index: number, items: T[]): void;

    
     /**
     * If the selector argument was provided, it returns the first item matches the selector. 
     * Otherwise it returns the first item in the array. If no item was found either way it returns null.
     * @param selector 
     */
    xFirstOrNull(selector?: (arg: T) => boolean): T | null ;

    /**
     * If the selector argument was provided, it returns the first item matches the selector. 
     * Otherwise it returns the first item in the array. If no item was found either way it throws an exception. 
     * @param selector 
     */
    xFirst(selector?: (arg: T) => boolean): T;

     /**
     * If the selector argument was provided, it returns the last item matches the selector. 
     * Otherwise it returns the last item in the array. If no item was found either way it returns null.
     * @param selector 
     */
    xLastOrNull(selector?: (arg: T) => boolean): T | null;

    /**
     * If the selector argument was provided, it returns the last item matches the selector. 
     * Otherwise it returns the last item. If no item was found either way it throws an exception. 
     * @param func 
     */
    xLast(selector?: (arg: T) => boolean): T;

    /**
     * Returns a new array of items skipping the provided number of items
     * @param countToSkip The count of elements to skip
     */
    xSkip(countToSkip: number): T[];
    /**
     * Returns a new array of items starting from the first item and with the specified count.
     * @param countToTake The count of elements to take
     */
    xTake(countToTake: number): T[];

    /**
     * Returns true if the provided object is an element of the array.
     * Comparisons are done using value and reference types rules.
     * @param obj The object you want to find if it exists
     */
    xContains(obj: T): boolean;

    /**
     * Returns a new array whose repitions are removed.
     * Comparisons are done using value and reference types rules
     */
    xDistinct(): T[];

    /**
     * Returns a new array whose the same items as this array except those are existing in "except" array.
     */
    xExcept(except: T[]): T[];

    /**
     * Returns a new array of the same items as this array. Reference types are added by reference, and value types are copied.
     */
    xClone(): T[];

    /**
     * Returns a new distinct list of the items common between this and the "anotherArray".
     * Comparisons are done using value and reference types rules
     * @param anotherArray The other array you want to get the intersection between it and this array.
     */
    xIntersect(anotherArray: T[]): T[];

    /**
     * Returns a map with keys determined by the keySelector function, and each value is an array of items whose the specified key.
     * @param keySelector The function that when given an item it returns the key of that item 
     * @param distinctItems When true, if there are more than one item against the same key that are considered equal, only one will be taken. 
     * @returns A map of an array of items against each key.
     */
    xToMap<TKey>(keySelector: (item: T) => TKey, distinctItems?: boolean): Map<TKey, T[]>;

    /**
     * Mutates the array by removing all the items from it. It triggers observers added using xEnsureObserver().
     */
    xReset(): void;
}