<script lang="ts">
	import type { Snippet } from 'svelte';
	import { generateId, isBrowser, buildCloudinaryUrl } from '../utils/index.js';
	import type { CloudinaryVideoProps } from '../types/index.js';

	type $$Props = CloudinaryVideoProps & {
		children?: Snippet;
	};

	let {
		src,
		cloudName,
		publicId,
		transformation = {},
		sourceTypes = ['mp4', 'webm', 'ogv'],
		secure = true,
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
		class: customClass = '',
		children,
		...restProps
	}: $$Props = $props();

	let videoEl = $state<HTMLVideoElement | null>(null);
	let videoId = $state<string>(generateId('cloudinary-video'));

	let videoSources = $derived(
		sourceTypes.map((format) => {
			const transformWithFormat = { ...transformation, format };
			return {
				src: buildCloudinaryUrl(cloudName, publicId, transformWithFormat, secure),
				type: `video/${format === 'ogv' ? 'ogg' : format}`
			};
		})
	);
	let posterUrl = $derived(
		poster ||
			buildCloudinaryUrl(
				cloudName,
				publicId,
				{
					...transformation,
					format: 'jpg',
					...(transformation?.startOffset && { startOffset: transformation.startOffset })
				},
				secure
			)
	);
	let finalSrc = $derived(src || (videoSources.length > 0 ? videoSources[0].src : undefined));

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

	export function getTransformationUrl(customTransformation?: Record<string, any>) {
		return buildCloudinaryUrl(cloudName, publicId, customTransformation || transformation, secure);
	}
</script>

<video
	bind:this={videoEl}
	id={videoId}
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
	class={customClass || ''}
	{...restProps}
>
	{#if src}
		<source {src} type="video/mp4" />
	{:else}
		{#each videoSources as source}
			<source src={source.src} type={source.type} />
		{/each}
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
