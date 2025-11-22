/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

import type { HTMLAttributes, ClassValue } from 'svelte/elements';

export interface BaseVideoProps extends HTMLAttributes<HTMLVideoElement> {
  src?: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  width?: number | string;
  height?: number | string;
  crossorigin?: 'anonymous' | 'use-credentials';
  playsinline?: boolean;
  class?: ClassValue;
}

export interface JwPlayerVideoProps extends BaseVideoProps {
  mediaId?: string;
  playerId?: string;
  libraryUrl?: string;
  config?: Record<string, any>;
}

export interface CloudflareVideoProps extends BaseVideoProps {
  videoId?: string;
  accountId?: string;
  streamUrl?: string;
  signedUrl?: string;
  thumbnailTime?: number;
}

export interface VideoJsVideoProps extends BaseVideoProps {
  options?: Record<string, any>;
  plugins?: Record<string, any>;
}

export interface HlsVideoProps extends BaseVideoProps {
  hlsConfig?: {
    autoStartLoad?: boolean;
    startPosition?: number;
    debug?: boolean;
    capLevelOnFPSDrop?: boolean;
    capLevelToPlayerSize?: boolean;
    defaultAudioCodec?: string;
    initialLiveManifestSize?: number;
    maxBufferLength?: number;
    maxMaxBufferLength?: number;
    backBufferLength?: number;
    maxBufferSize?: number;
    maxBufferHole?: number;
    highBufferWatchdogPeriod?: number;
    nudgeOffset?: number;
    nudgeMaxRetry?: number;
    maxFragLookUpTolerance?: number;
    liveSyncDurationCount?: number;
    liveMaxLatencyDurationCount?: number;
    liveDurationInfinity?: boolean;
    enableWorker?: boolean;
    enableSoftwareAES?: boolean;
    manifestLoadingTimeOut?: number;
    manifestLoadingMaxRetry?: number;
    manifestLoadingRetryDelay?: number;
    manifestLoadingMaxRetryTimeout?: number;
    startLevel?: number;
    levelLoadingTimeOut?: number;
    levelLoadingMaxRetry?: number;
    levelLoadingRetryDelay?: number;
    levelLoadingMaxRetryTimeout?: number;
    fragLoadingTimeOut?: number;
    fragLoadingMaxRetry?: number;
    fragLoadingRetryDelay?: number;
    fragLoadingMaxRetryTimeout?: number;
    startFragPrefetch?: boolean;
    testBandwidth?: boolean;
    progressive?: boolean;
    lowLatencyMode?: boolean;
    fpsDroppedMonitoringPeriod?: number;
    fpsDroppedMonitoringThreshold?: number;
    appendErrorMaxRetry?: number;
    enableWebVTT?: boolean;
    enableIMSC1?: boolean;
    enableCEA708Captions?: boolean;
    stretchShortVideoTrack?: boolean;
    maxAudioFramesDrift?: number;
    forceKeyFrameOnDiscontinuity?: boolean;
    abrEwmaFastLive?: number;
    abrEwmaSlowLive?: number;
    abrEwmaFastVoD?: number;
    abrEwmaSlowVoD?: number;
    abrEwmaDefaultEstimate?: number;
    abrBandWidthFactor?: number;
    abrBandWidthUpFactor?: number;
    abrMaxWithRealBitrate?: boolean;
    maxStarvationDelay?: number;
    maxLoadingDelay?: number;
    minAutoBitrate?: number;
    emeEnabled?: boolean;
    widevineLicenseUrl?: string;
    drmSystemOptions?: Record<string, any>;
    xhrSetup?: (xhr: XMLHttpRequest, url: string) => void;
    fetchSetup?: (context: any, initParams: any) => Request;
  };
  onhlsmanifestparsed?: (event: CustomEvent) => void;
  onhlslevelswitched?: (event: CustomEvent) => void;
  onhlsfragloaded?: (event: CustomEvent) => void;
  onhlserror?: (event: CustomEvent) => void;
}

export interface DashVideoProps extends BaseVideoProps {
  dashConfig?: {
    streaming?: {
      retryAttempts?: {
        MPD?: number;
        XLinkExpansion?: number;
        MediaSegment?: number;
        InitializationSegment?: number;
        BitstreamSwitchingSegment?: number;
        IndexSegment?: number;
        other?: number;
      };
      retryIntervals?: {
        MPD?: number;
        XLinkExpansion?: number;
        MediaSegment?: number;
        InitializationSegment?: number;
        BitstreamSwitchingSegment?: number;
        IndexSegment?: number;
        other?: number;
      };
      abandonLoadTimeout?: number;
      wallclockTimeUpdateInterval?: number;
      manifestUpdateRetryInterval?: number;
      cacheLoadThresholds?: {
        video?: number;
        audio?: number;
      };
      trackSwitchMode?: {
        audio?: string;
        video?: string;
      };
      selectionModeForInitialTrack?: string;
      fragmentRequestTimeout?: number;
      retryIntervalForFragmentErrors?: number;
      bufferPruningInterval?: number;
      bufferToKeep?: number;
      bufferTimeAtTopQuality?: number;
      bufferTimeAtTopQualityLongForm?: number;
      longFormContentDurationThreshold?: number;
      stallThreshold?: number;
      stableBufferTime?: number;
      bufferTimeDefault?: number;
      gaps?: {
        threshold?: number;
        jumpGaps?: boolean;
        jumpLargeGaps?: boolean;
        smallGapLimit?: number;
      };
      utcSynchronization?: {
        enabled?: boolean;
        useManifestDateHeaderTimeSource?: boolean;
        backgroundAttempts?: number;
        timeBetweenSyncAttempts?: number;
        maximumTimeBetweenSyncAttempts?: number;
        minimumTimeBetweenSyncAttempts?: number;
        timeBetweenSyncAttemptsAdjustmentFactor?: number;
        maximumAllowedDrift?: number;
        enableBackgroundSyncAfterSegmentDownloadError?: boolean;
        defaultTimingSource?: {
          scheme?: string;
          value?: string;
        };
      };
      lowLatencyEnabled?: boolean;
      keepProtectionMediaKeys?: boolean;
    };
    debug?: {
      logLevel?: number;
      dispatchEvent?: boolean;
    };
  };
  // DASH-specific event handlers
  ondashmanifestloaded?: (event: CustomEvent) => void;
  ondashstreaminitialized?: (event: CustomEvent) => void;
  ondashqualitychanged?: (event: CustomEvent) => void;
  ondashbufferloaded?: (event: CustomEvent) => void;
  ondashfragmentloaded?: (event: CustomEvent) => void;
  ondasherror?: (event: CustomEvent) => void;
}

export interface MuxVideoProps extends BaseVideoProps {
  playbackId?: string;
  streamType?: 'on-demand' | 'live' | 'live:dvr';
  tokens?: {
    playback?: string;
    thumbnail?: string;
    storyboard?: string;
  };
  thumbnailTime?: number;
  metadata?: {
    video_id?: string;
    video_title?: string;
    viewer_user_id?: string;
    [key: string]: any;
  };
  beaconCollectionDomain?: string;
  customDomain?: string;
  envKey?: string;
  debug?: boolean;
  disableCookies?: boolean;
  maxResolution?: string;
  minResolution?: string;
  renditionOrder?: 'desc' | 'asc';
  programStartTime?: number;
  programEndTime?: number;
}

export interface CloudinaryVideoProps extends BaseVideoProps {
  cloudName: string;
  publicId: string;
  transformation?: {
    quality?: string | number;
    format?: string;
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    effect?: string;
    overlay?: string;
    startOffset?: number | string;
    endOffset?: number | string;
    duration?: number | string;
    [key: string]: any;
  };
  sourceTypes?: string[];
  secure?: boolean;
}

export interface CustomVideoProps extends BaseVideoProps {
  customPlayer?: any;
  playerConfig?: Record<string, any>;
  onPlayerReady?: (player: any) => void;
}

export interface VideoPlayerInstance {
  play: () => Promise<void>;
  pause: () => void;
  load: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  paused: boolean;
  ended: boolean;
  readyState: number;
  destroy?: () => void;
}

export interface VideoEventHandlers {
  onloadstart?: (event: Event) => void;
  onloadedmetadata?: (event: Event) => void;
  onloadeddata?: (event: Event) => void;
  oncanplay?: (event: Event) => void;
  oncanplaythrough?: (event: Event) => void;
  onplay?: (event: Event) => void;
  onpause?: (event: Event) => void;
  onended?: (event: Event) => void;
  ontimeupdate?: (event: Event) => void;
  onvolumechange?: (event: Event) => void;
  onseeking?: (event: Event) => void;
  onseeked?: (event: Event) => void;
  onwaiting?: (event: Event) => void;
  ondurationchange?: (event: Event) => void;
  onprogress?: (event: Event) => void;
  onerror?: (event: Event) => void;
  onstalled?: (event: Event) => void;
  onsuspend?: (event: Event) => void;
  onabort?: (event: Event) => void;
  onemptied?: (event: Event) => void;
  onratechange?: (event: Event) => void;
}
