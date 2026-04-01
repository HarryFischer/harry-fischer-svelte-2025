<script>
	import { onMount } from "svelte";
	import ScrollGallery from "./lib/ScrollGallery.svelte";

	let isLoading = true;
	let isFading = false;

	// Use Vite's BASE_URL to construct proper asset paths for GitHub Pages
	const baseUrl = import.meta.env.BASE_URL;
	const asset = (path) => `${baseUrl}assets/${path}`;

	const items = [
		{
			id: 3,
			backgroundColor: "#3399FF",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("cubs-0.webp"),
					caption:
						"The Black Panther Cubs — When The Revolution Doesn't Come, The Guardian",
				},
				{
					type: "video",
					src: asset("cubs-titles.mp4"),
					poster: asset("cubs-titles-poster.webp"),
					caption: "Opening titles sequence",
				},
				{
					type: "video",
					src: asset("cubs-credits.mp4"),
					poster: asset("cubs-credits-poster.webp"),
					caption: "End credits sequence",
				},
				{
					type: "image",
					src: asset("Cubs-1.webp"),
					caption: "Article design and development",
				},
				{
					type: "image",
					src: asset("cubs-poster.webp"),
					caption: "Doc poster",
				},
			],
			title: "The Black Panther Cubs — When The Revolution Doesn't Come",
		},
		{
			id: 2,
			backgroundColor: "#ff5900",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("bedside-cover.webp"),
					caption: "The Bedside Guardian 2025",
				},
				{
					type: "image",
					src: asset("bedside-back.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("bedside-3.webp"),
					caption: " ",
				},
			],
			title: "The Bedside Guardian 2025",
		},

		{
			id: 11,
			backgroundColor: "#2C2C26",
			textColor: "#fff",
			media: [
				{
					type: "video",
					src: asset("cub-sans-vid.mp4"),
					poster: asset("cub-sans-vid-poster.webp"),
					caption: "Cub Sans, a new display typeface for The Guardian",
				},
				{
					type: "image",
					src: asset("cub-sans-char-1.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("cub-sans-char-2.webp"),
					caption: " ",
				},
				{
					type: "video",
					src: asset("cub-sans-website.mp4"),
					poster: asset("cub-sans-website-poster.webp"),
					caption: "Specimen website design.theguardian.com/cub-sans",
				},
			],
			title: "Guardian Cub Sans",
		},
		{
			id: 4,
			backgroundColor: "#2B503C",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("elec-artwork-1.webp"),
					caption: "Election artwork",
				},
				{
					type: "image",
					src: asset("elec-artwork-2.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("elec-artwork-3.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("elec-artwork-4.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("elec-artwork-5.webp"),
					caption: " ",
				},
			],
			title: "UK and US Elections artwork",
		},
		{
			id: 12,
			backgroundColor: "#1a1a1a",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("election-1.webp"),
					caption: "Election results page",
				},
				{
					type: "image",
					src: asset("election-2.webp"),
					caption: "Constituency breakdown",
				},
				{
					type: "image",
					src: asset("election-3.webp"),
					caption: "Live results map",
				},
				{
					type: "image",
					src: asset("election-4.webp"),
					caption: "Party seat tracker",
				},
				{
					type: "image",
					src: asset("election-5.webp"),
					caption: "Results table",
				},
				{
					type: "image",
					src: asset("election-6.webp"),
					caption: "Mobile results view",
				},
				{
					type: "image",
					src: asset("election-7.webp"),
					caption: "US results dashboard",
				},
				{
					type: "image",
					src: asset("election-8.webp"),
					caption: "State-by-state breakdown",
				},
			],
			title: "UK and US Elections UI",
		},
		{
			id: 13,
			backgroundColor: "#1a1a1a",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("cc-cover.webp"),
					caption:
						"Cotton Capital: how slavery changed the Guardian, Britain and the world, The Guardian",
				},
				{
					type: "image",
					src: asset("cc-weave-close.webp"),
					caption: "Weave detail",
				},
			],
			title: "Cotton Capital — the weave",
		},
		{
			id: 1,
			backgroundColor: "#B7B7B7",
			textColor: "#000",
			type: "video",
			src: asset("2035-agi.mp4"),
			poster: asset("agi-2035-poster.webp"),
			title: "AGI 2035",
			caption: "Comic book article design and development",
		},
		{
			id: 5,
			backgroundColor: "#dc2626",
			textColor: "#fff",
			type: "video",
			src: asset("ukraine-skateboarding.mp4"),
			poster: asset("ukraine-skateboarding-poster.webp"),
			title: "Ukraine Skateboarding",
			caption: "Photoessay design and development",
		},
		{
			id: 6,
			backgroundColor: "#2C1C15",
			textColor: "#fff",
			media: [
				{
					type: "video",
					src: asset("okinawa-1.mp4"),
					poster: asset("okinawa-1-poster.webp"),
					caption: "Opening sequence",
				},
				{
					type: "image",
					src: asset("okinawa-2.webp"),
					caption: "Chapter title",
				},
				{
					type: "image",
					src: asset("okinawa-3.webp"),
					caption: "Body text layout",
				},
				{
					type: "image",
					src: asset("okinawa-4.webp"),
					caption: "Photo essay spread",
				},
				{
					type: "image",
					src: asset("okinawa-5.webp"),
					caption: "Pull quote design",
				},
			],
			title: "Okinawa: The bone hunter",
		},
		// {
		// 	id: 7,
		// 	backgroundColor: "#091BC5",
		// 	textColor: "#fff",
		// 	media: [
		// 		{
		// 			type: "image",
		// 			src: asset("alex-1.jpg"),
		// 		},
		// 		{
		// 			type: "image",
		// 			src: asset("alex-2.jpg"),
		// 		},
		// 		{
		// 			type: "video",
		// 			src: asset("alex-3.mp4"),
		// 			poster: asset("alex-3-poster.jpg"),
		// 		},
		// 		{
		// 			type: "image",
		// 			src: asset("alex-4.jpg"),
		// 		},
		// 		{
		// 			type: "image",
		// 			src: asset("alex-5.jpg"),
		// 		},
		// 		{
		// 			type: "image",
		// 			src: asset("alex-6.jpg"),
		// 		},
		// 		{
		// 			type: "video",
		// 			src: asset("alex-7.mp4"),
		// 			poster: asset("alex-7-poster.jpg"),
		// 		},
		// 	],
		// 	title: "Alex Mourant website",
		// },
		{
			id: 8,
			backgroundColor: "#2C2C26",
			textColor: "#fff",
			type: "video",
			src: asset("press-vest.mp4"),
			poster: asset("press-vest-poster.webp"),
			title: "The deadly toll on journalists in the Gaza war",
			caption: "Motion and art direction, The Guardian",
		},
		{
			id: 9,
			backgroundColor: "tomato",
			textColor: "#fff",
			type: "image",
			src: asset("carbon-bombs-world.webp"),
			title: "Carbon bombs",
			caption: "Data visualisation and illustration, The Guardian",
		},
		{
			id: 10,
			backgroundColor: "#2C2C26",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("fedrigoni-cal.webp"),
					caption: "Calendar spread",
				},
				{
					type: "image",
					src: asset("fedrigoni.webp"),
					caption: "Paper stock detail",
				},
			],
			title: "Fedrigoni Calendar 2025",
		},
	];

	const finishLoading = () => {
		if (!isLoading) return;
		isFading = true;
		setTimeout(() => {
			isLoading = false;
		}, 300);
	};

	onMount(() => {
		if (document.readyState === "complete") {
			finishLoading();
			return;
		}

		const handleLoad = () => {
			finishLoading();
		};

		window.addEventListener("load", handleLoad, { once: true });
		return () => window.removeEventListener("load", handleLoad);
	});
</script>

{#if isLoading}
	<div class="loading-screen" class:is-fading={isFading} aria-live="polite">
		<div class="loading-text">
			Loading<span class="loading-dots" aria-hidden="true"></span>
		</div>
	</div>
{/if}

<ScrollGallery {items} />

<style lang="scss">
	@use "./styles/main.scss" as *;
</style>
