<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import {
		generateId,
		isBrowser,
		loadScript,
		loadStylesheet,
		waitForGlobal
	} from '../utils/index.js';
	import type { VideoJsVideoProps } from '../types/index.js';

	type $$Props = VideoJsVideoProps;

	let {
		src,
		options = {},
		plugins = {},
		poster,
		autoplay = false,
		controls = true,
		loop = false,
		muted = false,
		preload = 'metadata',
		width = '100%',
		height = 'auto',
		crossorigin = 'anonymous',
		playsinline = true,
		class: playerClass,
		children,
		...restProps
	}: $$Props & {
		children?: Snippet;
	} = $props();

	let videoEl = $state<HTMLVideoElement | null>(null);
	let player = $state<any | null>(null);
	let videoId = $state<string>(generateId('videojs'));
	let isLoaded = $state(false);

	let playerOptions = $derived({
		controls: controls,
		autoplay: autoplay,
		preload: preload,
		loop: loop,
		muted: muted,
		poster: poster,
		width: typeof width === 'number' ? width : undefined,
		height: typeof height === 'number' ? height : undefined,
		fluid: typeof width === 'string' && width === '100%',
		playsinline: playsinline,
		sources: src
			? [
					{
						src: src,
						type: getVideoType(src)
					}
				]
			: [],
		...options
	});

	function getVideoType(url: string): string {
		if (url.includes('.m3u8')) return 'application/x-mpegURL';
		if (url.includes('.mpd')) return 'application/dash+xml';
		if (url.endsWith('.mp4')) return 'video/mp4';
		if (url.endsWith('.webm')) return 'video/webm';
		if (url.endsWith('.ogv')) return 'video/ogg';
		return 'video/mp4';
	}

	async function initPlayer() {
		if (!isBrowser()) return;

		try {
			// Load Video.js library and CSS
			await Promise.all([
				loadScript('https://vjs.zencdn.net/8.10.0/video.min.js', 'videojs-script'),
				loadStylesheet('https://vjs.zencdn.net/8.10.0/video-js.min.css', 'videojs-style')
			]);

			// Wait for videojs to be available
			const videojs = await waitForGlobal('videojs');

			// Initialize player
			player = videojs(videoEl, playerOptions);

			// Load plugins
			Object.keys(plugins).forEach((pluginName) => {
				if (player[pluginName]) {
					player[pluginName](plugins[pluginName]);
				}
			});

			isLoaded = true;

			// Forward events
			player.on('ready', () => {
				videoEl?.dispatchEvent(new CustomEvent('ready', { detail: { player } }));
			});

			player.on('play', () => {
				videoEl?.dispatchEvent(new Event('play'));
			});

			player.on('pause', () => {
				videoEl?.dispatchEvent(new Event('pause'));
			});

			player.on('ended', () => {
				videoEl?.dispatchEvent(new Event('ended'));
			});

			player.on('error', () => {
				const error = player.error();
				videoEl?.dispatchEvent(
					new CustomEvent('error', {
						detail: { error: error ? error.message : 'Unknown error' }
					})
				);
			});

			player.on('timeupdate', () => {
				videoEl?.dispatchEvent(new Event('timeupdate'));
			});

			player.on('volumechange', () => {
				videoEl?.dispatchEvent(new Event('volumechange'));
			});

			player.on('seeking', () => {
				videoEl?.dispatchEvent(new Event('seeking'));
			});

			player.on('seeked', () => {
				videoEl?.dispatchEvent(new Event('seeked'));
			});

			player.on('loadedmetadata', () => {
				videoEl?.dispatchEvent(new Event('loadedmetadata'));
			});

			player.on('loadeddata', () => {
				videoEl?.dispatchEvent(new Event('loadeddata'));
			});

			player.on('canplay', () => {
				videoEl?.dispatchEvent(new Event('canplay'));
			});

			player.on('canplaythrough', () => {
				videoEl?.dispatchEvent(new Event('canplaythrough'));
			});
		} catch (error) {
			console.error('Failed to initialize Video.js:', error);
			videoEl?.dispatchEvent(
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
				player.dispose();
			} catch (error) {
				console.error('Error disposing Video.js player:', error);
			}
		}
	});

	$effect(() => {
		if (player && isLoaded && src) {
			player.src({
				src: src,
				type: getVideoType(src)
			});
		}
	});

	export function getPlayer() {
		return player;
	}

	export async function play() {
		if (player) {
			await player.play();
		}
	}

	export function pause() {
		if (player) {
			player.pause();
		}
	}
</script>

<div data-vjs-player class={playerClass || ''}>
	<video bind:this={videoEl} id={videoId} class="video-js" {crossorigin} {...restProps}>
		{@render children?.()}
	</video>
</div>

<style>
	div[data-vjs-player] {
		width: 100%;
	}
</style>
