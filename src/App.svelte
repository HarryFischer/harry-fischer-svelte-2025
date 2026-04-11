<script>
	import ScrollGallery from "./lib/ScrollGallery.svelte";

	// Use Vite's BASE_URL to construct proper asset paths for GitHub Pages
	const baseUrl = import.meta.env.BASE_URL;
	const asset = (path) => `${baseUrl}assets/${path}`;

	const items = [
		{
			id: 3,
			backgroundColor: "#3399FF",
			textColor: "#fff",
			media: [
				// {
				// 	type: "image",
				// 	src: asset("cubs-0.webp"),
				// 	caption:
				// 		"The Black Panther Cubs — When The Revolution Doesn't Come, The Guardian",
				// },
				{
					type: "video",
					src: asset("cubs-titles.mp4"),
					poster: asset("cubs-titles-poster.webp"),
					caption:
						"The Black Panther Cubs — When The Revolution Doesn't Come titles",
				},
				{
					type: "video",
					src: asset("cubs-credits.mp4"),
					poster: asset("cubs-credits-poster.webp"),
					caption: "Thirds / credits",
				},
				// {
				// 	type: "image",
				// 	src: asset("Cubs-1.webp"),
				// 	caption: "Article design and development",
				// },
				{
					type: "image",
					src: asset("cubs-poster.webp"),
					caption: "Poster",
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
				// {
				// 	type: "image",
				// 	src: asset("bedside-3.webp"),
				// 	caption: " ",
				// },
			],
			title: "The Bedside Guardian 2025",
		},
		{
			id: 11,
			backgroundColor: "#2C2C26",
			textColor: "#fff",
			type: "video",
			src: asset("cub-sans-website.mp4"),
			poster: asset("cub-sans-website-poster.webp"),
			title: "Guardian Cub Sans",
			caption:
				"Cub Sans, a new display typeface for The Guardian: design.theguardian.com/cub-sans",
		},
		// {
		// 	id: 11,
		// 	backgroundColor: "#2C2C26",
		// 	textColor: "#fff",
		// 	media: [
		// 		{
		// 			type: "video",
		// 			src: asset("cub-sans-vid.mp4"),
		// 			poster: asset("cub-sans-vid-poster.webp"),
		// 			caption: "Cub Sans, a new display typeface for The Guardian",
		// 		},
		// 		{
		// 			type: "image",
		// 			src: asset("cub-sans-char-1.webp"),
		// 			caption: " ",
		// 		},
		// 		{
		// 			type: "image",
		// 			src: asset("cub-sans-char-2.webp"),
		// 			caption: " ",
		// 		},
		// 		{
		// 			type: "video",
		// 			src: asset("cub-sans-website.mp4"),
		// 			poster: asset("cub-sans-website-poster.webp"),
		// 			caption: "Specimen website design.theguardian.com/cub-sans",
		// 		},
		// 	],
		// 	title: "Guardian Cub Sans",
		// },
		{
			id: 4,
			backgroundColor: "#2B503C",
			textColor: "#fff",
			media: [
				{
					type: "video",
					src: asset("election-showreel-compressed.mp4"),
					poster: asset("election-showreel-compressed-poster.webp"),
					caption: "UK Election 2024",
				},
				{
					type: "image",
					src: asset("elec-artwork-1.webp"),
					caption: " ",
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
			id: 13,
			backgroundColor: "#1a1a1a",
			textColor: "#fff",
			media: [
				{
					type: "video",
					hasAudio: true,
					src: asset("230319_Cotton-Capital-V3.mp4"),
					poster: asset("230319_Cotton-Capital-V3-poster.webp"),
					caption:
						"Cotton Capital: how slavery changed the Guardian, Britain and the world, The Guardian",
				},
				{
					type: "image",
					src: asset("cc-weave-close.webp"),
					caption: "Weave detail",
				},
				{
					type: "video",
					hasAudio: false,
					src: asset("weave-cc.mp4"),
					poster: asset("weave-cc-poster.webp"),
					caption: " ",
				},
			],
			title: "Cotton Capital — the weave",
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
			id: 1,
			backgroundColor: "#B7B7B7",
			textColor: "#fff",
			media: [
				{
					type: "video",
					src: asset("2035-agi.mp4"),
					poster: asset("agi-2035-poster.webp"),
					caption: "How will AI change your life in 2035?",
				},
				{
					type: "image",
					src: asset("jay-1.webp"),
					caption: "Commissioned comic strips by Jay Cover",
				},
				{
					type: "image",
					src: asset("jay-2.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("jay-3.webp"),
					caption: " ",
				},
			],
		},
		{
			id: 5,
			backgroundColor: "#dc2626",
			textColor: "#fff",
			type: "video",
			src: asset("ukraine-skateboarding.mp4"),
			poster: asset("ukraine-skateboarding-poster.webp"),
			title: "Ukraine Skateboarding",
			caption: "Photoessay exploring Ukraine's skateboarding culture",
		},
		{
			id: 6,
			backgroundColor: "#2C1C15",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("okinawa-poster-cropped.webp"),
					caption: "Okinawa documentary film poster",
				},
				{
					type: "video",
					src: asset("okinawa-1.mp4"),
					poster: asset("okinawa-1-poster.webp"),
					caption: "Mud type",
				},
				{
					type: "image",
					src: asset("okinawa-2.webp"),
					caption: "Titles, thirds and credits",
				},
				{
					type: "image",
					src: asset("okinawa-3.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("okinawa-4.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("okinawa-5.webp"),
					caption: " ",
				},
				{
					type: "image",
					src: asset("okinawa-alt-poster.webp"),
					caption: " ",
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
			caption:
				"Art direction for a piece on the deadly toll on journalists in Gaza",
		},
		{
			id: 9,
			backgroundColor: "tomato",
			textColor: "#fff",
			type: "image",
			src: asset("carbon-bombs-world.webp"),
			title: "Carbon bombs",
			caption: "Carbon bombs artwork",
		},
		{
			id: 10,
			backgroundColor: "#2C2C26",
			textColor: "#fff",
			type: "image",
			src: asset("fedrigoni-cal.webp"),
			title: "Fedrigoni Calendar 2025",
			caption: "Fedrigoni Calendar 2025",
		},
	];
</script>

<ScrollGallery {items} />

<style lang="scss">
	@use "./styles/main.scss" as *;
</style>
