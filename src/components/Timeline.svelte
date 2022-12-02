<script lang="ts">
    import Movie from './Movie.svelte';
    import { slide } from 'svelte/transition';

    let isOpen = false;
    const toggle = () => (isOpen = !isOpen);

    function custom_sort(a, b) {
        return new Date(a.ReleaseDate).getTime() - new Date(b.ReleaseDate).getTime();
    }
    async function fetchReleases() {
        const res = await fetch('/marvel.json');
        const data = await res.json();

        if (res.ok) {
            data.sort(custom_sort);
            let ToDate = new Date();
            const [r_old, r_new] = data.reduce(
                ([r_old, r_new], item) => {
                    (new Date(item.ReleaseDate).getTime() < ToDate.getTime() ? r_old : r_new).push(
                        item,
                    );
                    return [r_old, r_new];
                },
                [[], []],
            );
            r_old.reverse();
            return [r_old, r_new];
        } else {
            throw new Error(data);
        }
    }

    let releases = fetchReleases();
</script>

{#await releases}
    <div class="center">
        <span class="loader" />
    </div>
{:then releases}
    <button on:click={toggle} aria-expanded={isOpen} id="released_button"
        ><svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={isOpen ? 'transform: rotate(180deg)' : ''}
        >
            <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
            />
        </svg>

        Recently Released
    </button>
    {#if isOpen}
        <div id="old_releases" transition:slide={{ duration: 300 }}>
            {#each releases[0] as release}
                <Movie
                    bind:title={release.Title}
                    bind:date={release.ReleaseDate}
                    bind:length={release.FilmLength}
                    bind:poster={release.Poster}
                    bind:tv={release.TV}
                    bind:disneyplus={release.Link}
                />
            {/each}
        </div>
    {/if}
    <div id="new_releases">
        {#each releases[1] as release}
            <Movie
                bind:title={release.Title}
                bind:date={release.ReleaseDate}
                bind:length={release.FilmLength}
                bind:poster={release.Poster}
                bind:tv={release.TV}
                bind:disneyplus={release.Link}
            />
        {/each}
    </div>
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

    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #fff;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    #released_button svg {
        transition: all 0.2s;
        margin-right: 8px;
    }

    #released_button {
        display: flex;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
    }

    #new_releases {
        margin-top: 40px;
    }

    #old_releases {
        background-color: #1f2731;
        padding: 10px;
        border-radius: 10px;
        margin-bottom: 40px;
        box-shadow: inset 0px 6px 10px rgba(0, 0, 0, 0.25);
    }

    #old_releases :global(div:last-child) {
        margin-bottom: 5px;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .center {
        display: flex;
        justify-content: center;
    }
</style>
