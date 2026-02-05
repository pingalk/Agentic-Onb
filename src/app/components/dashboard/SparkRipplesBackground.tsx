import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Texture, Box } from 'ogl';

// ============================================
// PRODUCTION SHADER (RZP Glass Effect)
// ============================================
const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 iResolution;
uniform float uDpr;
uniform sampler2D uVideoTexture;
uniform sampler2D uGradientMap;
uniform sampler2D uCenterGradientMap;

// Layer toggles
uniform float uEnableDisplacement;
uniform float uEnableColorama;
uniform float uEnableBloom;
uniform float uEnableLightSweep;
uniform float uEnableFilmGrain;

// Colorama uniforms
uniform float uInputMin;
uniform float uInputMax;
uniform float uModifyGamma;
uniform float uPosterizeLevels;
uniform float uCycleRepetitions;
uniform float uPhaseShift;
uniform float uCycleSpeed;
uniform float uWrapMode;
uniform float uReverse;
uniform float uBlendWithOriginal;
uniform float uLightIntensity;
uniform float uFrameCount;
uniform float uLightStartFrame;

// Displacement
uniform float uNumSegments;
uniform float uSlitAngle;
uniform float uDisplacementX;
uniform float uDisplacementY;

// Center Element
uniform float uEnableCenterElement;
uniform float uCenterAnimDuration;
uniform float uCenterAnimTime;

// Color Correction
uniform float uCCBlackPoint;
uniform float uCCWhitePoint;
uniform float uCCMidtoneGamma;
uniform float uCCGamma;
uniform float uCCContrast;

varying vec2 vUv;

// ============================================
// UTILITY FUNCTIONS
// ============================================
float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// ============================================
// COLORAMA EFFECT
// ============================================
vec3 applyColoramaWithGradient(
    sampler2D gradientMap,
    float rawIntensity,
    float inputMin,
    float inputMax,
    float gamma,
    float posterizeLevels,
    float cycleReps,
    float phaseShift,
    float cycleSpeed,
    float wrapMode,
    float reverse
) {
    float t = clamp((rawIntensity - inputMin) / (inputMax - inputMin), 0.0, 1.0);
    t = pow(t, gamma);
    if (posterizeLevels > 0.0) {
        t = floor(t * posterizeLevels) / posterizeLevels;
    }
    t = t * cycleReps + phaseShift + cycleSpeed * uTime;
    if (wrapMode > 0.5) {
        t = fract(t);
    } else {
        t = clamp(t, 0.0, 1.0);
    }
    if (reverse > 0.5) {
        t = 1.0 - t;
    }
    return texture2D(gradientMap, vec2(t, 0.5)).rgb;
}

// ============================================
// DISPLACEMENT FUNCTIONS
// ============================================
vec2 createStripedDisplacement(
    vec2 uv,
    float numSegments,
    float angle,
    float gradientStart,
    float gradientEnd,
    float gradientPower,
    float centerPoint
) {
    float slantedX = uv.x - uv.y * tan(angle);
    float segmentWidth = 1.0 / numSegments;
    float localUVx = fract(slantedX / segmentWidth);
    float smoothUVx = smoothstep(0.0, 1.0, localUVx);
    float rawGradient = mix(gradientEnd, gradientStart, smoothUVx);
    rawGradient = pow(rawGradient, gradientPower);
    float signedDisplacement = (rawGradient - centerPoint) / centerPoint;
    return vec2(signedDisplacement, localUVx);
}

vec2 coverUV(vec2 uv, vec2 screenSize, vec2 imageSize) {
    float screenAspect = screenSize.x / screenSize.y;
    float imageAspect = imageSize.x / imageSize.y;
    vec2 scale = vec2(1.0);
    if (screenAspect > imageAspect) {
        scale.y = imageAspect / screenAspect;
    } else {
        scale.x = screenAspect / imageAspect;
    }
    vec2 offset = (1.0 - scale) * 0.5;
    return uv * scale + offset;
}

vec2 applyDisplacement(vec2 uv, float signedDisplacement, vec2 maxDisplacement, vec2 resolution) {
    vec2 displaceOffset = vec2(
        signedDisplacement * maxDisplacement.x / resolution.x,
        signedDisplacement * maxDisplacement.y / resolution.y
    );
    return uv + displaceOffset;
}

vec4 createStripes(
    vec2 uv,
    float numSegments,
    float angle,
    float stopPosition,
    vec4 colorStart,
    vec4 colorMid
) {
    float slantedX = uv.x - uv.y * tan(angle);
    float segmentWidth = 1.0 / numSegments;
    float localUVx = 1.0 - fract(slantedX / segmentWidth);
    vec4 gradientColor;
    float opacity;
    if (localUVx < stopPosition) {
        float t = localUVx / stopPosition;
        gradientColor = mix(colorMid, colorStart, t);
        opacity = 0.5;
    } else {
        float t = (localUVx - stopPosition) / (1.0 - stopPosition);
        gradientColor = mix(vec4(0.0), colorMid, t);
        opacity = 0.5 - t * 0.5;
    }
    return gradientColor * opacity;
}

vec4 sampleWithDisplacement(
    sampler2D tex,
    vec2 uv,
    float signedDisplacement,
    vec2 maxDisplacement,
    vec2 resolution,
    vec2 imageSize
) {
    vec2 displacedUV = applyDisplacement(uv, signedDisplacement, maxDisplacement, resolution);
    return texture2D(tex, coverUV(displacedUV, resolution, imageSize));
}

// ============================================
// POST-PROCESSING
// ============================================
vec3 applyBloom(vec3 color, float intensity, float innerMask) {
    const float whiteCoreThresholdMin = 0.5;
    const float whiteCoreThresholdMax = 0.85;
    const float whiteCoreBlendStrength = 0.85;
    const float bloomThresholdMin = 0.3;
    const float bloomThresholdMax = 0.7;
    const vec3 bloomColor = vec3(1.0, 0.99, 0.97);
    const float bloomStrength = 0.10;

    float whiteCoreMask = smoothstep(whiteCoreThresholdMin, whiteCoreThresholdMax, intensity) * innerMask;
    vec3 pureWhite = vec3(1.0);
    color = mix(color, pureWhite, whiteCoreMask * whiteCoreBlendStrength);
    float bloomBase = smoothstep(bloomThresholdMin, bloomThresholdMax, intensity);
    float bloomAmount = bloomBase * innerMask;
    color += bloomColor * bloomAmount * bloomStrength;
    return color;
}

vec3 applyFilmGrain(vec3 color, vec2 uv, vec2 resolution, float dpr, float time) {
    float grainScale = 120.0;
    float grainIntensity = 0.06;
    vec2 grainUV = uv * resolution / dpr;
    float grain = valueNoise(grainUV * grainScale / 100.0 + time * 0.5);
    grain = grain * 0.7 + 0.3;
    return color + grain * grainIntensity;
}

// ============================================
// ANIMATED POLYGON SHAPE
// ============================================
struct ShapeData {
    float shape;
    float gradient;
};

float sdPolygon(vec2 p, float r, float n) {
    float an = 3.141593 / n;
    vec2 acs = vec2(cos(an), sin(an));
    float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
    p = length(p) * vec2(cos(bn), abs(sin(bn)));
    p -= r * acs;
    p.y += clamp(-p.y, 0.0, r * acs.y);
    return length(p) * sign(p.x);
}

float sdEllipse(vec2 p, vec2 ab) {
    p = abs(p);
    if (p.x > p.y) { p = p.yx; ab = ab.yx; }
    float l = ab.y * ab.y - ab.x * ab.x;
    float m = ab.x * p.x / l;
    float m2 = m * m;
    float n = ab.y * p.y / l;
    float n2 = n * n;
    float c = (m2 + n2 - 1.0) / 3.0;
    float c3 = c * c * c;
    float q = c3 + m2 * n2 * 2.0;
    float d = c3 + m2 * n2;
    float g = m + m * n2;
    float co;
    if (d < 0.0) {
        float h = acos(q / c3) / 3.0;
        float s = cos(h);
        float t = sin(h) * sqrt(3.0);
        float rx = sqrt(-c * (s + t + 2.0) + m2);
        float ry = sqrt(-c * (s - t + 2.0) + m2);
        co = (ry + sign(l) * rx + abs(g) / (rx * ry) - m) / 2.0;
    } else {
        float h = 2.0 * m * n * sqrt(d);
        float s = sign(q + h) * pow(abs(q + h), 1.0 / 3.0);
        float u = sign(q - h) * pow(abs(q - h), 1.0 / 3.0);
        float rx = -s - u - c * 4.0 + 2.0 * m2;
        float ry = (s - u) * sqrt(3.0);
        float rm = sqrt(rx * rx + ry * ry);
        co = (ry / sqrt(rm - rx) + 2.0 * g / rm - m) / 2.0;
    }
    vec2 r = ab * vec2(co, sqrt(1.0 - co * co));
    return length(r - p) * sign(p.y - r.y);
}

ShapeData calculateSingleShape(
    vec2 uv,
    float linearT,
    float solidCoreMask,
    vec2 resolution,
    float shapeType,
    float shapeWidth,
    float shapeHeight,
    float centerY,
    float animRange,
    float edgeSoftness,
    float grayLevel,
    float shapeAngleStart,
    float shapeAngleEnd,
    float shapeSize
) {
    float posOffset = (linearT * 2.0 - 1.0) * animRange;
    float centerX = 0.5 + posOffset;
    float animatedAngle = mix(shapeAngleStart, shapeAngleEnd, linearT);
    float aspect = resolution.x / resolution.y;
    vec2 shapeCenter = vec2(centerX, centerY);
    vec2 delta = uv - shapeCenter;
    float cosA = cos(animatedAngle);
    float sinA = sin(animatedAngle);
    vec2 rotatedDelta = vec2(
        delta.x * cosA - delta.y * sinA,
        delta.x * sinA + delta.y * cosA
    );
    rotatedDelta.x *= aspect;
    float dist;
    if (shapeType < 0.5) {
        dist = sdEllipse(rotatedDelta, vec2(shapeWidth, shapeHeight));
    } else {
        vec2 scaledDelta = rotatedDelta / vec2(shapeWidth, shapeHeight);
        dist = sdPolygon(scaledDelta, shapeSize / min(shapeWidth, shapeHeight), shapeType);
        dist *= min(shapeWidth, shapeHeight);
    }
    float normalizedDist;
    if (shapeType < 0.5) {
        normalizedDist = dist / max(shapeWidth, shapeHeight) + 1.0;
    } else {
        normalizedDist = (dist / shapeSize) + 1.0;
    }
    normalizedDist = clamp(normalizedDist, 0.0, 1.0);
    float shapeMask = 1.0 - smoothstep(-edgeSoftness * 0.1, edgeSoftness * 0.05, dist);
    float gradient = mix(1.0, grayLevel, smoothstep(0.0, 1.0, normalizedDist));
    shapeMask *= solidCoreMask;
    ShapeData result;
    result.shape = shapeMask;
    result.gradient = gradient;
    return result;
}

ShapeData calculateAnimatedShape(
    vec2 uv,
    float time,
    float solidCoreMask,
    vec2 resolution
) {
    const float shapeType = 3.0;
    const float shapeWidth = 0.1;
    const float shapeHeight = 0.8;
    const float centerY = 0.4;
    float cycleDuration = uCenterAnimDuration;
    const float animRange = 0.7;
    const float edgeSoftness = 0.5;
    const float grayLevel = 0.5;
    const float shapeAngleStart = 0.6;
    const float shapeAngleEnd = 0.1;
    const float shapeSize = 0.4;
    const float staggerOffset = 0.4;
    const float shape2Scale = 1.3;

    float linearT1 = fract(time / cycleDuration);
    float linearT2 = fract(time / cycleDuration + staggerOffset);

    ShapeData shape1 = calculateSingleShape(
        uv, linearT1, solidCoreMask, resolution,
        shapeType, shapeWidth, shapeHeight, centerY, animRange,
        edgeSoftness, grayLevel, shapeAngleStart, shapeAngleEnd, shapeSize
    );
    ShapeData shape2 = calculateSingleShape(
        uv, linearT2, solidCoreMask, resolution,
        shapeType, shapeWidth * shape2Scale, shapeHeight * shape2Scale, centerY, animRange,
        edgeSoftness, grayLevel, shapeAngleStart, shapeAngleEnd, shapeSize * shape2Scale
    );

    ShapeData result;
    result.shape = max(shape1.shape, shape2.shape);
    float totalMask = shape1.shape + shape2.shape;
    if (totalMask > 0.001) {
        result.gradient = (shape1.gradient * shape1.shape + shape2.gradient * shape2.shape) / totalMask;
    } else {
        result.gradient = 0.5;
    }
    return result;
}

void main() {
    float numSegments = uNumSegments;
    float angle = uSlitAngle;
    const vec2 imageSize = vec2(4500.0, 3000.0);
    vec2 maxDisplacement = vec2(uDisplacementX, uDisplacementY) * uDpr;
    vec2 uv = vUv;

    float gradientStart = 1.0;
    float gradientEnd = 0.0;
    float gradientPower = 1.0;
    float centerPoint = 0.5;
    vec2 displacementData = createStripedDisplacement(uv, numSegments, angle, gradientStart, gradientEnd, gradientPower, centerPoint);
    float signedDisplacement = displacementData.x;
    float localUVx = displacementData.y;

    float innerNumSegments = numSegments / 3.0;
    float innerAngle = angle;
    vec2 innerDisplacementData = createStripedDisplacement(uv, innerNumSegments, innerAngle, gradientStart, gradientEnd, gradientPower, centerPoint);
    float innerSignedDisplacement = innerDisplacementData.x;
    float innerLocalUVx = innerDisplacementData.y;

    vec2 rawUV = coverUV(uv, iResolution, imageSize);
    vec4 videoFrameSample = texture2D(uVideoTexture, rawUV);
    float maskIntensity = luminance(videoFrameSample.rgb);
    float solidCoreMask = smoothstep(0.4, 0.7, maskIntensity);
    float originalInnerDisplacement = innerSignedDisplacement;
    innerSignedDisplacement *= (1.0 - solidCoreMask);
    vec2 innerMaxDisplacement = vec2(30.0, 0.0) * uDpr;

    float staticEllipseMask = 0.0;
    float staticEllipseGradient = 0.0;
    ShapeData shapeData;
    shapeData.shape = 0.0;
    shapeData.gradient = 0.0;

    float centerFadeInDuration = 10.0;
    float centerFramesSinceStart = uFrameCount - uLightStartFrame;
    float centerEffectActivation = clamp(centerFramesSinceStart / centerFadeInDuration, 0.0, 1.0);

    if (uEnableCenterElement > 0.5) {
        {
            const float ellipseCenterX = 0.3;
            const float ellipseCenterY = -0.15;
            const float ellipseWidth = 0.5;
            const float ellipseHeight = 0.8;
            const float ellipseAngle = 0.3;
            const float ellipseSoftness = 1.0;
            const float ellipseGrayLevel = 0.5;
            float aspect = iResolution.x / iResolution.y;
            vec2 delta = uv - vec2(ellipseCenterX, ellipseCenterY);
            float cosA = cos(ellipseAngle);
            float sinA = sin(ellipseAngle);
            vec2 rotatedDelta = vec2(
                delta.x * cosA - delta.y * sinA,
                delta.x * sinA + delta.y * cosA
            );
            rotatedDelta.x *= aspect;
            float ellipseDist = sdEllipse(rotatedDelta, vec2(ellipseWidth, ellipseHeight));
            staticEllipseMask = 1.0 - smoothstep(-ellipseSoftness * 0.1, ellipseSoftness * 0.05, ellipseDist);
            float normalizedDist = ellipseDist / max(ellipseWidth, ellipseHeight) + 1.0;
            normalizedDist = clamp(normalizedDist, 0.0, 1.0);
            staticEllipseGradient = mix(1.0, ellipseGrayLevel, smoothstep(0.0, 1.0, normalizedDist));
            staticEllipseMask *= solidCoreMask;
        }
        originalInnerDisplacement *= (1.0 - staticEllipseMask);
        innerSignedDisplacement *= (1.0 - staticEllipseMask);
        signedDisplacement *= (1.0 - staticEllipseMask);
        vec2 shapeDisplacedUV = applyDisplacement(uv, originalInnerDisplacement, innerMaxDisplacement, iResolution);
        shapeData = calculateAnimatedShape(shapeDisplacedUV, uCenterAnimTime, solidCoreMask, iResolution);
        {
            float combinedShape = max(shapeData.shape, staticEllipseMask) * centerEffectActivation;
            float totalMask = shapeData.shape + staticEllipseMask;
            float combinedGradient = shapeData.gradient;
            if (totalMask > 0.001) {
                combinedGradient = (shapeData.gradient * shapeData.shape + staticEllipseGradient * staticEllipseMask) / totalMask;
            }
            shapeData.shape = combinedShape;
            shapeData.gradient = combinedGradient;
        }
    }

    float innerFadeInDuration = 10.0;
    float innerFramesSinceStart = uFrameCount - uLightStartFrame;
    float innerEffectActivation = clamp(innerFramesSinceStart / innerFadeInDuration, 0.0, 1.0);
    float edgeMask = smoothstep(0.3, 0.6, maskIntensity);
    float outerContribution = 1.0 - edgeMask * 0.5 * innerEffectActivation;
    float innerContribution = edgeMask * innerEffectActivation;
    float combinedDisplacement = signedDisplacement * outerContribution + innerSignedDisplacement * innerContribution;
    vec2 combinedMaxDisplacement = maxDisplacement * outerContribution + innerMaxDisplacement * innerContribution;
    combinedDisplacement = mix(combinedDisplacement, originalInnerDisplacement, solidCoreMask);
    combinedMaxDisplacement = mix(combinedMaxDisplacement, innerMaxDisplacement, solidCoreMask);

    vec4 textureSample;
    if (uEnableDisplacement > 0.5) {
        textureSample = sampleWithDisplacement(uVideoTexture, uv, combinedDisplacement, combinedMaxDisplacement, iResolution, imageSize);
    } else {
        textureSample = texture2D(uVideoTexture, coverUV(uv, iResolution, imageSize));
    }

    float combinedLocalUVx = localUVx * outerContribution + innerLocalUVx * innerContribution;
    localUVx = combinedLocalUVx;
    float innerMask = edgeMask * innerEffectActivation;
    float baseIntensity = luminance(textureSample.rgb);
    float centerWhiteBoost = 0.1;
    baseIntensity = baseIntensity + innerMask * centerWhiteBoost;
    baseIntensity = clamp(baseIntensity, 0.0, 1.0);
    float outerIntensity = baseIntensity;

    float stripeFadeOutDuration = 10.0;
    float stripeFramesSinceStart = uFrameCount - uLightStartFrame;
    float stripeEffectActivation = 1.0 - clamp(stripeFramesSinceStart / stripeFadeOutDuration, 0.0, 1.0);
    float stripeHeightDelay = 15.0;
    float stripeHeightGrowDuration = 80.0;
    float stripeHeightProgress = clamp((uFrameCount - stripeHeightDelay) / stripeHeightGrowDuration, 0.0, 1.0);
    float easedHeightProgress = 1.0 - pow(1.0 - stripeHeightProgress, 2.0);
    float heightHalfSpan = 0.2 * easedHeightProgress;
    float softEdge = 0.1 * easedHeightProgress;
    float bottomEdge = 0.5 - heightHalfSpan - softEdge;
    float bottomFull = 0.5 - heightHalfSpan;
    float topFull = 0.5 + heightHalfSpan;
    float topEdge = 0.5 + heightHalfSpan + softEdge;
    float stripeHeightMask = easedHeightProgress > 0.001
        ? smoothstep(bottomEdge, bottomFull, uv.y) * smoothstep(topEdge, topFull, uv.y)
        : 0.0;

    vec4 centerGreenSlantedLines = createStripes(
        uv + vec2(-0.0035, 0.0),
        numSegments,
        uSlitAngle,
        0.15,
        vec4(20.0/255.0, 200.0/255.0, 20.0/255.0, 0.2),
        vec4(0.0, 0.0, 0.0, 0.0)
    ) * solidCoreMask * stripeHeightMask;

    float stripeOverlayMask = solidCoreMask * stripeEffectActivation;
    vec4 stripedTexture = vec4(textureSample.rgb, 1.0) - centerGreenSlantedLines*0.7 * stripeOverlayMask;
    stripedTexture = clamp(stripedTexture, 0.0, 1.0);
    float stripedIntensity = luminance(stripedTexture.rgb);
    outerIntensity = mix(baseIntensity, stripedIntensity, stripeOverlayMask);

    vec3 color;
    if (uEnableColorama > 0.5) {
        vec3 outerColoramaResult = applyColoramaWithGradient(
            uGradientMap, outerIntensity,
            uInputMin, uInputMax, uModifyGamma, uPosterizeLevels,
            uCycleRepetitions, uPhaseShift, uCycleSpeed,
            uWrapMode, uReverse
        );
        vec3 centerColoramaResult = applyColoramaWithGradient(
            uCenterGradientMap, shapeData.gradient,
            uInputMin, uInputMax, uModifyGamma, uPosterizeLevels,
            uCycleRepetitions, uPhaseShift, uCycleSpeed,
            uWrapMode, uReverse
        );
        float specularPower = 8.0;
        float specularIntensity = 1.9;
        float specular = pow(shapeData.gradient, specularPower) * specularIntensity;
        centerColoramaResult += vec3(specular);
        vec3 blendedColorama = mix(outerColoramaResult, centerColoramaResult, shapeData.shape);
        color = mix(blendedColorama, textureSample.rgb, uBlendWithOriginal);
    } else {
        color = textureSample.rgb;
    }

    float intensity = mix(outerIntensity, shapeData.gradient, shapeData.shape);

    if (uEnableBloom > 0.5) {
        color = applyBloom(color, intensity, innerMask);
    }

    if (uEnableLightSweep > 0.5) {
        float lightFadeInDuration = 30.0;
        float framesSinceStart = uFrameCount - uLightStartFrame;
        float lightActivation = clamp(framesSinceStart / lightFadeInDuration, 0.0, 1.0);
        float shapeHighlight = pow(shapeData.gradient, 2.0) * shapeData.shape;
        color += vec3(1.0) * shapeHighlight * 0.15 * uLightIntensity * lightActivation;
    }

    if (uEnableFilmGrain > 0.5) {
        color = applyFilmGrain(color, vUv, iResolution, uDpr, uTime);
    }

    color = (color - uCCBlackPoint) / (uCCWhitePoint - uCCBlackPoint);
    color = pow(max(color, vec3(0.0)), vec3(1.0 / uCCMidtoneGamma));
    color = pow(color, vec3(1.0 / uCCGamma));
    color = color * (1.0 + uCCContrast) - uCCContrast * 0.5;
    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
}
`;

interface SparkRipplesBackgroundProps {
  className?: string;
  opacity?: number;
  loop?: boolean;
  scale?: number; // Scale up the animation (1.0 = 100%, 1.5 = 150%)
  playbackRate?: number; // Video playback speed (0.5 = half speed, 1.0 = normal)
  muted?: boolean; // When true, reduces contrast and brightness for subtle background use
}

export const SparkRipplesBackground = ({
  className = '',
  opacity = 1,
  loop = true,
  scale = 1,
  playbackRate = 1,
  muted = false
}: SparkRipplesBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const dpr = Math.min(window.devicePixelRatio, 2);

    // Create OGL renderer
    const renderer = new Renderer({
      width: container.clientWidth,
      height: container.clientHeight,
      dpr: dpr,
    });
    const gl = renderer.gl;
    // Set clear color to #f8f8f8 for muted mode (matches page background)
    if (muted) {
      gl.clearColor(248/255, 248/255, 248/255, 1);
    }
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    container.appendChild(gl.canvas);

    // Create textures
    const videoTexture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const gradientMap = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });

    const centerGradientMap = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });

    // Frame counter for animations
    let frameCount = 0;
    const lightStartFrame = 140;

    // Create program with full production uniforms
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        iResolution: { value: [container.clientWidth * dpr, container.clientHeight * dpr] },
        uDpr: { value: dpr },
        uVideoTexture: { value: videoTexture },
        uGradientMap: { value: gradientMap },
        uCenterGradientMap: { value: centerGradientMap },
        // Layer toggles
        uEnableDisplacement: { value: 1.0 },
        uEnableColorama: { value: 1.0 },
        uEnableBloom: { value: 1.0 },
        uEnableLightSweep: { value: 1.0 },
        uEnableFilmGrain: { value: 0.0 },
        // Colorama
        uInputMin: { value: 0.0 },
        uInputMax: { value: 1.0 },
        uModifyGamma: { value: 1.05 },
        uPosterizeLevels: { value: 0.0 },
        uCycleRepetitions: { value: 1.0 },
        uPhaseShift: { value: 0.0 },
        uCycleSpeed: { value: 0.0 },
        uWrapMode: { value: 0.0 },
        uReverse: { value: 1.0 },
        uBlendWithOriginal: { value: 0.0 },
        uLightIntensity: { value: 0.2 },
        uFrameCount: { value: 0 },
        uLightStartFrame: { value: lightStartFrame },
        // Displacement
        uNumSegments: { value: 45.0 },
        uSlitAngle: { value: 0.15 },
        uDisplacementX: { value: -12.0 },
        uDisplacementY: { value: -20.0 },
        // Center element
        uEnableCenterElement: { value: 1.0 },
        uCenterAnimDuration: { value: 6.0 },
        uCenterAnimTime: { value: 0 },
        // Color correction - muted mode tints output to blend with #f8f8f8 background
        uCCBlackPoint: { value: muted ? 0.25 : 0.0 }, // Push darks up significantly for gray base
        uCCWhitePoint: { value: muted ? 1.0 : 0.85 }, // Keep whites from being too bright
        uCCMidtoneGamma: { value: muted ? 0.85 : 1.0 }, // Compress midtones toward gray
        uCCGamma: { value: muted ? 0.95 : 1.0 }, // Slightly darker gamma
        uCCContrast: { value: muted ? -0.25 : 0.0 }, // Reduce contrast for flat gray look
      },
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value = [width * dpr, height * dpr];
    });
    resizeObserver.observe(container);

    // Create geometry and mesh
    const geometry = new Box(gl, { width: 2, height: 2, depth: 0 });
    const mesh = new Mesh(gl, { geometry, program });

    // Asset loading helpers
    function loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    function loadVideo(src: string): Promise<HTMLVideoElement> {
      return new Promise((resolve, reject) => {
        const vid = document.createElement('video');
        vid.src = src;
        vid.crossOrigin = 'anonymous';
        vid.loop = loop;
        vid.muted = true;
        vid.playsInline = true;
        vid.autoplay = true;
        vid.oncanplaythrough = () => resolve(vid);
        vid.onerror = reject;
        vid.load();
      });
    }

    // Create fallback gradient
    function createFallbackGradient(): HTMLCanvasElement {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 1;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createLinearGradient(0, 0, 256, 0);
      gradient.addColorStop(0, 'rgb(15, 23, 42)');
      gradient.addColorStop(0.25, 'rgb(20, 184, 166)');
      gradient.addColorStop(0.5, 'rgb(52, 211, 153)');
      gradient.addColorStop(0.75, 'rgb(167, 243, 208)');
      gradient.addColorStop(1, 'rgb(255, 255, 255)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 1);
      return canvas;
    }

    // Create fallback video canvas
    function createFallbackVideoCanvas(): HTMLCanvasElement {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      return canvas;
    }

    function updateFallbackCanvas(canvas: HTMLCanvasElement, time: number) {
      const ctx = canvas.getContext('2d')!;
      const w = canvas.width;
      const h = canvas.height;
      const gradient = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.5);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, '#e0e0e0');
      gradient.addColorStop(0.6, '#a0a0a0');
      gradient.addColorStop(1, '#404040');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }

    let video: HTMLVideoElement | null = null;
    let fallbackCanvas: HTMLCanvasElement | null = null;
    let animationId: number;
    let startTime = 0;

    // Ping-pong state for seamless looping
    let pingPongDirection = 1; // 1 = forward, -1 = backward
    let lastFrameTime = 0;

    // Render loop
    function update(t: number) {
      animationId = requestAnimationFrame(update);

      if (startTime === 0) startTime = t;
      const currentTime = (t - startTime) * 0.001;
      const deltaTime = lastFrameTime === 0 ? 0 : (t - lastFrameTime) * 0.001;
      lastFrameTime = t;
      frameCount++;

      // Update video texture
      if (video && video.readyState >= video.HAVE_CURRENT_DATA) {
        videoTexture.image = video;
        videoTexture.needsUpdate = true;

        const videoDuration = video.duration || 14;

        if (loop) {
          // Loop video from the start
          if (video.currentTime >= videoDuration) {
            video.currentTime = 0;
          }
        } else {
          // Non-loop mode: ping-pong between 50-80% of timeline for seamless looping
          // Goes A→B→C→B→A instead of A→B→C→A (no visible cut)
          const lowerBound = 0.50 * videoDuration; // 50%
          const upperBound = 0.80 * videoDuration; // 80%

          // Pause native playback and control position manually for ping-pong
          if (!video.paused && pingPongDirection === -1) {
            // Video is playing but we need to go backward - pause it
            video.pause();
          }

          if (pingPongDirection === 1) {
            // Forward: let video play naturally
            if (video.paused) {
              video.play().catch(() => {});
            }
            if (video.currentTime >= upperBound) {
              // Hit upper bound - reverse direction
              pingPongDirection = -1;
              video.pause();
            }
          } else {
            // Backward: manually seek backward each frame
            const newTime = video.currentTime - deltaTime;
            if (newTime <= lowerBound) {
              // Hit lower bound - reverse direction
              video.currentTime = lowerBound;
              pingPongDirection = 1;
              video.play().catch(() => {});
            } else {
              video.currentTime = newTime;
            }
          }
        }
      } else if (fallbackCanvas) {
        updateFallbackCanvas(fallbackCanvas, currentTime);
        videoTexture.image = fallbackCanvas;
        videoTexture.needsUpdate = true;
      }

      program.uniforms.uTime.value = currentTime;
      program.uniforms.uFrameCount.value = frameCount;
      program.uniforms.uCenterAnimTime.value = currentTime;
      // Clear with background color before rendering (important for muted mode)
      gl.clear(gl.COLOR_BUFFER_BIT);
      renderer.render({ scene: mesh });
    }

    // Load assets
    Promise.all([
      loadImage('/colorama-gradient-map-2.jpg').catch((e) => { console.error('Failed to load gradient map:', e); return null; }),
      loadImage('/colorama-center-gradient-map.jpg').catch((e) => { console.error('Failed to load center gradient map:', e); return null; }),
      loadVideo('/base_video.mp4').catch((e) => { console.error('Failed to load video:', e); return null; }),
    ])
      .then(([gradientMapImg, centerGradientMapImg, loadedVideo]) => {
        console.log('[SparkRipples] Assets loaded:', {
          gradientMapImg: !!gradientMapImg,
          centerGradientMapImg: !!centerGradientMapImg,
          loadedVideo: !!loadedVideo
        });

        if (gradientMapImg) {
          gradientMap.image = gradientMapImg;
        } else {
          console.warn('[SparkRipples] Using fallback gradient');
          gradientMap.image = createFallbackGradient();
        }
        gradientMap.needsUpdate = true;

        if (centerGradientMapImg) {
          centerGradientMap.image = centerGradientMapImg;
        } else {
          console.warn('[SparkRipples] Using fallback center gradient');
          centerGradientMap.image = createFallbackGradient();
        }
        centerGradientMap.needsUpdate = true;

        if (loadedVideo) {
          video = loadedVideo;
          // Apply playback rate for slower/faster animation
          video.playbackRate = playbackRate;
          console.log('[SparkRipples] Video loaded, attempting to play at rate:', playbackRate);
          video.play().then(() => {
            console.log('[SparkRipples] Video playing!');
          }).catch((e) => {
            console.warn('[SparkRipples] Video autoplay blocked, waiting for user interaction:', e);
            document.addEventListener('click', () => video?.play(), { once: true });
          });
        } else {
          console.warn('[SparkRipples] Using fallback canvas (no video)');
          fallbackCanvas = createFallbackVideoCanvas();
        }

        animationId = requestAnimationFrame(update);
      });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (gl.canvas.parentNode) {
        gl.canvas.parentNode.removeChild(gl.canvas);
      }
      if (video) {
        video.pause();
        video.src = '';
      }
    };
  }, [loop, playbackRate, muted]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{
        opacity,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'center center'
      }}
    />
  );
};

export default SparkRipplesBackground;
