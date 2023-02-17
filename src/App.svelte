<script lang="ts">
    import Timeline from './components/Timeline.svelte';
</script>

<div id="logo">
    <h2>Upcoming</h2>
    <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/2560px-Marvel_Logo.svg.png"
        alt="Marvel Logo"
    />
    <h2>Releases</h2>
</div>
<p id="subtitle">A small project maintained by <a href="https://maxwilson.co.uk/">Max Wilson</a></p>
<Timeline />

<style>
    #logo {
        display: flex;
        margin: auto;
        width: 100%;
        height: auto;
        margin-bottom: 10px;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    #logo img {
        width: 25%;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        margin-left: 1em;
        margin-right: 1em;
    }

    #subtitle {
        margin: auto;
        width: 100%;
        height: auto;
        margin-bottom: 40px;
        text-align: center;
        color: rgb(199, 199, 199);
    }

    #subtitle a {
        font-weight: bold;
        text-decoration: none;
        color: inherit;
    }

    #subtitle a:hover {
        color: white;
    }
</style>
