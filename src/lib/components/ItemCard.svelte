<script lang="ts">
	// ここにJavaScript/TypeScriptのコードを書く
	export let title: string = 'タイトル';
</script>

<button class="content">
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
</style>
