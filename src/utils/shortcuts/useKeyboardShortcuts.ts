import { useCallback, useEffect, useReducer } from 'react';
import produce from 'immer';
import { FiTarget } from 'react-icons/fi';

const SET_KEY_UP = 'SET_KEY_UP';
const SET_KEY_DOWN = 'SET_KEY_DOWN';
const SET_KEY_OBJ = 'SET_KEY_OBJ';

interface KeyPressActionType {
	type: typeof SET_KEY_UP | typeof SET_KEY_DOWN;
	key: string;
}

interface SetKeyObjActionType {
	type: typeof SET_KEY_OBJ;
	keyobj: Record<string, boolean>;
}

const blacklistedTargets = ['INPUT', 'TEXTAREA'];

const keysReducer = (
	state: Record<string, boolean>,
	action: KeyPressActionType | SetKeyObjActionType
) => {
	switch (action.type) {
		case SET_KEY_UP:
			const keyUpState = { ...state, [action.key]: false };
			return keyUpState;
		case SET_KEY_DOWN:
			const keyDownState = { ...state, [action.key]: true };
			return keyDownState;
		case SET_KEY_OBJ:
			const resetState = action.keyobj;
			return resetState;
		default:
			return state;
	}
};

export const useKeyboardShortcuts = (
	shortcutKeys: string[],
	callback: () => void
) => {
	if (shortcutKeys.length < 1) {
		throw new Error('Need to register at least one key listener');
	}

	const initialKeysObj = shortcutKeys.reduce<Record<string, boolean>>(
		(p, k) => {
			p[k.toLowerCase()] = false;
			return p;
		},
		{}
	);

	const [keys, setKeys] = useReducer(keysReducer, initialKeysObj);

	const handleKeyDownListener = useCallback(
		(assignedKey: string) => (keyDownEvent: KeyboardEvent) => {
			const { target, key } = keyDownEvent;
			if (blacklistedTargets.includes((target as HTMLElement).tagName))
				return;

			if (key.toLowerCase() !== assignedKey.toLowerCase()) return;
			if (keys[key] === undefined) return;

			setKeys({ type: SET_KEY_DOWN, key });
		},
		[shortcutKeys, keys]
	);

	const handleKeyUpListener = useCallback(
		(assignedKey: string) => (keyUpEvent: KeyboardEvent) => {
			const { target, key } = keyUpEvent;
			if (blacklistedTargets.includes((target as HTMLElement).tagName))
				return;

			if (!shortcutKeys.includes(key.toLowerCase())) return;
			if (key.toLowerCase() !== assignedKey.toLowerCase()) return;
			if (keys[key] === undefined) return;

			setKeys({ type: SET_KEY_UP, key });
		},
		[keys, shortcutKeys]
	);

	useEffect(() => {
		const checkKeys = () => {
			shortcutKeys.forEach((k) => {
				if (keys[k] !== undefined && !keys[k]) return;
			});
			callback();
		};
		checkKeys();
	});

	useEffect(() => {
		shortcutKeys.forEach((k) => {
			window.addEventListener('keydown', handleKeyDownListener(k));
		});
		return () => {
			shortcutKeys.forEach((k) => {
				window.removeEventListener('keydown', handleKeyDownListener(k));
			});
		};
	}, [shortcutKeys, handleKeyDownListener]);

	useEffect(() => {
		shortcutKeys.forEach((k) => {
			window.addEventListener('keyup', handleKeyUpListener(k));
		});

		return () => {
			shortcutKeys.forEach((k) => {
				window.removeEventListener('keyup', handleKeyUpListener(k));
			});
		};
	}, [shortcutKeys, handleKeyUpListener]);
};
