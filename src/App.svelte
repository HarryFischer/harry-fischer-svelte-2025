<script>
	import PanningCanvas from "./lib/PanningCanvas.svelte";

	const base = import.meta.env.BASE_URL;
	const items = [
		{ id: 1, type: "video", src: `${base}agi-2035.mp4` },
		{ id: 2, type: "image", src: `${base}beside-2025.png` },
		{ id: 3, type: "video", src: `${base}ukraine-skateboarding.mp4` },
		{ id: 4, type: "video", src: `${base}cubs-titles.mp4` },
		{ id: 5, type: "image", src: `${base}cubs-poster.jpg` },
	];

	// Create a grid of 8 columns x 6 rows = 48 cells
	const gridCols = 8;
	const gridRows = 6;
	const totalCells = gridCols * gridRows;
	
	// Center cell (where text will be) - span 3 cols x 2 rows
	// To center a 3-col span in 8 cols: start at col 2 (index 2) or col 3 (index 3)
	// To center a 2-row span in 6 rows: start at row 2 (index 2)
	const textStartCol = Math.floor((gridCols - 3) / 2); // Start col for 3-col span
	const textStartRow = Math.floor((gridRows - 2) / 2); // Start row for 2-row span
	const textStartCell = textStartRow * gridCols + textStartCol;
	
	// Reserve cells for the text (3 cols x 2 rows = 6 cells)
	const centerCells = [];
	for (let row = 0; row < 2; row++) {
		for (let col = 0; col < 3; col++) {
			centerCells.push((textStartRow + row) * gridCols + (textStartCol + col));
		}
	}

	// Generate random cell positions for items, avoiding center
	const getRandomCells = () => {
		const availableCells = [];
		for (let i = 0; i < totalCells; i++) {
			if (!centerCells.includes(i)) {
				availableCells.push(i);
			}
		}
		
		// Shuffle and pick cells for items
		const shuffled = availableCells.sort(() => Math.random() - 0.5);
		return items.map((item, index) => ({
			...item,
			cell: shuffled[index]
		}));
	};

	const itemsWithCells = getRandomCells();

	const handleVideoHover = (event, play) => {
		const video = event.currentTarget;
		if (play) {
			video.play();
		} else {
			video.pause();
		}
	};
</script>

<PanningCanvas>
	<div class="grid-container">
		{#each Array(totalCells) as _, cellIndex}
			{@const item = itemsWithCells.find(i => i.cell === cellIndex)}
			{@const isTextStart = cellIndex === textStartCell}
			{@const isCenterCell = centerCells.includes(cellIndex)}
			
			{#if isTextStart}
				<!-- Text cell spans 3 cols x 2 rows -->
				<div class="grid-cell center-text-cell">
					<div class="center-text">
						<h1>Harry Fischer</h1>
						<p>Lead Designer & Developer</p>
						<a
							href="https://instagram.com/harrryfischer"
							target="_blank"
							rel="noopener noreferrer">@harrryfischer</a
						>
					</div>
				</div>
			{:else if isCenterCell}
				<!-- Skip cells covered by the spanning text cell -->
			{:else if item}
				<div class="grid-cell canvas-item">
					{#if item.type === "video"}
						<video
							src={item.src}
							muted
							loop
							preload="metadata"
							on:mouseenter={(e) => handleVideoHover(e, true)}
							on:mouseleave={(e) => handleVideoHover(e, false)}
						/>
					{:else}
						<img src={item.src} alt="Portfolio item {item.id}" />
					{/if}
				</div>
			{:else}
				<div class="grid-cell empty"></div>
			{/if}
		{/each}
	</div>
</PanningCanvas>

<style lang="scss">
	@import "./styles/main.scss";
</style>
