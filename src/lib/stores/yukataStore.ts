import { writable } from 'svelte/store';

// === 浴衣のデザイン状態を管理するstore ===
export interface YukataDesign {
	selectedColor: string;
	obiColor: string;
	selectedPattern: string;
	selectedItems: string[];
}

// デフォルト値
const defaultDesign: YukataDesign = {
	selectedColor: '#f5f5f5',
	obiColor: '#353333',
	selectedPattern: 'solid',
	selectedItems: []
};

// グローバルステートのstore
export const yukataDesignStore = writable<YukataDesign>(defaultDesign);

// 便利な更新関数
export const yukataActions = {
	setColor: (color: string) => {
		yukataDesignStore.update((design) => ({ ...design, selectedColor: color }));
	},

	setObiColor: (color: string) => {
		yukataDesignStore.update((design) => ({ ...design, obiColor: color }));
	},

	setPattern: (pattern: string) => {
		yukataDesignStore.update((design) => ({ ...design, selectedPattern: pattern }));
	},

	toggleItem: (itemId: string) => {
		yukataDesignStore.update((design) => {
			const newItems = design.selectedItems.includes(itemId)
				? design.selectedItems.filter((id) => id !== itemId)
				: [...design.selectedItems, itemId];
			return { ...design, selectedItems: newItems };
		});
	},

	reset: () => {
		yukataDesignStore.set(defaultDesign);
	},

	// === URL共有機能 ===
	loadFromUrlParams: (searchParams: URLSearchParams) => {
		const color = searchParams.get('color');
		const obiColor = searchParams.get('obi');
		const pattern = searchParams.get('pattern');
		const items = searchParams.get('items');

		const design: YukataDesign = {
			selectedColor: color ?? defaultDesign.selectedColor,
			obiColor: obiColor ?? defaultDesign.obiColor,
			selectedPattern: pattern ?? defaultDesign.selectedPattern,
			selectedItems: items ? items.split(',').filter(Boolean) : defaultDesign.selectedItems
		};

		yukataDesignStore.set(design);
	},

	generateShareUrl: (currentDesign: YukataDesign, baseUrl: string): string => {
		const params = new URLSearchParams();
		params.set('color', currentDesign.selectedColor);
		params.set('obi', currentDesign.obiColor);
		params.set('pattern', currentDesign.selectedPattern);
		if (currentDesign.selectedItems.length > 0) {
			params.set('items', currentDesign.selectedItems.join(','));
		}
		return `${baseUrl}/complete?${params.toString()}`;
	}
};
