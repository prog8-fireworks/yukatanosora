<script lang="ts">
	// ここにJavaScript/TypeScriptのコードを書く
	let {
		title = 'タイトル',
		onclick,
		active
	}: { title?: string; onclick?: () => void; active?: boolean } = $props();
</script>

<button class="content {active ? 'active' : ''}" {onclick}>
	<div class="icon"></div>
	<h3>{title}</h3>
</button>

<style>
	.content {
		background-color: rgb(201, 201, 201);
		padding: 10px;
		border-radius: 12px;
		text-align: center;
		border: none;
	}

	.icon {
		width: 80px;
		height: 80px;
		background-color: white;
		border-radius: 100%;
		margin: auto;
	}
	h3 {
		margin: 0;
		padding-top: 8px;
	}

	.content.active {
		background-color: #e1a9be;
	}
</style>
