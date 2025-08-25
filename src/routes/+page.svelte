<!-- HTMLの中身だけ書く -->
<html lang="ja">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>浴衣の空</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body>
		<div class="header">
			<div class="logo">浴衣の空</div>
		</div>

		<div class="container">
			<div class="left-box"></div>
			<div class="right-box">
				<div class="inner-right-box"></div>
			</div>
		</div>
	</body>
</html>

<a href="/complete"> 完成ページ </a>

<!-- スタイル(CSS) -->
<style>
	body {
		background-color: #e6e6fa; /* 淡い紫色の背景 */
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		margin: 0;
	}

	.container {
		display: flex;
		gap: 20px;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 1200px; /* 全体の幅を調整 */
		padding: 20px;
		box-sizing: border-box;
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

	.left-box,
	.right-box {
		background-color: #ffffff; /* 白い四角 */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		padding: 20px;
		box-sizing: border-box;
	}

	.left-box {
		width: 400px; /* 左側の四角の幅 */
		height: 500px; /* 左側の四角の高さ */
	}

	.right-box {
		border-radius: 1;
		width: 400px; /* 右側の四角の幅 */
		height: 500px; /* 右側の四角の高さ */
	}
	.inner-right-box {
		background-color: #e6e6fa; /* 内側の四角 */
		border-radius: 15px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
		width: 100%; /* サイズを調整 */
		height: 100%; /* サイズを調整 */
	}
</style>
