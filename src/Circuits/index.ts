import 'reflect-metadata';
export { TransientCircuit } from './BaseCircuits/BaseCircuits';
export { UniCircuit } from './BaseCircuits/BaseCircuits';
export { ChangeSet } from './Storm/ChangeSet';
export { Terminal } from './Decorators/_Terminal';
export { Trigger } from './Decorators/_Trigger';
export { Motherboard } from './Startup/Motherboard';
export { Circuit } from './Decorators/_Circuit';
export * from './_DotNet';

export function isAngularApp(): boolean
{
    const w = globalThis as any;
    return !!w.ng?.applyChanges;
}