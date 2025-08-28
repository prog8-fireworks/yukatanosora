<script>
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
					<img src="/image.png" alt="完成した浴衣" class="yukata-image" />
				</div>
			</div>

			<!-- ここがボタン類 -->
			<div class="buttons">
				<button class="btn download-btn">
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
							<h3>Xでシェアする</h3>
							<a
								href={twitterShareUrl}
								class="twitter-share-button"
								data-show-count="false"
								data-size="large">Tweet</a
							>
							<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
						</div>
					</div>
				{/if}
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
	}

	.yukata-image {
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
		background-color: #fff;
		margin: 15% auto;
		padding: 24px;
		border-radius: 12px;
		width: 80%;
		max-width: 400px;
		text-align: start;
		position: relative;
	}

	.close {
		font-size: 28px;
		cursor: pointer;
		border: none;
		background: none;
		color: #555;
		padding: 6px;
		position: absolute;
		right: 10px;
		top: 0;
	}

	.twitter-share-button {
		display: block;
		padding: 10px 20px;
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
		z-index: 800; /* mi--:ブラウザを小さく開いてる時にクリックできなかったので、これを追加しました */
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
