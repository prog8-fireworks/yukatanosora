<script lang="ts">
	import { drawYukata, yukataActions, yukataDesignStore, type YukataDesign } from '$lib';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import { onMount } from 'svelte';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';

	let currentTab = $state('gara');
	let yukataImage = $state<HTMLImageElement | null>(null);
	let canvasRef: HTMLCanvasElement;

	// === Svelte 5でstoreを使う ===
	let designState = $state<YukataDesign>();
	$effect(() => {
		const unsubscribe = yukataDesignStore.subscribe((value) => {
			designState = value;
		});
		return unsubscribe;
	});

	// === パターンのオプション ===
	interface PatternOption {
		id: string;
		name: string;
	}

	const patterns: PatternOption[] = [
		{ id: 'solid', name: '無地' },
		{ id: 'dots', name: '水玉' },
		{ id: 'stripes', name: 'ストライプ' },
		{ id: 'flowers', name: '花柄' },
		{ id: 'waves', name: '青海波' }
	];

	const items: PatternOption[] = [
		{ id: 'geta', name: '下駄' },
		{ id: 'higasa', name: '日傘' },
		{ id: 'kinchaku', name: '巾着' },
		{ id: 'obidome', name: '帯留め' }
	];

	// === 画像読み込み関数 ===
	const loadYukataImage = (imagePath: string): Promise<HTMLImageElement> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';

			img.onload = (): void => {
				yukataImage = img;
				resolve(img);
			};

			img.onerror = (): void => {
				console.error('浴衣画像の読み込みに失敗しました:', imagePath);
				reject(new Error(`画像読み込み失敗: ${imagePath}`));
			};

			img.src = imagePath;
		});
	};

	// === Svelte 5のリアクティブ描画（ReactのuseEffectに相当）===
	$effect(() => {
		if (canvasRef && yukataImage && designState) {
			drawYukata(
				canvasRef,
				yukataImage,
				designState.selectedPattern,
				designState.selectedColor,
				designState.obiColor
			);
		}
	});

	// === 完成ページへのリンク生成 ===
	const getCompletePageUrl = () => {
		if (!designState) return '/complete';
		const origin = typeof window !== 'undefined' ? window.location.origin : '';
		return yukataActions.generateShareUrl(designState, origin);
	};

	// === コンポーネント初期化（ReactのuseEffectの初回実行に相当）===
	onMount(async () => {
		try {
			await loadYukataImage('/yukata.png');
		} catch (error) {
			console.error('初期画像の読み込みに失敗:', error);
		}
	});
</script>

<!-- HTMLの中身だけ書く -->
<main class="main">
	<div class="header">
		<div class="logo">浴衣の空</div>
	</div>
	<div class="container">
		<div class="left-box">
			<nav class="tabs">
				<button
					class="tab {currentTab === 'gara' ? 'active' : ''}"
					onclick={() => (currentTab = 'gara')}>柄</button
				>
				<button
					class="tab {currentTab === 'item' ? 'active' : ''}"
					onclick={() => (currentTab = 'item')}>小物</button
				>
			</nav>

			<div class="tab-content">
				{#if currentTab === 'gara'}
					<ColorPicker
						hex={designState?.selectedColor}
						onInput={(e) => yukataActions.setColor(e.hex || '#ffffff')}
						components={ChromeVariant}
						sliderDirection="horizontal"
						label="生地の色を選ぶ"
					/>
					<ColorPicker
						hex={designState?.obiColor}
						onInput={(e) => yukataActions.setObiColor(e.hex || '#ffffff')}
						components={ChromeVariant}
						sliderDirection="horizontal"
						label="帯の色を選ぶ"
					/>
					<div class="item-grid">
						{#each patterns as pattern (pattern.id)}
							<ItemCard
								title={pattern.name}
								onclick={() => yukataActions.setPattern(pattern.id)}
								active={designState?.selectedPattern === pattern.id}
							/>
						{/each}
					</div>
				{:else if currentTab === 'item'}
					<div class="item-grid">
						{#each items as item (item.id)}
							<ItemCard
								title={item.name}
								onclick={() => yukataActions.toggleItem(item.id)}
								active={designState?.selectedItems.includes(item.id)}
							/>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<div class="right-box">
			<div class="inner-right-box">
				<canvas bind:this={canvasRef} width="400" height="700" class="image"></canvas>
				<!-- 小物の画像を重ねる -->
				{#if designState?.selectedItems.includes('geta')}
					<img src="/komono-design/geta.png" class="geta" alt="" />
				{/if}
				{#if designState?.selectedItems.includes('higasa')}
					<img src="/komono-design/higasa.png" class="higasa" alt="" />
				{/if}
				{#if designState?.selectedItems.includes('kinchaku')}
					<img src="/komono-design/kinchaku.png" class="kinchaku" alt="" />
				{/if}
				{#if designState?.selectedItems.includes('obidome')}
					<img src="/komono-design/obidome.png" class="obidome" alt="" />
				{/if}
			</div>
		</div>
	</div>
	<a href={getCompletePageUrl()}> 完成ページ </a>
</main>

<!-- スタイル(CSS) -->
<style>
	.main {
		width: 100%;
	}
	.container {
		display: flex;
		gap: 40px;
		width: 100%;
		max-width: 1200px; /* 全体の幅を調整 */
		padding: 20px;
		box-sizing: border-box;
		margin: 0 auto; /* 中央寄せ */
	}

	.header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		position: absolute;
		top: 0;
		padding: 20px;
	}

	.logo {
		font-size: 24px;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid #ccc;
	}
	.tab {
		padding: 20px;
		border: none;
		background-color: #fff;
		cursor: pointer;
		font-size: 20px;
		transition: background-color 0.3s;
		width: 100%;
	}

	.tabs .active {
		background-color: #e1a9be;
		font-weight: bold;
	}

	.tab-content {
		padding: 20px;
	}

	.item-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
		color: #555;
		margin-top: 12px;
	}

	.left-box {
		background-color: #ffffff; /* 白い四角 */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		width: 50%; /* 左右の幅を調整 */
		border-radius: 12px;
		overflow: hidden;
	}

	.right-box {
		background-color: #ffffff; /* 白い四角 */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		padding: 20px;
		box-sizing: border-box;
		width: 50%; /* 左右の幅を調整 */
		border-radius: 12px;
	}
	.inner-right-box {
		background-color: #fff; /* 内側の四角 */
		/* border-radius: 15px; */
		/* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); */
		width: 100%; /* サイズを調整 */
		height: 100%; /* サイズを調整 */
		display: grid;
		position: relative;
	}
	.image {
		display: block;
		max-width: 100%;
		height: auto;
		margin: 0 auto;
	}

	.geta {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: auto;
	}

	.higasa {
		position: absolute;
		top: 0px;
		left: 30px;
		width: 280px;
		height: auto;
		z-index: 10;
	}
	.kinchaku {
		position: absolute;
		top: 45%;
		right: 35px;
		width: 140px;
		height: auto;
		z-index: 10;
	}
	.obidome {
		position: absolute;
		top: 42%;
		left: 51%;
		transform: translate(-50%, -50%);
		width: 120px;
		height: auto;
		z-index: 10;
	}
</style>
