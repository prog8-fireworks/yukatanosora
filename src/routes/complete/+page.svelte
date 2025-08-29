<script lang="ts">
	import { page } from '$app/stores';
	import { drawYukata, yukataActions, yukataDesignStore, type YukataDesign } from '$lib';
	import { onMount } from 'svelte';

	let showModal = $state(false);
	let twitterShareUrl = $state('');

	onMount(() => {
		const tweetText = encodeURIComponent('🎆 私の浴衣デザインが完成しました！ 🎆');
		const pageUrl = encodeURIComponent(window.location.href);
		const hashtags = 'yukatanosora,浴衣カスタム,夏祭りコーデ';

		twitterShareUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${pageUrl}&hashtags=${hashtags}`;
	});

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

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

	// === URLをコピー ===
	const copyUrl = () => {
		if (!designState) return;

		const url = yukataActions.generateShareUrl(designState, window.location.origin);

		// クリップボードにコピー
		navigator.clipboard.writeText(url);
		alert('URLをコピーしました');
	};

	// === 画像ダウンロード機能 ===
	const downloadImage = async () => {
		if (!canvasRef) return;

		try {
			// 新しいcanvasを作成して合成
			const downloadCanvas = document.createElement('canvas');
			const container = document.querySelector('.preview-image-wrapper') as HTMLElement;
			if (!container) return;
			const containerRect = container.getBoundingClientRect();
			const canvasRect = canvasRef.getBoundingClientRect();
			downloadCanvas.width = Math.round(containerRect.width);
			downloadCanvas.height = Math.round(containerRect.height);
			const downloadCtx = downloadCanvas.getContext('2d');
			if (!downloadCtx) return;

			// 浴衣のcanvasを描画
			const offsetX = canvasRect.left - containerRect.left;
			const offsetY = canvasRect.top - containerRect.top;
			downloadCtx.drawImage(canvasRef, offsetX, offsetY, canvasRect.width, canvasRect.height);

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
		<img src="/yukatanosora-logo.png" alt="" class="logo-image" />
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
				<!-- シェアボタン -->
				<button class="btn share-btn" onclick={openModal}>SNSで共有</button>
				<!-- モーダル -->
				{#if showModal}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="modal" onclick={closeModal}>
						<div class="modal-content" onclick={(e) => e.stopPropagation()}>
							<button class="close" onclick={closeModal}>&times;</button>
							<div>
								<h3>🎆 Xでみんなに自慢する</h3>
								<a
									href={twitterShareUrl}
									class="twitter-share-button"
									data-show-count="false"
									data-size="large">Tweet</a
								>
								<script
									async
									src="https://platform.twitter.com/widgets.js"
									charset="utf-8"
								></script>
							</div>
							<div>
								<h3>🔗 デザインURLをコピー</h3>
								<div class="copy-url-container">
									<input type="text" class="copy-url-input" readonly value={window.location.href} />
									<button class="copy-btn" onclick={copyUrl}>コピー</button>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<a href="/" class="btn new-create-btn" onclick={() => yukataActions.reset()}>新しく作成→</a>

	<!-- 左下の桜 -->
	<img src="/sakura/sakura-hidari.png" alt="" aria-hidden="true" class="sakura sakura-left" />

	<!-- 右上の桜 -->
	<img src="/sakura/sakura-migiue.png" alt="" aria-hidden="true" class="sakura sakura-right" />
</div>

<!-- スタイル(CSS) -->
<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh; /* 画面高さに合わせる */
		justify-content: center;
		padding: 20px; /* 左右に余白 */
		box-sizing: border-box;
		text-align: center;
		width: 100%;
	}

	.header {
		position: absolute;
		width: 100%;
		display: flex;
		align-items: center;
		top: 0px;
		left: 0px;
		right: 0px;
		padding: 20px;
	}

	.logo-image {
		width: 50px;
		height: 40px;
		margin-right: 0px;
		object-fit: contain;
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
		margin-top: 35px;
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
		display: grid;
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
		transform: translateY(2px);
		box-shadow: 0 8px 6px rgba(0.15, 0, 0, 0);
	}

	.btn i {
		margin-right: 10px;
	}

	.download-btn {
		background: linear-gradient(90deg, #9b59b6, #e1a9be);
	}
	.modal {
		position: fixed;
		z-index: 1000;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.modal-content {
		background-color: #fffaf5;
		margin: 40% 50%;
		padding: 24px;
		border: 2px solid #e1a9be;
		border-radius: 12px;
		width: 80%;
		max-width: 500px;
		text-align: center;
		position: relative;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		font-size: 16px; /* 基本フォントサイズ */
		line-height: 1.6;
	}
	.modal-content h3 {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 12px;
		color: #4b3774;
		text-align: center;
	}

	.close {
		font-size: 28px;
		cursor: pointer;
		border: none;
		background: none;
		color: #555;
		padding: 6px;
		position: absolute;
		right: 12px;
		top: 0px;
		transition: color 0.2s;
	}

	.twitter-share-button {
		display: block;
		margin: 0 auto;
		padding: 10px 20px;
		border-radius: 6px;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	/* ホバーで少し沈む動き */
	.twitter-share-button:hover {
		transform: translateY(2px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.share-btn {
		background: linear-gradient(90deg, #e1a9be, #9b59b6);
	}

	.copy-url-container {
		display: flex;
		gap: 10px;
		margin-top: 5px;
	}

	.copy-url-input {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 8px;
		font-size: 14px;
	}
	.copy-btn {
		border: none;
		padding: 8px 16px;
		border-radius: 8px;
		background: #e6e6fa;
		color: #353333;
		flex-shrink: 0;
		cursor: pointer;
		transition: background 0.2s;
	}
	.copy-btn:hover {
		background: #d4d4f7;
		transform: translateY(1.5px);
	}

	.new-create-btn {
		background: #e1a9be;
		color: #f8f6f6;
		position: fixed;
		bottom: 50px;
		right: 50px;
		width: auto;
		padding: 15px 30px;
		z-index: 1000; /* mi--:ブラウザを小さく開いてる時にクリックできなかったので、これを追加しました */
		text-decoration: none; /* ← 下線を消す */
	}

	.new-create-btn:hover {
		background-color: #9b59b6; /* ホバー時の色 */
		transform: translateY(2px); /* ちょっと浮いた感じ */
	}
	/* 小物のスタイル */

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
			gap: 30px;
		}
		.sakura {
			width: 300px;
			min-width: 0; /* 上書きしてちゃんと小さくなるように */
		}
	}
</style>
