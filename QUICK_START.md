# Quick Start Guide

Get started with SvelteKit Video Elements in under 5 minutes!

## Installation

```bash
npm install sveltekit-video-element
```

## Your First Video

### 1. HLS Video (Recommended for streaming)

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';
</script>

<HlsVideo src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" controls autoplay />
```

### 2. Video.js (Open-source player)

```svelte
<script>
	import { VideoJsVideo } from 'sveltekit-video-element';
</script>

<VideoJsVideo src="https://vjs.zencdn.net/v/oceans.mp4" controls />
```

## Common Use Cases

### Adaptive Streaming with Quality Selection

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';

	let videoRef;
	let levels = [];
	let currentLevel = -1;

	function handleManifestParsed() {
		levels = videoRef.getLevels();
		currentLevel = videoRef.getCurrentLevel();
	}

	function setQuality(level) {
		videoRef.setCurrentLevel(level);
		currentLevel = level;
	}
</script>

<HlsVideo
	bind:this={videoRef}
	src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
	controls
	onhlsmanifestparsed={handleManifestParsed}
/>

{#if levels.length > 0}
	<select value={currentLevel} on:change={(e) => setQuality(+e.target.value)}>
		<option value={-1}>Auto Quality</option>
		{#each levels as level, i}
			<option value={i}>{level.height}p</option>
		{/each}
	</select>
{/if}
```

### Professional Video with Analytics (Mux)

**Note:** Requires Mux account - [Sign up here](https://mux.com)

```svelte
<script>
	import { MuxVideo } from 'sveltekit-video-element';
</script>

<MuxVideo
	playbackId="your-playback-id"
	envKey="your-env-key"
	controls
	metadata={{
		video_title: 'My Video',
		viewer_user_id: 'user-123'
	}}
/>
```

### Video Transformation (Cloudinary)

**Note:** Requires Cloudinary account - [Sign up here](https://cloudinary.com)

```svelte
<script>
	import { CloudinaryVideo } from 'sveltekit-video-element';
</script>

<CloudinaryVideo
	cloudName="your-cloud-name"
	publicId="your-video-id"
	transformation={{
		quality: 'auto',
		width: 1280,
		height: 720,
		crop: 'fill'
	}}
	controls
/>
```

## Event Handling

All components support standard HTML5 video events:

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';

	let isPlaying = false;
	let currentTime = 0;
	let duration = 0;

	function handlePlay() {
		isPlaying = true;
	}

	function handlePause() {
		isPlaying = false;
	}

	function handleTimeUpdate(event) {
		currentTime = event.target.currentTime;
	}

	function handleLoadedMetadata(event) {
		duration = event.target.duration;
	}
</script>

<HlsVideo
	src="..."
	controls
	onplay={handlePlay}
	onpause={handlePause}
	ontimeupdate={handleTimeUpdate}
	onloadedmetadata={handleLoadedMetadata}
/>

<div>
	<p>Status: {isPlaying ? 'Playing' : 'Paused'}</p>
	<p>Progress: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s</p>
</div>
```

## SSR Support

All components work seamlessly with SvelteKit's SSR:

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';
	import { browser } from '$app/environment';
</script>

{#if browser}
	<HlsVideo src="..." controls />
{:else}
	<div class="video-placeholder">Loading video player...</div>
{/if}
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type { HlsVideoProps, MuxVideoProps } from 'sveltekit-video-element';

const hlsProps: HlsVideoProps = {
	src: 'https://example.com/video.m3u8',
	controls: true,
	hlsConfig: {
		lowLatencyMode: true,
		maxBufferLength: 30
	}
};
```

## Components Overview

| Component         | Use Case                         | Requires Account |
| ----------------- | -------------------------------- | ---------------- |
| `HlsVideo`        | Adaptive streaming               | ❌ No            |
| `VideoJsVideo`    | Open-source player               | ❌ No            |
| `DashVideo`       | DASH streaming                   | ❌ No            |
| `MuxVideo`        | Professional hosting + analytics | ✅ Yes           |
| `JwPlayerVideo`   | Enterprise features              | ✅ Yes           |
| `CloudflareVideo` | CDN streaming                    | ✅ Yes           |
| `CloudinaryVideo` | Video transformation             | ✅ Yes           |
| `CustomVideo`     | Your own player                  | ❌ No            |

## Next Steps

- 📚 [Full Documentation](./DOCUMENTATION.md)
- 🎮 [Interactive Demo](./examples/InteractiveDemo.svelte)
- 💡 [Advanced Examples](../EXAMPLES.md)
- 🐛 [Report Issues](https://github.com/yourusername/sveltekit-video-element/issues)

## Need Help?

- Check the [documentation](./DOCUMENTATION.md)
- Browse [examples](../EXAMPLES.md)
- Open an [issue](https://github.com/yourusername/sveltekit-video-element/issues)
- Join [discussions](https://github.com/yourusername/sveltekit-video-element/discussions)
