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
	<!-- 背景用画像 -->
	<img src="/sakura/sakurahaikei-hidari.png" alt="" class="bg-image left" aria-hidden="true" />
	<img src="/sakura/sakurahaikei-migi.png" alt="" class="bg-image right" aria-hidden="true" />

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
					<div class="sacp">
						<ColorPicker
							hex={designState?.selectedColor}
							onInput={(e) => yukataActions.setColor(e.hex || '#ffffff')}
							components={ChromeVariant}
							sliderDirection="horizontal"
							label="生地の色を選ぶ"
						/>
					</div>
					<div class="sacp">
						<ColorPicker
							hex={designState?.obiColor}
							onInput={(e) => yukataActions.setObiColor(e.hex || '#ffffff')}
							components={ChromeVariant}
							sliderDirection="horizontal"
							label="帯の色を選ぶ"
						/>
					</div>
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
	<a href={getCompletePageUrl()} class="complete-button"> 完成ページ </a>
</main>

<!-- スタイル(CSS) -->
<style>
	.main {
		position: relative;
		width: 100%;
		min-height: 100vh; /* 画面高さに合わせる */
		display: flex;
		flex-direction: column;
		align-items: center; /* 横中央揃え */
		overflow: hidden; /* はみ出しを隠す */
	}

	/* 背景画像共通 */
	.bg-image {
		position: absolute;
		bottom: 0;
		z-index: -1; /* コンテンツの下に配置 */
		height: auto;
		pointer-events: none; /* クリックなどを透過 */
		user-select: none;
	}

	/* 左下配置 */
	.bg-image.left {
		left: 0;
		width: 45%; /* 画面サイズに応じた幅 */
		max-width: 500px; /* 最大幅を制限 */
	}

	/* 右下配置 */
	.bg-image.right {
		right: 0;
		width: 45%; /* 画面サイズに応じた幅 */
		max-width: 500px; /* 最大幅を制限 */
	}

	.header,
	.container,
	.complete-button {
		position: relative;
		z-index: 1;
	}
	.container {
		display: flex;
		gap: 40px;
		width: 100%;
		max-width: 1200px; /* 全体の幅を調整 */
		padding: 0px 20px 20px 20px; /* 左右に余白 */
		box-sizing: border-box;
		margin: 0 auto; /* 中央寄せ */
	}
	.header {
		position: relative; /* absolute をやめる */
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px; /* container との間隔 */
		top: 0px;
		left: 0px;
		right: 0px;
		padding: 20px;
		box-sizing: border-box;
		z-index: 10; /* 上に重ねたい場合 */
	}
	.logo {
		font-size: 24px;
		font-weight: bold;
		color: #555;
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
		border-radius: 12px 12px 0 0;
	}

	.tabs .active {
		background-color: #e1a9be;
		font-weight: bold;
	}
	.left-box,
	.tab-content,
	.item-grid {
		position: relative;
		z-index: 1; /* 背景より前面に */
	}

	.left-box {
		background-color: #ffffff; /* 白い四角 */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		width: 50%;
		border-radius: 12px;
		max-height: 80vh; /* 高さを画面に収める */
		padding-bottom: 20px;
		height: auto;
	}

	.sacp {
		z-index: 1000;
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

	canvas.image {
		position: relative; /* relativeにする */
		z-index: 1;
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
		background-color: #fff; /* 内側の四角 */ /* border-radius: 15px; */ /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); */
		width: 100%; /* サイズを調整 */
		height: auto; /* サイズを調整 */
		display: grid;
		position: relative;
	}
	.image {
		display: block;
		max-width: 100%;
		height: auto;
		margin: 0 auto;
	}
	.geta,
	.higasa,
	.kinchaku,
	.obidome {
		position: absolute;
		z-index: 2;
		width: auto;
		height: auto;
		max-width: 25%; /* 親幅の25%まで */
		max-height: 25%; /* 親高さの25%まで */
	}

	/* 位置は元のまま */
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
		top: 8%;
		left: 13%;
		width: 300px; /* 元の280pxから大きく */
		height: auto;
		z-index: 10;
		max-width: 40%; /* 親ボックス幅の割合で最大サイズを設定 */
		max-height: 50%; /* 必要に応じて */
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
	.complete-button {
		display: inline-block;
		padding: 12px 24px;
		background-color: #e1a9be; /* ボタンの背景色 */
		color: #fff; /* 文字色 */
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		border-radius: 8px; /* 角丸 */
		text-decoration: none; /* 下線消す */
		transition:
			background-color 0.3s,
			transform 0.2s;
		cursor: pointer;
		margin: 20px 0; /* 上下の余白 */
	}

	.complete-button:hover {
		background-color: #9b59b6; /* ホバー時の色 */
		transform: translateY(2px); /* ちょっと浮いた感じ */
	}
	@media (max-width: 768px) {
		.bg-image.left,
		.bg-image.right {
			width: 40%;
		}
		.container {
			display: flex;
			flex-direction: column; /* 縦並びに変更 */
			gap: 20px; /* 縦並びなので余白を少し減らす */
		}
		.right-box {
			order: 0; /* 上に表示させたい */
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden; /* 必要ならスクロール */
		}
		.left-box {
			order: 1; /* 下に表示 */
			width: 100%;
		}
		.inner-right-box {
			width: 100%;
			height: 100%;
			display: grid;
			position: relative;
		}
		canvas.image {
			width: auto;
			height: 100%; /* box の高さに合わせる */
			object-fit: contain; /* アスペクト比を維持して縮小 */
		}
		.geta,
		.higasa,
		.kinchaku,
		.obidome {
			position: absolute; /* absolute 必須 */
			z-index: 2; /* canvasより上 */
			max-width: 30%; /* 少し大きめに表示 */
			max-height: 30%;
		}
	}
</style>
