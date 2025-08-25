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
				<button class="btn share-btn">
					<i class="fas fa-share-alt"></i>
					<span>SNS共有</span>
				</button>
			</div>
		</div>
	</div>

	<button class="btn new-create-btn">新しく作成→</button>
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
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		position: absolute;
		top: 20px;
		left: 20px;
		right: 20px;
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

	.share-btn {
		background: linear-gradient(90deg, #c965c6, #9b59b6);
	}

	.new-create-btn {
		background: #e6e6fa;
		color: #888;
		position: absolute;
		bottom: 50px;
		right: 50px;
		width: auto;
		padding: 15px 30px;
	}

	/* For smaller screens */
	@media (max-width: 768px) {
		.new-create-btn {
			position: static;
			margin-top: 20px;
			width: 80%;
		}
		.wrapper {
			flex-direction: column;
			gap: 40px;
		}
	}
</style>
