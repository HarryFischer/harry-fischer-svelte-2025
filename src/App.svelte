<script>
	import ScrollGallery from "./lib/ScrollGallery.svelte";

	const items = Array.from({ length: 12 }, (_, i) => ({
		id: i + 1,
		backgroundColor: `hsl(${(i * 30) % 360}, 70%, 60%)`,
		title: `Item ${i + 1}`,
	}));
</script>

<ScrollGallery {items} />

<style lang="scss">
	@use "./styles/main.scss" as *;
</style>
