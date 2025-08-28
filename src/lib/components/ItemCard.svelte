<script lang="ts">
	// ここにJavaScript/TypeScriptのコードを書く
	let {
		title = 'タイトル',
		onclick,
		active
	}: { title?: string; onclick?: () => void; active?: boolean } = $props();

	// タイトルごとに対応するアイコン画像をマッピング
	const iconMap: Record<string, string> = {
		// 柄
		水玉: '/icons/dot.png',
		ストライプ: '/icons/stripe.png',
		花柄: '/icons/hana.png',
		青海波: '/icons/naminami.png',

		// 小物
		下駄: '/icons/geta.png',
		日傘: '/icons/higasa.png',
		巾着: '/icons/kintyaku.png',
		帯留め: '/icons/obidome.png'
	};
</script>

<button class="content {active ? 'active' : ''}" {onclick}>
	<div class="icon">
		{#if iconMap[title]}
			<img src={iconMap[title]} alt="{title}アイコン" class="icon-image" />
		{/if}
	</div>
	<h3>{title}</h3>
</button>

<style>
	.content {
		background-color: rgb(201, 201, 201);
		padding: 10px;
		border-radius: 12px;
		text-align: center;
		border: none;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.icon {
		width: 80px;
		height: 80px;
		background-color: white;
		border-radius: 50%;
		overflow: hidden; /* 丸からはみ出さないようにする */
		margin: auto;
		position: relative;
	}

	.icon-image {
		width: 100%;
		height: 100%;
		object-fit: cover; /* 画像を丸にフィットさせる */
	}

	h3 {
		margin: 0;
		padding-top: 8px;
	}

	.content.active {
		background-color: #e1a9be;
	}
</style>
