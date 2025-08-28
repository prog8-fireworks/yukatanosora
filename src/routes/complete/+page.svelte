<script lang="ts">
	import { page } from '$app/stores';
	import { drawYukata, yukataActions, yukataDesignStore, type YukataDesign } from '$lib';
	import { onMount } from 'svelte';

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

	// === URLパラメータから設定を復元 ===
	$effect(() => {
		if ($page.url.searchParams.size > 0) {
			yukataActions.loadFromUrlParams($page.url.searchParams);
		}
	});

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

	// === リアクティブ描画 ===
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

	// === SNS共有機能 ===
	const shareToSocial = () => {
		if (!designState) return;

		const shareUrl = yukataActions.generateShareUrl(designState, window.location.origin);
		const shareText = '素敵な浴衣が完成しました！ #浴衣の空';

		// クリップボードにコピー
		navigator.clipboard
			.writeText(shareUrl)
			.then(() => {
				alert('共有URLがクリップボードにコピーされました！');
			})
			.catch(() => {
				// フォールバック: プロンプトで表示
				prompt('この URLをコピーして共有してください:', shareUrl);
			});

		// SNS共有オプション（オプション）
		if (navigator.share) {
			navigator
				.share({
					title: '浴衣の空',
					text: shareText,
					url: shareUrl
				})
				.catch(console.log);
		}
	};

	// === 画像ダウンロード機能 ===
	const downloadImage = async () => {
		if (!canvasRef) return;

		try {
			// 新しいcanvasを作成して合成
			const downloadCanvas = document.createElement('canvas');
			downloadCanvas.width = 480;
			downloadCanvas.height = 700;
			const downloadCtx = downloadCanvas.getContext('2d');
			if (!downloadCtx) return;

			// 浴衣のcanvasを描画
			downloadCtx.drawImage(canvasRef, 0, 0);

			// 小物を合成
			const komono = document.querySelectorAll('.preview-image-wrapper img');
			for (const img of komono) {
				const htmlImg = img as HTMLImageElement;
				if (htmlImg.complete) {
					const rect = htmlImg.getBoundingClientRect();
					const containerRect = document
						.querySelector('.preview-image-wrapper')
						?.getBoundingClientRect();
					if (containerRect) {
						const x = rect.left - containerRect.left;
						const y = rect.top - containerRect.top;
						downloadCtx.drawImage(htmlImg, x, y, rect.width, rect.height);
					}
				}
			}

			// ダウンロード
			const link = document.createElement('a');
			link.download = 'my-yukata.png';
			link.href = downloadCanvas.toDataURL();
			link.click();
		} catch (error) {
			console.error('ダウンロードに失敗しました:', error);
		}
	};

	// === 初期化 ===
	onMount(async () => {
		try {
			await loadYukataImage('/yukata.png');
		} catch (error) {
			console.error('初期画像の読み込みに失敗:', error);
		}
	});
</script>

<!-- HTMLの中身だけ書く -->
<div class="container">
	<div class="header">
		<div class="logo">浴衣の空</div>
	</div>

	<div class="main-content">
		<h1>素敵な浴衣が完成しました！</h1>
		<div class="wrapper">
			<!-- ここが完成画像 -->
			<div class="preview-container">
				<div class="preview-image-wrapper">
					<canvas bind:this={canvasRef} width="400" height="700" class="yukata-canvas"></canvas>
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

			<!-- ここがボタン類 -->
			<div class="buttons">
				<button class="btn download-btn" onclick={downloadImage}>
					<i class="fas fa-download"></i>
					<span>画像ダウンロード</span>
				</button>
				<button class="btn share-btn">
					<i class="fas fa-share-alt"></i>
					<span>SNS共有</span>
				</button>
			</div>
		</div>
	</div>

	<a href="/" class="btn new-create-btn">新しく作成→</a>

	<!-- 左下の桜 -->
	<img src="/sakura/sakura-hidari.png" alt="" aria-hidden="true" class="sakura sakura-left" />

	<!-- 右上の桜 -->
	<img src="/sakura/sakura-migiue.png" alt="" aria-hidden="true" class="sakura sakura-right" />
</div>

<!-- スタイル(CSS) -->
<style>
	.container {
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		top: 0px;
		left: 0px;
		right: 0px;
		padding: 20px;
	}

	.logo {
		font-size: 24px;
		font-weight: bold;
		color: #555;
	}

	.main-content {
		width: 100%;
		padding: 20px;
		z-index: 1;
	}
	.wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 100px;
		width: 100%;
	}
	h1 {
		font-size: 35px;
		font-weight: 700;
		color: #4b3774;
		margin-bottom: 35px;
	}

	.preview-container {
		background: white;
		padding: 15px;
		border-radius: 20px;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
		display: block;
	}

	.preview-image-wrapper {
		overflow: hidden;
		border-radius: 15px;
		position: relative;
		padding: 0 40px;
	}

	.yukata-canvas {
		display: block;
		max-width: 100%;
		height: auto;
	}

	.buttons {
		margin-top: 40px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		width: 100%;
		max-width: 300px;
	}

	.btn {
		padding: 15px 30px;
		border: none;
		border-radius: 40px;
		font-size: 16px;
		font-weight: bold;
		color: white;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.btn i {
		margin-right: 10px;
	}

	.download-btn {
		background: linear-gradient(90deg, #1f64c6, #0d3b66);
	}

	.share-btn {
		background: linear-gradient(90deg, #c965c6, #9b59b6);
	}

	.new-create-btn {
		background: #e6e6fa;
		color: #353333;
		position: fixed;
		bottom: 50px;
		right: 50px;
		width: auto;
		padding: 15px 30px;
		z-index: 1000; /* mi--:ブラウザを小さく開いてる時にクリックできなかったので、これを追加しました */
	}

	/* 小物のスタイル */
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

	.sakura {
		position: fixed; /* 画面上の固定位置に配置 */
		/* bottom は個別クラスで指定（右上は top 固定にするため） */
		width: 40vw; /* 画面幅の40% */
		min-width: 300px; /* 最小幅を設定 */
		height: auto;
		z-index: 0; /* 他のボタンや画像の背面に表示 */
		pointer-events: none; /* 背面のUIをクリック可能に */
	}

	.sakura-left {
		bottom: 0; /* 下端に配置 */
		left: 0; /* 左端に配置 */
	}

	.sakura-right {
		top: 0; /* 上端に配置 */
		right: 0; /* 右端に配置 */
	}

	/* For smaller screens */
	@media (max-width: 768px) {
		.new-create-btn {
			position: static;
			margin-top: 20px;
			width: 80%;
			z-index: 1000; /* ←mi--追加 */
		}
		.wrapper {
			flex-direction: column;
			gap: 40px;
		}
		.sakura {
			width: 80px;
			min-width: 0; /* 上書きしてちゃんと小さくなるように */
		}
	}
</style>
