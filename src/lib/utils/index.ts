/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

import { browser } from '$app/environment';

/**
 * Check if code is running in browser environment
 */
export function isBrowser(): boolean {
  return browser;
}

/**
 * Dynamically load external script
 */
export function loadScript(src: string, id?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      resolve();
      return;
    }

    // Check if script already exists
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    if (id) script.id = id;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
}

/**
 * Dynamically load CSS stylesheet
 */
export function loadStylesheet(href: string, id?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      resolve();
      return;
    }

    // Check if stylesheet already exists
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    if (id) link.id = id;

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));

    document.head.appendChild(link);
  });
}

/**
 * Remove script from DOM
 */
export function removeScript(id: string): void {
  if (!isBrowser()) return;

  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

/**
 * Remove stylesheet from DOM
 */
export function removeStylesheet(id: string): void {
  if (!isBrowser()) return;

  const link = document.getElementById(id);
  if (link) {
    link.remove();
  }
}

/**
 * Wait for a global variable to be available
 */
export function waitForGlobal<T = any>(
  globalName: string,
  timeout: number = 10000
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error('Not in browser environment'));
      return;
    }

    // Check if already available
    if ((window as any)[globalName]) {
      resolve((window as any)[globalName]);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if ((window as any)[globalName]) {
        clearInterval(interval);
        resolve((window as any)[globalName]);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error(`Timeout waiting for global: ${globalName}`));
      }
    }, 100);
  });
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = 'video'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Build Cloudinary video URL
 */
export function buildCloudinaryUrl(
  cloudName: string,
  publicId: string,
  transformation?: Record<string, any>,
  secure: boolean = true
): string {
  const protocol = secure ? 'https' : 'http';
  const baseUrl = `${protocol}://res.cloudinary.com/${cloudName}/video/upload`;

  if (!transformation || Object.keys(transformation).length === 0) {
    return `${baseUrl}/${publicId}`;
  }

  const transformParts: string[] = [];

  // Handle common transformations
  if (transformation.quality) transformParts.push(`q_${transformation.quality}`);
  if (transformation.width) transformParts.push(`w_${transformation.width}`);
  if (transformation.height) transformParts.push(`h_${transformation.height}`);
  if (transformation.crop) transformParts.push(`c_${transformation.crop}`);
  if (transformation.gravity) transformParts.push(`g_${transformation.gravity}`);
  if (transformation.effect) transformParts.push(`e_${transformation.effect}`);
  if (transformation.overlay) transformParts.push(`l_${transformation.overlay}`);
  if (transformation.startOffset) transformParts.push(`so_${transformation.startOffset}`);
  if (transformation.endOffset) transformParts.push(`eo_${transformation.endOffset}`);
  if (transformation.duration) transformParts.push(`du_${transformation.duration}`);
  if (transformation.format) transformParts.push(`f_${transformation.format}`);

  // Handle custom transformations
  Object.keys(transformation).forEach((key) => {
    if (
      ![
        'quality',
        'width',
        'height',
        'crop',
        'gravity',
        'effect',
        'overlay',
        'startOffset',
        'endOffset',
        'duration',
        'format'
      ].includes(key)
    ) {
      transformParts.push(`${key}_${transformation[key]}`);
    }
  });

  const transformString = transformParts.join(',');
  return `${baseUrl}/${transformString}/${publicId}`;
}

/**
 * Build Mux video URL
 */
export function buildMuxUrl(
  playbackId: string,
  options?: {
    token?: string;
    thumbnailTime?: number;
    maxResolution?: string;
    minResolution?: string;
    customDomain?: string;
  }
): string {
  const domain = options?.customDomain || 'stream.mux.com';
  let url = `https://${domain}/${playbackId}.m3u8`;

  const params: string[] = [];
  if (options?.token) params.push(`token=${options.token}`);
  if (options?.maxResolution) params.push(`max_resolution=${options.maxResolution}`);
  if (options?.minResolution) params.push(`min_resolution=${options.minResolution}`);

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return url;
}

/**
 * Build Cloudflare Stream URL
 */
export function buildCloudflareStreamUrl(
  accountId: string,
  videoId: string,
  options?: {
    signedUrl?: string;
  }
): string {
  if (options?.signedUrl) {
    return options.signedUrl;
  }
  return `https://customer-${accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
