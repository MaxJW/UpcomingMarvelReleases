<script lang="ts">
    import Movie from './Movie.svelte';
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';
    import type { MarvelRelease, GroupedReleases } from '../types';

    let isLoading = true;
    let error: Error | null = null;
    let isOpen = false;
    let releases: GroupedReleases = {
        released: [],
        upcoming: [],
        latest: null,
    };

    const toggle = () => (isOpen = !isOpen);

    // More efficient data processing
    async function fetchReleases(): Promise<GroupedReleases> {
        try {
            // Import the data (in a real app, this would be an API call)
            const marvelData = await import('../marvel.json').then(
                (m) => m.default as MarvelRelease[],
            );

            // Sort by release date (safely handling null dates)
            const sortedData = [...marvelData].sort((a, b) => {
                if (a.release_date === null) return 1;
                if (b.release_date === null) return -1;
                return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
            });

            const currentDate = new Date();
            const released: MarvelRelease[] = [];
            const upcoming: MarvelRelease[] = [];

            // Group into released and upcoming
            sortedData.forEach((item) => {
                if (item.release_date === null) {
                    upcoming.push(item);
                } else {
                    const releaseDate = new Date(item.release_date);
                    if (releaseDate.getTime() < currentDate.getTime()) {
                        released.push(item);
                    } else {
                        upcoming.push(item);
                    }
                }
            });

            // Reverse the released list to show newest first
            released.reverse();

            // Get the latest release (first item in released)
            const latest = released.length > 0 ? released[0] : null;

            // Remove the latest from the released list to avoid duplication
            const otherReleased = released.slice(1);

            return {
                released: otherReleased,
                upcoming,
                latest,
            };
        } catch (err) {
            console.error('Error fetching Marvel releases:', err);
            throw err instanceof Error ? err : new Error('Failed to load Marvel releases');
        }
    }

    // Use onMount for data fetching
    onMount(async () => {
        try {
            isLoading = true;
            releases = await fetchReleases();
        } catch (err) {
            error = err instanceof Error ? err : new Error('Unknown error occurred');
        } finally {
            isLoading = false;
        }
    });

    // Handler to retry loading data
    const refreshData = async () => {
        try {
            isLoading = true;
            error = null;
            releases = await fetchReleases();
        } catch (err) {
            error = err instanceof Error ? err : new Error('Unknown error occurred');
        } finally {
            isLoading = false;
        }
    };
</script>

{#if isLoading}
    <div class="center">
        <span class="loader" aria-hidden="true"></span>
        <span class="visually-hidden">Loading Marvel releases...</span>
    </div>
{:else if error}
    <div class="error-container" role="alert">
        <h2>Something went wrong</h2>
        <p>We couldn't load the Marvel releases: {error.message}</p>
        <button on:click={refreshData}> Try Again </button>
    </div>
{:else}
    <button on:click={toggle} aria-expanded={isOpen} id="released_button">
        <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={isOpen ? 'transform: rotate(180deg)' : ''}
            aria-hidden="true"
        >
            <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
            />
        </svg>
        <span>Recently Released</span>
    </button>

    {#if isOpen}
        <div
            id="old_releases"
            transition:slide={{ duration: 300 }}
            aria-label="Past Marvel releases"
        >
            {#each releases.released as release (release.title)}
                <Movie
                    title={release.title}
                    date={release.release_date}
                    runtime={release.runtime}
                    poster={release.poster}
                    disneyplus={release.link}
                />
            {/each}

            {#if releases.released.length === 0}
                <p class="empty-message">No past releases found.</p>
            {/if}
        </div>
    {/if}

    <div id="new_releases" aria-label="Upcoming and latest Marvel releases">
        {#if releases.latest}
            <Movie
                title={releases.latest.title}
                date={releases.latest.release_date}
                runtime={releases.latest.runtime}
                poster={releases.latest.poster}
                disneyplus={releases.latest.link}
                latest={true}
            />
        {/if}

        {#each releases.upcoming as release (release.title)}
            <Movie
                title={release.title}
                date={release.release_date}
                runtime={release.runtime}
                poster={release.poster}
                disneyplus={release.link}
            />
        {/each}

        {#if releases.upcoming.length === 0}
            <p class="empty-message">No upcoming releases found.</p>
        {/if}
    </div>
{/if}

<style>
    /* Improved loading state */
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem 0;
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

    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    /* Error display */
    .error-container {
        text-align: center;
        padding: 2rem;
        background-color: rgba(255, 0, 0, 0.1);
        border-radius: 10px;
        margin: 2rem 0;
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

    /* Container styling */
    #new_releases {
        margin-top: 40px;
    }

    #old_releases {
        background-color: #1f2731;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 40px;
        box-shadow: inset 0px 6px 10px rgba(0, 0, 0, 0.25);
    }

    .empty-message {
        text-align: center;
        padding: 1rem;
        color: var(--text-muted);
        font-style: italic;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    /* Responsive adjustments */
    @media (max-width: 480px) {
        #old_releases {
            padding: 10px;
        }

        #released_button {
            width: 100%;
            justify-content: center;
        }
    }
</style>
