# SvelteKit Video Elements

A comprehensive SvelteKit video component library with support for multiple video players and streaming platforms. Built with TypeScript, SSR support, and optimized for modern web applications.

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - Get started in 5 minutes
- **[Full Documentation](./docs/DOCUMENTATION.md)** - Complete guide with examples
- **[API Reference](./docs/API_REFERENCE.md)** - Detailed API documentation
- **[Interactive Demo](./docs/examples/InteractiveDemo.svelte)** - Live component examples
- **[Advanced Examples](./EXAMPLES.md)** - Real-world use cases

## Features

- ✅ **Full SSR Support** - Works seamlessly with SvelteKit's server-side rendering
- ✅ **TypeScript Support** - Complete type definitions for all components
- ✅ **Multiple Video Players** - Support for 8 different video players and platforms
- ✅ **Lightweight** - Tree-shakeable, only import what you need
- ✅ **Modern** - Built with latest web standards and best practices
- ✅ **Flexible** - Easy to customize and extend

## Supported Players

- **JW Player** - Professional video player with analytics
- **Cloudflare Stream** - Video streaming with Cloudflare's CDN
- **Video.js** - Popular open-source video player
- **HLS** - HTTP Live Streaming with hls.js
- **DASH** - Dynamic Adaptive Streaming with dash.js
- **Mux Video** - Professional video hosting and streaming
- **Cloudinary** - Video transformation and optimization
- **Custom Player** - Bring your own video player

## Installation

```bash
npm install sveltekit-video-element
```

## Quick Start

### HLS Video

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';
</script>

<HlsVideo
	src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
	controls
	autoplay
	poster="https://example.com/poster.jpg"
/>
```

### Mux Video

```svelte
<script>
	import { MuxVideo } from 'sveltekit-video-element';
</script>

<MuxVideo
	playbackId="YOUR_PLAYBACK_ID"
	streamType="on-demand"
	controls
	metadata={{
		video_title: 'My Awesome Video',
		viewer_user_id: 'user-123'
	}}
/>
```

### Cloudinary Video

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

### Video.js

```svelte
<script>
	import { VideoJsVideo } from 'sveltekit-video-element';
</script>

<VideoJsVideo
	src="https://example.com/video.mp4"
	controls
	options={{
		fluid: true,
		aspectRatio: '16:9'
	}}
/>
```

### JW Player

```svelte
<script>
	import { JwPlayerVideo } from 'sveltekit-video-element';
</script>

<JwPlayerVideo
	playerId="YOUR_PLAYER_ID"
	mediaId="YOUR_MEDIA_ID"
	controls
	config={{
		aspectratio: '16:9',
		skin: {
			name: 'bekle'
		}
	}}
/>
```

### Cloudflare Stream

```svelte
<script>
	import { CloudflareVideo } from 'sveltekit-video-element';
</script>

<CloudflareVideo videoId="YOUR_VIDEO_ID" accountId="YOUR_ACCOUNT_ID" controls autoplay />
```

### DASH Video

```svelte
<script>
	import { DashVideo } from 'sveltekit-video-element';
</script>

<DashVideo
	src="https://example.com/video.mpd"
	controls
	dashConfig={{
		streaming: {
			lowLatencyEnabled: true,
			bufferTimeDefault: 4
		}
	}}
/>
```

### Custom Player

```svelte
<script>
	import { CustomVideo } from 'sveltekit-video-element';

	let myCustomPlayer = {
		init: async (element, config) => {
			// Initialize your custom player
			const player = new YourVideoPlayer(element);
			player.load(config.src);
			return player;
		}
	};
</script>

<CustomVideo
	src="https://example.com/video.mp4"
	customPlayer={myCustomPlayer}
	controls
	onPlayerReady={(player) => {
		console.log('Player ready:', player);
	}}
/>
```

## Common Props

All video components support these common HTML5 video attributes:

| Prop          | Type                               | Default      | Description           |
| ------------- | ---------------------------------- | ------------ | --------------------- |
| `src`         | `string`                           | `undefined`  | Video source URL      |
| `poster`      | `string`                           | `undefined`  | Poster image URL      |
| `controls`    | `boolean`                          | `true`       | Show video controls   |
| `autoplay`    | `boolean`                          | `false`      | Auto-play video       |
| `loop`        | `boolean`                          | `false`      | Loop video playback   |
| `muted`       | `boolean`                          | `false`      | Mute audio            |
| `preload`     | `'none' \| 'metadata' \| 'auto'`   | `'metadata'` | Preload strategy      |
| `width`       | `number \| string`                 | `'100%'`     | Video width           |
| `height`      | `number \| string`                 | `'auto'`     | Video height          |
| `crossorigin` | `'anonymous' \| 'use-credentials'` | `undefined`  | CORS setting          |
| `playsinline` | `boolean`                          | `false`      | Play inline on mobile |
| `class`       | `string`                           | `''`         | CSS class             |

## Component-Specific Props

### HlsVideo

```typescript
{
  hlsConfig?: {
    autoStartLoad?: boolean;
    startPosition?: number;
    debug?: boolean;
    maxBufferLength?: number;
    lowLatencyMode?: boolean;
    // ... and many more hls.js options
  }
}
```

### MuxVideo

```typescript
{
  playbackId: string;
  streamType?: 'on-demand' | 'live' | 'live:dvr';
  tokens?: {
    playback?: string;
    thumbnail?: string;
    storyboard?: string;
  };
  metadata?: {
    video_id?: string;
    video_title?: string;
    viewer_user_id?: string;
  };
  envKey?: string; // For Mux Data analytics
  customDomain?: string;
  maxResolution?: string;
  minResolution?: string;
}
```

### CloudinaryVideo

```typescript
{
  cloudName: string;
  publicId: string;
  transformation?: {
    quality?: string | number;
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    effect?: string;
    startOffset?: number | string;
    endOffset?: number | string;
    duration?: number | string;
  };
  sourceTypes?: string[]; // Default: ['mp4', 'webm', 'ogv']
  secure?: boolean; // Default: true
}
```

### VideoJsVideo

```typescript
{
  options?: {
    fluid?: boolean;
    aspectRatio?: string;
    controlBar?: object;
    // ... all Video.js options
  };
  plugins?: {
    [pluginName: string]: any;
  };
}
```

### JwPlayerVideo

```typescript
{
  playerId: string;
  mediaId?: string;
  libraryUrl?: string;
  config?: {
    aspectratio?: string;
    skin?: object;
    advertising?: object;
    // ... all JW Player options
  };
}
```

### CloudflareVideo

```typescript
{
  videoId: string;
  accountId: string;
  streamUrl?: string;
  signedUrl?: string;
  thumbnailTime?: number;
}
```

### DashVideo

```typescript
{
  dashConfig?: {
    streaming?: {
      lowLatencyEnabled?: boolean;
      bufferTimeDefault?: number;
      retryAttempts?: object;
      // ... all dash.js options
    };
    debug?: {
      logLevel?: number;
    };
  };
}
```

### CustomVideo

```typescript
{
  customPlayer: {
    init: (element: HTMLElement, config: any) => Promise<any> | any;
  } | Function;
  playerConfig?: Record<string, any>;
  onPlayerReady?: (player: any) => void;
}
```

## Events

All components forward standard HTML5 video events:

```svelte
<HlsVideo
	src="..."
	on:play={(e) => console.log('Playing')}
	on:pause={(e) => console.log('Paused')}
	on:ended={(e) => console.log('Ended')}
	on:timeupdate={(e) => console.log('Time update')}
	on:error={(e) => console.log('Error', e.detail)}
/>
```

### Available Events

- `loadstart`
- `loadedmetadata`
- `loadeddata`
- `canplay`
- `canplaythrough`
- `play`
- `pause`
- `ended`
- `timeupdate`
- `volumechange`
- `seeking`
- `seeked`
- `waiting`
- `durationchange`
- `progress`
- `error`

### Player-Specific Events

**HlsVideo** also emits:

- `hlsmanifestparsed`
- `hlslevelswitched`
- `hlsfragloaded`

**DashVideo** also emits:

- `dashmanifestloaded`
- `dashstreaminitialized`
- `dashqualitychanged`
- `dashbufferloaded`
- `dashfragmentloaded`

## Methods

All components expose methods via component references:

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';

	let videoRef;

	function handlePlay() {
		videoRef.play();
	}

	function handlePause() {
		videoRef.pause();
	}

	function getElement() {
		const element = videoRef.getVideoElement();
		console.log('Current time:', element.currentTime);
	}
</script>

<HlsVideo bind:this={videoRef} src="..." />
<button on:click={handlePlay}>Play</button>
<button on:click={handlePause}>Pause</button>
```

### Common Methods

- `play()` - Play video
- `pause()` - Pause video
- `getVideoElement()` - Get underlying video element
- `getPlayer()` - Get player instance (where applicable)

### Player-Specific Methods

**HlsVideo**:

- `getHls()` - Get hls.js instance
- `getCurrentLevel()` - Get current quality level
- `setCurrentLevel(level)` - Set quality level
- `getLevels()` - Get available quality levels

**DashVideo**:

- `getBitrateInfoListFor(type)` - Get available bitrates
- `setQualityFor(type, index)` - Set quality
- `getQualityFor(type)` - Get current quality
- `setAutoSwitchQualityFor(type, value)` - Enable/disable ABR

**MuxVideo**:

- `getMuxInstance()` - Get Mux Data instance

**CloudinaryVideo**:

- `getTransformationUrl(transformation)` - Get URL with transformations

## Advanced Usage

### Using with SvelteKit Load Functions

```typescript
// +page.server.ts
export async function load() {
	return {
		videoSrc: 'https://example.com/video.m3u8',
		posterUrl: 'https://example.com/poster.jpg'
	};
}
```

```svelte
<!-- +page.svelte -->
<script>
	import { HlsVideo } from 'sveltekit-video-element';

	export let data;
</script>

<HlsVideo src={data.videoSrc} poster={data.posterUrl} controls />
```

### Adaptive Streaming with HLS

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
	}
</script>

<HlsVideo bind:this={videoRef} src="..." on:hlsmanifestparsed={handleManifestParsed} />

<select value={currentLevel} on:change={(e) => setQuality(+e.target.value)}>
	<option value={-1}>Auto</option>
	{#each levels as level, i}
		<option value={i}>{level.height}p - {(level.bitrate / 1000000).toFixed(2)} Mbps</option>
	{/each}
</select>
```

### Dynamic Cloudinary Transformations

```svelte
<script>
	import { CloudinaryVideo } from 'sveltekit-video-element';

	let quality = 'auto';
	let width = 1280;
	let effect = '';

	$: transformation = {
		quality,
		width,
		...(effect && { effect })
	};
</script>

<CloudinaryVideo cloudName="demo" publicId="video-sample" {transformation} controls />

<input type="range" bind:value={width} min="640" max="1920" />
<select bind:value={quality}>
	<option value="auto">Auto</option>
	<option value="80">High</option>
	<option value="50">Medium</option>
	<option value="30">Low</option>
</select>
<input bind:value={effect} placeholder="Effect (e.g., sepia)" />
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
	HlsVideoProps,
	MuxVideoProps,
	CloudinaryVideoProps,
	VideoPlayerInstance
} from 'sveltekit-video-element';

const props: HlsVideoProps = {
	src: 'https://example.com/video.m3u8',
	controls: true,
	hlsConfig: {
		debug: true,
		lowLatencyMode: true
	}
};
```

## Utilities

The library exports useful utility functions:

```typescript
import {
	buildCloudinaryUrl,
	buildMuxUrl,
	buildCloudflareStreamUrl,
	generateId,
	isBrowser,
	loadScript,
	debounce,
	throttle
} from 'sveltekit-video-element';

// Build a Cloudinary URL
const url = buildCloudinaryUrl('demo', 'video-id', {
	quality: 'auto',
	width: 1280
});

// Build a Mux URL
const muxUrl = buildMuxUrl('playback-id', {
	maxResolution: '1080p'
});

// Check if running in browser
if (isBrowser()) {
	// Browser-only code
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## Performance Tips

1. Use `preload="none"` for videos not immediately visible
2. Enable lazy loading with Intersection Observer
3. Use appropriate video formats (HLS for adaptive streaming)
4. Optimize poster images
5. Consider using CDN for video delivery

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Built with inspiration from [media-elements](https://github.com/muxinc/media-elements) by Mux.

## Support

For issues and questions, please open an issue on GitHub.
