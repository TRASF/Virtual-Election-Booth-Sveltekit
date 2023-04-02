import { writable } from 'svelte/store';
import type { Candidate } from '../types';

const candidate = writable<Candidate | undefined>();

export default candidate;
