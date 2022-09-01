<script>
	import Movie from './Movie.svelte';
	function custom_sort(a, b) {
		return (
			new Date(a.ReleaseDate).getTime() -
			new Date(b.ReleaseDate).getTime()
		);
	}
	async function fetchReleases() {
		const res = await fetch('/marvel.json');
		const data = await res.json();

		if (res.ok) {
			data.sort(custom_sort);
			return data;
		} else {
			throw new Error(data);
		}
	}

	let releases = fetchReleases();
</script>

{#await releases}
	<p>Loading</p>
{:then releases}
	{#each releases as release}
		<Movie
			bind:title={release.Title}
			bind:date={release.ReleaseDate}
			bind:length={release.FilmLength}
			bind:poster={release.Poster}
			bind:thumbnail={release.Thumbnail}
			bind:tv={release.TV}
			bind:disneyplus={release.Link}
		/>
	{/each}
{:catch error}
	<p>An error occurred:<br /> {error}</p>
{/await}

<style>
	p {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;
		font-weight: bold;
		font-size: 3rem;
		text-align: center;
	}
</style>
