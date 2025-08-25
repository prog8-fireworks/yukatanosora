<script lang="ts">
	import ItemCard from '$lib/components/ItemCard.svelte';

	let currentTab = $state('gara');
</script>

<!-- HTMLの中身だけ書く -->
<main class="main">
	<div class="container">
		<nav class="tabs">
			<button
				class="tab {currentTab === 'gara' ? 'active' : ''}"
				onclick={() => (currentTab = 'gara')}>柄</button
			>
			<button
				class="tab {currentTab === 'obi' ? 'active' : ''}"
				onclick={() => (currentTab = 'obi')}>帯</button
			>
			<button
				class="tab {currentTab === 'item' ? 'active' : ''}"
				onclick={() => (currentTab = 'item')}>小物</button
			>
		</nav>

		<!-- タブの内容 -->
		<div class="tab-content">
			{#if currentTab === 'gara'}
				<h2>柄を選ぶところ</h2>
				<ItemCard title="花" />
				<ItemCard title="蝶" />
				<ItemCard title="波" />
				<ItemCard title="星" />
				<ItemCard title="葉" />
				<ItemCard title="幾何学" />
			{:else if currentTab === 'obi'}
				<h2>帯を選ぶところ</h2>
				<ItemCard title="花" />
				<ItemCard title="蝶" />
				<ItemCard title="波" />
				<ItemCard title="星" />
				<ItemCard title="葉" />
				<ItemCard title="幾何学" />
			{:else if currentTab === 'item'}
				<h2>小物を選ぶところ</h2>
				<ItemCard title="花" />
				<ItemCard title="蝶" />
				<ItemCard title="波" />
				<ItemCard title="星" />
				<ItemCard title="葉" />
				<ItemCard title="幾何学" />
			{/if}
		</div>
	</div>
</main>

<!-- スタイル(CSS) -->
<style>
	.main {
		width: 100%;
		max-width: 1000px;
		padding: 0 20px;
	}
	.container {
		width: 100%;
		box-sizing: border-box;
		background-color: white;
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
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}
</style>
