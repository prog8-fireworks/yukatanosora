<script lang="ts">
	// APIレスポンスの型定義
	interface TryOnImage {
		id: number;
		filename: string;
		base64: string;
		data_url: string;
		mime_type: string;
	}

	interface TryOnResponse {
		success: boolean;
		message: string;
		images: TryOnImage[];
		job_id: string;
		processing_time: number;
		image_count: number;
		total_size_mb: number;
	}

	let isLoading = false;
	let results: TryOnImage[] = [];
	let processingTime = 0;
	let imageCount = 0;
	let productImageInput: HTMLInputElement;
	let customYukataFile: File | null = null;
	let personImagePreview: string | null = null;
	let productImagePreview: string | null = null;

	async function tryOnWithBase64(e: SubmitEvent) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget as HTMLFormElement);

		// ファイルの存在確認
		const personFile = formData.get('person_image') as File;
		let productFile = formData.get('product_image') as File;

		// カスタム浴衣がある場合は優先使用
		if (customYukataFile) {
			productFile = customYukataFile;
			console.log('カスタム浴衣ファイルを使用:', customYukataFile);
		}

		if (!personFile || !productFile || personFile.size === 0 || productFile.size === 0) {
			alert('人物画像と商品画像の両方を選択してください');
			return;
		}

		// FormDataを再構築（カスタム浴衣を使用する場合）
		if (customYukataFile) {
			formData.set('product_image', customYukataFile);
		}

		isLoading = true;
		results = [];

		try {
			console.log('APIリクエストを送信中...');
			const response = await fetch('http://localhost:8000/api/v1/try-on-base64', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				console.log(`✅ 成功! ${result.image_count}枚の画像を生成`);
				console.log(`⏱️ 処理時間: ${result.processing_time.toFixed(2)}秒`);

				results = result.images;
				processingTime = result.processing_time;
				imageCount = result.image_count;
			} else {
				console.error('❌ エラー:', result.message);
			}
		} catch (error) {
			console.error('❌ リクエストエラー:', error);
		} finally {
			isLoading = false;
		}
	}

	// 画像プレビュー機能
	function handleImageChange(event: Event, type: 'person' | 'product') {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				if (type === 'person') {
					personImagePreview = result;
				} else {
					productImagePreview = result;
				}
			};
			reader.readAsDataURL(file);
		}
	}

	// カスタム浴衣読み込み機能
	async function loadCustomYukata() {
		const dataURL = sessionStorage.getItem('customYukataBase64');
		if (dataURL) {
			try {
				// Base64をBlobに変換
				const response = await fetch(dataURL);
				const blob = await response.blob();
				customYukataFile = new File([blob], 'custom-yukata.png', { type: 'image/png' });

				// ファイル入力に反映
				if (productImageInput) {
					const dataTransfer = new DataTransfer();
					dataTransfer.items.add(customYukataFile);
					productImageInput.files = dataTransfer.files;
				}

				// プレビューも設定
				productImagePreview = dataURL;

				// セッションストレージをクリア
				sessionStorage.removeItem('customYukataBase64');
			} catch (error) {
				console.error('カスタム浴衣の読み込みに失敗しました:', error);
			}
		}
	}

	// ページ読み込み時にカスタム浴衣をチェック
	import { onMount } from 'svelte';
	onMount(() => {
		loadCustomYukata();
	});
</script>

<main class="container">
	<div class="header">
		<h1>浴衣試着AI</h1>
		<p>人物画像と浴衣画像をアップロードして、AIで試着画像を生成しましょう</p>
	</div>

	<div class="form-container">
		<form onsubmit={tryOnWithBase64} class="upload-form">
			<div class="file-input-group">
				<div class="file-input-wrapper">
					<label for="person_image" class="file-label">
						{#if personImagePreview}
							<img src={personImagePreview} alt="人物画像プレビュー" class="image-preview" />
						{:else}
							<div class="file-icon">👤</div>
							<span>人物画像を選択</span>
						{/if}
					</label>
					<input
						type="file"
						name="person_image"
						id="person_image"
						accept="image/*"
						class="file-input"
						onchange={(e) => handleImageChange(e, 'person')}
					/>
				</div>

				<div class="file-input-wrapper">
					<label for="product_image" class="file-label">
						{#if productImagePreview}
							<img src={productImagePreview} alt="浴衣画像プレビュー" class="image-preview" />
						{:else}
							<div class="file-icon">👘</div>
							<span>浴衣画像を選択</span>
						{/if}
					</label>
					<input
						type="file"
						name="product_image"
						id="product_image"
						accept="image/*"
						class="file-input"
						bind:this={productImageInput}
						onchange={(e) => handleImageChange(e, 'product')}
					/>
				</div>
			</div>

			<button
				type="submit"
				class="submit-btn"
				disabled={isLoading}
				onclick={() => console.log('ボタンがクリックされました')}
			>
				{#if isLoading}
					<div class="loading-spinner"></div>
					<span>生成中...</span>
				{:else}
					<span>🎨 AI生成開始</span>
				{/if}
			</button>
		</form>
	</div>

	{#if isLoading}
		<div class="loading-container">
			<div class="loading-content">
				<div class="loading-spinner large"></div>
				<p>AIが画像を生成中です...</p>
				<p class="loading-subtitle">しばらくお待ちください</p>
			</div>
		</div>
	{/if}

	{#if results.length > 0}
		<div class="results-container">
			<div class="results-header">
				<h2>✨ 生成完了！</h2>
				<div class="stats">
					<span class="stat-item">📊 {imageCount}枚生成</span>
					<span class="stat-item">⏱️ {processingTime.toFixed(2)}秒</span>
				</div>
			</div>

			<div class="results-grid">
				{#each results as img, index}
					<div class="result-card">
						<div class="image-container">
							<img src={img.data_url} alt={`Result ${index + 1}`} class="result-image" />
						</div>
						<div class="result-info">
							<span class="filename">{img.filename}</span>
							<a href={img.data_url} download={img.filename} class="download-btn">
								💾 ダウンロード
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	<a href="/" class="btn tryon-btn">浴衣デザイン</a>
</main>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header h1 {
		font-size: 3rem;
		color: #2c3e50;
		margin-bottom: 1rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	.header p {
		font-size: 1.2rem;
		color: #7f8c8d;
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.form-container {
		background: white;
		border-radius: 20px;
		padding: 2.5rem;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.upload-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.file-input-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.file-input-wrapper {
		position: relative;
	}

	.file-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		border: 3px dashed #e74c3c;
		border-radius: 15px;
		cursor: pointer;
		transition: all 0.3s ease;
		background: linear-gradient(145deg, #fff5f5, #ffe8e8);
	}

	.file-label:hover {
		border-color: #c0392b;
		background: linear-gradient(145deg, #ffe8e8, #ffd6d6);
		transform: translateY(-2px);
	}

	.file-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.file-label span {
		font-size: 1.1rem;
		color: #2c3e50;
		font-weight: 600;
	}

	.file-input {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
		z-index: 1;
		top: 0;
		left: 0;
	}

	.image-preview {
		width: 100%;
		max-height: 250px;
		object-fit: contain;
		border-radius: 10px;
		margin-bottom: 0.5rem;
		background: #f8f9fa;
	}

	.submit-btn {
		background: linear-gradient(135deg, #e74c3c, #c0392b);
		color: white;
		border: none;
		padding: 1.2rem 2rem;
		font-size: 1.2rem;
		border-radius: 50px;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-weight: 600;
		box-shadow: 0 10px 20px rgba(231, 76, 60, 0.3);
		position: relative;
		z-index: 10;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 15px 30px rgba(231, 76, 60, 0.4);
	}

	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.loading-container {
		background: white;
		border-radius: 20px;
		padding: 3rem;
		text-align: center;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.loading-content p {
		font-size: 1.3rem;
		color: #2c3e50;
		margin: 1rem 0 0.5rem 0;
	}

	.loading-subtitle {
		font-size: 1rem !important;
		color: #7f8c8d !important;
	}

	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 3px solid #f3f3f3;
		border-top: 3px solid #e74c3c;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		display: inline-block;
	}

	.loading-spinner.large {
		width: 60px;
		height: 60px;
		border-width: 5px;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.results-container {
		background: white;
		border-radius: 20px;
		padding: 2.5rem;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	.results-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.results-header h2 {
		font-size: 2.5rem;
		color: #27ae60;
		margin-bottom: 1rem;
	}

	.stats {
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	.stat-item {
		background: linear-gradient(135deg, #27ae60, #2ecc71);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 25px;
		font-weight: 600;
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.result-card {
		background: #f8f9fa;
		border-radius: 15px;
		overflow: visible;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		padding: 1rem;
	}

	.result-card:hover {
		transform: translateY(-5px);
	}

	.image-container {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 1rem;
		background: white;
		border-radius: 10px;
		padding: 1rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	}

	.result-image {
		width: 100%;
		height: auto;
		max-height: 500px;
		object-fit: contain;
		border-radius: 10px;
	}

	.result-info {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.filename {
		font-weight: 600;
		color: #2c3e50;
		word-break: break-all;
	}

	.download-btn {
		background: linear-gradient(135deg, #3498db, #2980b9);
		color: white;
		text-decoration: none;
		padding: 0.8rem 1.5rem;
		border-radius: 25px;
		text-align: center;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
	}

	.download-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.header h1 {
			font-size: 2rem;
		}

		.file-input-group {
			grid-template-columns: 1fr;
		}

		.form-container {
			padding: 1.5rem;
		}

		.results-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
