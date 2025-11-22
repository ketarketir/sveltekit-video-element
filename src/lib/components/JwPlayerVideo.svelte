<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { generateId, isBrowser, loadScript, waitForGlobal } from '../utils/index.js';
	import type { JwPlayerVideoProps } from '../types/index.js';

	type $$Props = JwPlayerVideoProps;

	let {
		src,
		poster,
		autoplay = false,
		controls = true,
		loop = false,
		muted = false,
		preload = 'metadata',
		width = '100%',
		height = 'auto',
		crossorigin = 'anonymous',
		playsinline = false,
		libraryUrl = 'https://cdn.jwplayer.com/libraries/',
		class: playerClass,
		mediaId,
		playerId,
		config,
		...restProps
	}: $$Props = $props();

	let containerEl = $state<HTMLDivElement | null>(null);
	let player = $state<any | null>(null);
	let playerId_ = $state<string>(generateId('jwplayer'));
	let isLoaded = $state(false);

	let playerConfig = $derived({
		file: src || (mediaId ? `https://cdn.jwplayer.com/manifests/${mediaId}.m3u8` : undefined),
		image: poster,
		autostart: autoplay,
		controls: controls,
		repeat: loop,
		mute: muted,
		preload: preload,
		width: width,
		height: height,
		playsinline: playsinline,
		...config
	});

	async function initPlayer() {
		if (!isBrowser()) return;

		try {
			// Load JW Player library if not already loaded
			if (!playerId) {
				throw new Error('JW Player playerId is required');
			}

			const scriptUrl = `${libraryUrl}${playerId}.js`;
			await loadScript(scriptUrl, `jwplayer-script-${playerId}`);

			// Wait for jwplayer to be available
			const jwplayer = await waitForGlobal('jwplayer');

			// Initialize player
			player = jwplayer(playerId_);
			player.setup(playerConfig);

			isLoaded = true;

			// Forward events
			player.on('ready', () => {
				containerEl?.dispatchEvent(new CustomEvent('ready', { detail: { player } }));
			});

			player.on('play', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('play', { detail: e }));
			});

			player.on('pause', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('pause', { detail: e }));
			});

			player.on('complete', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('ended', { detail: e }));
			});

			player.on('error', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('error', { detail: e }));
			});

			player.on('time', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('timeupdate', { detail: e }));
			});

			player.on('seek', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('seeking', { detail: e }));
			});

			player.on('seeked', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('seeked', { detail: e }));
			});

			player.on('volume', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('volumechange', { detail: e }));
			});

			player.on('mute', (e: any) => {
				containerEl?.dispatchEvent(new CustomEvent('volumechange', { detail: e }));
			});
		} catch (error) {
			console.error('Failed to initialize JW Player:', error);
			containerEl?.dispatchEvent(
				new CustomEvent('error', {
					detail: { error: error instanceof Error ? error.message : 'Unknown error' }
				})
			);
		}
	}

	onMount(() => {
		initPlayer();
	});

	onDestroy(() => {
		if (player) {
			try {
				player.remove();
			} catch (error) {
				console.error('Error removing JW Player:', error);
			}
		}
	});

	$effect(() => {
		if (player && isLoaded) {
			player.load(playerConfig);
		}
	});

	export function getPlayer() {
		return player;
	}
</script>

<div bind:this={containerEl} id={playerId_} class={playerClass} {...restProps as any}>
	{#if !isBrowser()}
		<div
			class="flex items-center justify-center bg-black text-white dark:bg-white dark:text-black"
			style="width: {width}; height: {height};"
		>
			<p>Video player loading...</p>
		</div>
	{/if}
</div>

<style>
	.video-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #000;
		color: #fff;
	}
</style>
