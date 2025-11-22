<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';
	import { generateId, isBrowser } from '../utils/index.js';
	import type { HlsVideoProps } from '../types/index.js';

	type $$Props = HlsVideoProps & {
		children?: Snippet;
	};

	let {
		src,
		hlsConfig = {},
		poster,
		autoplay = false,
		controls = true,
		loop = false,
		muted = false,
		preload = 'metadata',
		width = '100%',
		height = 'auto',
		crossorigin,
		playsinline = false,
		onhlsmanifestparsed,
		onhlslevelswitched,
		onhlsfragloaded,
		onhlserror,
		class: customClass = '',
		children,
		...restProps
	}: $$Props = $props();

	let videoEl = $state<HTMLVideoElement | null>(null);
	let hls = $state<any>(null);
	let videoId = $state<string>(generateId('hls-video'));
	let isHlsSupported = $state<boolean>(false);

	async function initHls() {
		if (!isBrowser() || !src || !videoEl) return;

		try {
			// Dynamic import hls.js
			const Hls = (await import('hls.js')).default;

			isHlsSupported = Hls.isSupported();

			if (isHlsSupported) {
				hls = new Hls({
					...hlsConfig
				});

				hls.loadSource(src);
				hls.attachMedia(videoEl);

				// Forward HLS events
				hls.on(Hls.Events.MANIFEST_PARSED, (event: any, data: any) => {
					const customEvent = new CustomEvent('hlsmanifestparsed', { detail: data });
					videoEl?.dispatchEvent(customEvent);
					onhlsmanifestparsed?.(customEvent);

					if (autoplay) {
						videoEl?.play().catch((error) => {
							console.error('Autoplay failed:', error);
						});
					}
				});

				hls.on(Hls.Events.ERROR, (event: any, data: any) => {
					console.error('HLS error:', data);

					const customEvent = new CustomEvent('hlserror', {
						detail: { error: data.type, fatal: data.fatal, details: data.details }
					});
					videoEl?.dispatchEvent(customEvent);
					onhlserror?.(customEvent);

					if (data.fatal) {
						switch (data.type) {
							case Hls.ErrorTypes.NETWORK_ERROR:
								console.error('Fatal network error encountered, trying to recover');
								hls.startLoad();
								break;
							case Hls.ErrorTypes.MEDIA_ERROR:
								console.error('Fatal media error encountered, trying to recover');
								hls.recoverMediaError();
								break;
							default:
								console.error('Fatal error, cannot recover');
								hls.destroy();
								break;
						}
					}
				});

				hls.on(Hls.Events.LEVEL_SWITCHED, (event: any, data: any) => {
					const customEvent = new CustomEvent('hlslevelswitched', { detail: data });
					videoEl?.dispatchEvent(customEvent);
					onhlslevelswitched?.(customEvent);
				});

				hls.on(Hls.Events.FRAG_LOADED, (event: any, data: any) => {
					const customEvent = new CustomEvent('hlsfragloaded', { detail: data });
					videoEl?.dispatchEvent(customEvent);
					onhlsfragloaded?.(customEvent);
				});
			} else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
				// Native HLS support (Safari)
				videoEl.src = src;
			} else {
				console.error('HLS is not supported in this browser');
				videoEl?.dispatchEvent(
					new CustomEvent('error', {
						detail: { error: 'HLS not supported' }
					})
				);
			}
		} catch (error) {
			console.error('Failed to initialize HLS:', error);
			videoEl?.dispatchEvent(
				new CustomEvent('error', {
					detail: { error: error instanceof Error ? error.message : 'Unknown error' }
				})
			);
		}
	}

	onMount(() => {
		initHls();
	});

	onDestroy(() => {
		if (hls) {
			try {
				hls.destroy();
			} catch (error) {
				console.error('Error destroying HLS instance:', error);
			}
		}
	});

	$effect(() => {
		if (isBrowser() && src && videoEl) {
			if (hls) {
				hls.destroy();
			}
			initHls();
		}
	});

	export function getHls() {
		return hls;
	}

	export function getVideoElement() {
		return videoEl;
	}

	export async function play() {
		if (videoEl) {
			await videoEl.play();
		}
	}

	export function pause() {
		if (videoEl) {
			videoEl.pause();
		}
	}

	export function getCurrentLevel() {
		if (hls) {
			return hls.currentLevel;
		}
		return -1;
	}

	export function setCurrentLevel(level: number) {
		if (hls) {
			hls.currentLevel = level;
		}
	}

	export function getLevels() {
		if (hls) {
			return hls.levels;
		}
		return [];
	}
</script>

<video
	bind:this={videoEl}
	id={videoId}
	{poster}
	{controls}
	{loop}
	{muted}
	{preload}
	{width}
	{height}
	{crossorigin}
	{playsinline}
	class={customClass}
	{...restProps}
>
	{#if !isHlsSupported && src}
		<source {src} type="application/vnd.apple.mpegurl" />
	{/if}
	{@render children?.()}
	<track kind="captions" />
</video>

<style>
	video {
		max-width: 100%;
		height: auto;
	}
</style>
