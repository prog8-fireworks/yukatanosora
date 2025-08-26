<script lang="ts">
	import ItemCard from '$lib/components/ItemCard.svelte';

	let currentTab = $state('gara');
</script>

<!-- HTMLの中身だけ書く -->
<main class="main">
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
					<div class="item-grid">
						<ItemCard title="花" />
						<ItemCard title="蝶" />
						<ItemCard title="波" />
						<ItemCard title="星" />
						<ItemCard title="葉" />
						<ItemCard title="幾何学" />
					</div>
				{:else if currentTab === 'obi'}
					<h2>帯を選ぶところ</h2>
					<div class="item-grid">
						<ItemCard title="花" />
						<ItemCard title="蝶" />
						<ItemCard title="波" />
						<ItemCard title="星" />
						<ItemCard title="葉" />
						<ItemCard title="幾何学" />
					</div>
				{:else if currentTab === 'item'}
					<h2>小物を選ぶところ</h2>
					<div class="item-grid">
						<ItemCard title="花" />
						<ItemCard title="蝶" />
						<ItemCard title="波" />
						<ItemCard title="星" />
						<ItemCard title="葉" />
						<ItemCard title="幾何学" />
					</div>
				{/if}
			</div>
		</div>
		<div class="right-box">
			<div class="inner-right-box"></div>
		</div>
	</div>
	<a href="/complete"> 完成ページ </a>
</main>

<!-- スタイル(CSS) -->
<style>
	h2 {
		margin: 0;
	}
	.main {
		width: 100%;
	}
	.container {
		display: flex;
		gap: 40px;
		width: 100%;
		max-width: 1200px; /* 全体の幅を調整 */
		padding: 20px;
		box-sizing: border-box;
		margin: 0 auto; /* 中央寄せ */
	}

	.header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		position: absolute;
		top: 0;
		padding: 20px;
	}

	.logo {
		font-size: 24px;
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
	}

	.item-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
		color: #555;
		margin-top: 12px;
	}

	.left-box {
		background-color: #ffffff; /* 白い四角 */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		width: 50%; /* 左右の幅を調整 */
	}

	.right-box {
		background-color: #ffffff; /* 白い四角 */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		padding: 20px;
		box-sizing: border-box;
		width: 50%; /* 左右の幅を調整 */
	}
	.inner-right-box {
		background-color: #e6e6fa; /* 内側の四角 */
		border-radius: 15px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
		width: 100%; /* サイズを調整 */
		height: 100%; /* サイズを調整 */
	}
</style>
