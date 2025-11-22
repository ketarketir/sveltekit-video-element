<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { generateId, isBrowser, buildMuxUrl } from '../utils/index.js';
	import type { MuxVideoProps, HlsVideoProps } from '../types/index.js';
	import HlsVideo from './HlsVideo.svelte';

	type $$Props = MuxVideoProps & {
		hlsConfig?: HlsVideoProps['hlsConfig'];
		children?: Snippet;
	};

	let {
		src,
		playbackId,
		streamType = 'on-demand',
		tokens = {},
		thumbnailTime,
		metadata = {},
		beaconCollectionDomain,
		customDomain,
		envKey,
		debug = false,
		disableCookies = false,
		maxResolution,
		minResolution,
		renditionOrder = 'desc',
		programStartTime,
		programEndTime,
		poster,
		autoplay = false,
		controls = true,
		loop = false,
		muted = false,
		preload = 'auto',
		width = '100%',
		height = 'auto',
		crossorigin = 'anonymous',
		playsinline = false,
		hlsConfig = {},
		class: customClass = '',
		children,
		...restProps
	}: $$Props = $props();

	let videoEl = $state<any | null>(null);
	let muxInstance = $state<any | null>(null);
	let videoId = $state<string>(generateId('mux-video'));

	let videoSrc = $derived(
		src ||
			(playbackId
				? buildMuxUrl(playbackId, {
						token: tokens?.playback,
						maxResolution,
						minResolution,
						customDomain
					})
				: undefined)
	);

	let posterUrl = $derived(
		poster ||
			(playbackId && thumbnailTime !== undefined
				? `https://${customDomain || 'image.mux.com'}/${playbackId}/thumbnail.jpg?time=${thumbnailTime}${tokens?.thumbnail ? `&token=${tokens.thumbnail}` : ''}`
				: playbackId
					? `https://${customDomain || 'image.mux.com'}/${playbackId}/thumbnail.jpg${tokens?.thumbnail ? `?token=${tokens.thumbnail}` : ''}`
					: undefined)
	);

	async function initMuxData() {
		if (!isBrowser() || !envKey) return;

		try {
			// Load Mux Data SDK if env_key is provided
			const script = document.createElement('script');
			script.src = 'https://src.litix.io/core/4/mux.js';
			script.async = true;

			script.onload = () => {
				if ((window as any).mux && videoEl) {
					const videoElement = videoEl.getVideoElement ? videoEl.getVideoElement() : videoEl;

					muxInstance = (window as any).mux.monitor(videoElement, {
						debug: debug,
						disableCookies: disableCookies,
						data: {
							env_key: envKey,
							player_name: 'sveltekit-video-elements',
							player_init_time: Date.now(),
							video_id: metadata?.video_id || playbackId,
							video_title: metadata?.video_title,
							video_stream_type: streamType,
							viewer_user_id: metadata?.viewer_user_id,
							...metadata
						},
						...(beaconCollectionDomain && {
							beaconCollectionDomain: beaconCollectionDomain
						})
					});
				}
			};

			document.head.appendChild(script);
		} catch (error) {
			console.error('Failed to initialize Mux Data:', error);
		}
	}

	onMount(() => {
		if (envKey) {
			initMuxData();
		}
	});

	export function getVideoElement() {
		return videoEl?.getVideoElement ? videoEl.getVideoElement() : videoEl;
	}

	export async function play() {
		if (videoEl) {
			if (videoEl.play) {
				await videoEl.play();
			}
		}
	}

	export function pause() {
		if (videoEl) {
			if (videoEl.pause) {
				videoEl.pause();
			}
		}
	}

	export function getMuxInstance() {
		return muxInstance;
	}
</script>

{#if videoSrc}
	<HlsVideo
		bind:this={videoEl}
		id={videoId}
		src={videoSrc}
		poster={posterUrl}
		{autoplay}
		{controls}
		{loop}
		{muted}
		{preload}
		{width}
		{height}
		{crossorigin}
		{playsinline}
		hlsConfig={{
			...hlsConfig,
			xhrSetup: (xhr: any, url: string) => {
				// Add Mux specific headers if needed
				if (renditionOrder) {
					xhr.setRequestHeader('X-Mux-Rendition-Order', renditionOrder);
				}
				if (hlsConfig?.xhrSetup) {
					hlsConfig.xhrSetup(xhr, url);
				}
			}
		}}
		class={customClass}
		{...restProps}
	>
		{#snippet children()}
			{@render children?.()}
		{/snippet}
	</HlsVideo>
{:else}
	<div class="mux-video-placeholder">
		<p>Please provide either 'src' or 'playbackId' prop</p>
	</div>
{/if}

<style>
	.mux-video-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		background-color: #000;
		color: #fff;
		font-family: sans-serif;
	}
</style>
