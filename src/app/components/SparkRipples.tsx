import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Texture, Box } from 'ogl';
import { Pane } from 'tweakpane';
import Stats from 'stats.js';

// ============================================
// PRODUCTION SHADER (RZP Glass Effect)
// ============================================
const rzpGlassFragShader = /* glsl */ `
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

// Debug visualization
uniform float uDebugMode;

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

    if (uDebugMode > 0.5) {
        vec3 debugColor = vec3(0.0);
        if (uDebugMode < 1.5) {
            debugColor = vec3(signedDisplacement * 0.5 + 0.5);
        } else if (uDebugMode < 2.5) {
            debugColor = vec3(originalInnerDisplacement * 0.5 + 0.5);
        } else if (uDebugMode < 3.5) {
            debugColor = vec3(combinedDisplacement * 0.5 + 0.5);
        } else if (uDebugMode < 4.5) {
            debugColor = vec3(solidCoreMask);
        } else if (uDebugMode < 5.5) {
            debugColor = vec3(edgeMask);
        } else if (uDebugMode < 6.5) {
            debugColor = vec3(innerMask);
        } else if (uDebugMode < 7.5) {
            debugColor = vec3(shapeData.shape);
        } else if (uDebugMode < 8.5) {
            debugColor = vec3(shapeData.gradient);
        } else if (uDebugMode < 9.5) {
            debugColor = vec3(intensity);
        } else if (uDebugMode < 10.5) {
            debugColor = vec3(localUVx);
        } else if (uDebugMode < 11.5) {
            debugColor = textureSample.rgb;
        } else if (uDebugMode < 12.5) {
            ShapeData rawShapeData = calculateAnimatedShape(vUv, uCenterAnimTime, 1.0, iResolution);
            debugColor = vec3(rawShapeData.gradient) * rawShapeData.shape * centerEffectActivation;
        } else if (uDebugMode < 13.5) {
            vec3 centerOnly = applyColoramaWithGradient(
                uCenterGradientMap, shapeData.gradient,
                uInputMin, uInputMax, uModifyGamma, uPosterizeLevels,
                uCycleRepetitions, uPhaseShift, uCycleSpeed,
                uWrapMode, uReverse
            );
            debugColor = centerOnly * shapeData.shape * centerEffectActivation;
        } else if (uDebugMode < 14.5) {
            debugColor = vec3(stripeHeightMask);
        }
        gl_FragColor = vec4(debugColor, 1.0);
    } else {
        gl_FragColor = vec4(color, 1.0);
    }
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

// ============================================
// TYPES
// ============================================
interface Params {
  inputMin: number;
  inputMax: number;
  modifyGamma: number;
  posterizeLevels: number;
  cycleRepetitions: number;
  phaseShift: number;
  cycleSpeed: number;
  wrapMode: boolean;
  reverse: boolean;
  blendWithOriginal: number;
  lightIntensity: number;
  lightStartFrame: number;
  enableCenterElement: boolean;
  centerAnimDuration: number;
  showCenterText: boolean;
  ccBlackPoint: number;
  ccWhitePoint: number;
  ccMidtoneGamma: number;
  ccGamma: number;
  ccContrast: number;
  numSegments: number;
  slitAngle: number;
  displacementX: number;
  displacementY: number;
  paused: boolean;
  videoStartTime: number;
  videoEndTime: number;
  videoCurrentFrame: number;
  animateLightIndependently: boolean;
  enableDisplacement: boolean;
  enableColorama: boolean;
  enableBloom: boolean;
  enableLightSweep: boolean;
  enableFilmGrain: boolean;
  debugMode: number;
  animateCycleReps: boolean;
  cycleRepetitionsStart: number;
  cycleRepetitionsEnd: number;
  cycleRepetitionsStartFrame: number;
  cycleRepetitionsDuration: number;
}

// ============================================
// MAIN COMPONENT
// ============================================
export const SparkRipples = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    // Create OGL renderer
    const renderer = new Renderer({
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: dpr,
    });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);

    // Create textures
    const videoTexture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const coloramaGradientMap = new Texture(gl, {
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

    // Params object
    const params: Params = {
      inputMin: 0.0,
      inputMax: 1.0,
      modifyGamma: 1.05,
      posterizeLevels: 0.0,
      cycleRepetitions: 1.0,
      phaseShift: 0.0,
      cycleSpeed: 0.0,
      wrapMode: false,
      reverse: true,
      blendWithOriginal: 0.0,
      lightIntensity: 0.2,
      lightStartFrame: 140,
      enableCenterElement: true,
      centerAnimDuration: 6.0,
      showCenterText: true,
      ccBlackPoint: 0.0,
      ccWhitePoint: 1.0,
      ccMidtoneGamma: 1.2,
      ccGamma: 1.2,
      ccContrast: 0.0,
      numSegments: 45.0,
      slitAngle: 0.15,
      displacementX: -12.0,
      displacementY: -20.0,
      paused: false,
      videoStartTime: 0,
      videoEndTime: 14,
      videoCurrentFrame: 0,
      animateLightIndependently: false,
      enableDisplacement: true,
      enableColorama: true,
      enableBloom: true,
      enableLightSweep: true,
      enableFilmGrain: true,
      debugMode: 0,
      animateCycleReps: true,
      cycleRepetitionsStart: 1.0,
      cycleRepetitionsEnd: 1.15,
      cycleRepetitionsStartFrame: 250,
      cycleRepetitionsDuration: 140,
    };

    // Create Tweakpane
    const pane = new Pane({ title: 'RZP Glass Controls', expanded: false });

    // Displacement folder
    const displacementFolder = pane.addFolder({ title: 'Displacement', expanded: false });
    displacementFolder.addBinding(params, 'enableDisplacement', { label: 'Enable' });
    displacementFolder.addBinding(params, 'numSegments', { min: 1, max: 100, step: 1, label: 'Num Segments' });
    displacementFolder.addBinding(params, 'slitAngle', { min: -1.57, max: 1.57, step: 0.01, label: 'Slit Angle' });
    displacementFolder.addBinding(params, 'displacementX', { min: -50, max: 50, step: 0.5, label: 'Displacement X' });
    displacementFolder.addBinding(params, 'displacementY', { min: -50, max: 50, step: 0.5, label: 'Displacement Y' });

    // Colorama folder
    const coloramaFolder = pane.addFolder({ title: 'Colorama', expanded: false });
    coloramaFolder.addBinding(params, 'enableColorama', { label: 'Enable' });
    coloramaFolder.addBinding(params, 'inputMin', { min: -1, max: 1, step: 0.01, label: 'Input Min' });
    coloramaFolder.addBinding(params, 'inputMax', { min: 0, max: 3, step: 0.01, label: 'Input Max' });
    coloramaFolder.addBinding(params, 'modifyGamma', { min: 0.1, max: 3, step: 0.01, label: 'Gamma' });
    coloramaFolder.addBinding(params, 'posterizeLevels', { min: 0, max: 32, step: 1, label: 'Posterize' });
    coloramaFolder.addBinding(params, 'cycleRepetitions', { min: 0.1, max: 5, step: 0.01, label: 'Cycle Reps' });
    coloramaFolder.addBinding(params, 'phaseShift', { min: -1, max: 1, step: 0.01, label: 'Phase Shift' });
    coloramaFolder.addBinding(params, 'cycleSpeed', { min: 0, max: 2, step: 0.01, label: 'Cycle Speed' });
    coloramaFolder.addBinding(params, 'wrapMode', { label: 'Wrap Mode' });
    coloramaFolder.addBinding(params, 'reverse', { label: 'Reverse' });
    coloramaFolder.addBinding(params, 'blendWithOriginal', { min: 0, max: 1, step: 0.01, label: 'Blend Original' });

    // Animation subfolder
    const coloramaAnimFolder = coloramaFolder.addFolder({ title: 'Animation', expanded: false });
    coloramaAnimFolder.addBinding(params, 'animateCycleReps', { label: 'Animate Reps' });
    coloramaAnimFolder.addBinding(params, 'cycleRepetitionsStart', { min: 0.5, max: 3, step: 0.01, label: 'Start' });
    coloramaAnimFolder.addBinding(params, 'cycleRepetitionsEnd', { min: 0.5, max: 3, step: 0.01, label: 'End' });
    coloramaAnimFolder.addBinding(params, 'cycleRepetitionsStartFrame', { min: 0, max: 500, step: 1, label: 'Start Frame' });

    // Bloom folder
    const bloomFolder = pane.addFolder({ title: 'Bloom', expanded: false });
    bloomFolder.addBinding(params, 'enableBloom', { label: 'Enable' });

    // Film Grain folder
    const filmGrainFolder = pane.addFolder({ title: 'Film Grain', expanded: false });
    filmGrainFolder.addBinding(params, 'enableFilmGrain', { label: 'Enable' });

    // Center folder
    const centerFolder = pane.addFolder({ title: 'Center', expanded: false });
    centerFolder.addBinding(params, 'enableCenterElement', { label: 'Enable' });
    centerFolder.addBinding(params, 'lightStartFrame', { min: 0, max: 1000, step: 0.1, label: 'Light Start Frame' });
    const centerTextBinding = centerFolder.addBinding(params, 'showCenterText', { label: 'Show Text' });
    centerTextBinding.on('change', (ev) => {
      const centerTextEl = document.querySelector('.center-text') as HTMLElement;
      if (centerTextEl) {
        centerTextEl.style.display = ev.value ? 'block' : 'none';
      }
    });

    // Animation Speed folder
    const animSpeedFolder = pane.addFolder({ title: 'Animation Speed', expanded: false });
    animSpeedFolder.addBinding(params, 'centerAnimDuration', { min: 1, max: 20, step: 0.1, label: 'Center Duration (s)' });
    animSpeedFolder.addBinding(params, 'cycleRepetitionsDuration', { min: 10, max: 200, step: 1, label: 'Colorama Duration' });

    // Color Correction folder
    const ccFolder = pane.addFolder({ title: 'Color Correction', expanded: false });
    ccFolder.addBinding(params, 'ccBlackPoint', { min: 0.0, max: 0.5, step: 0.01, label: 'Black Point' });
    ccFolder.addBinding(params, 'ccWhitePoint', { min: 0.5, max: 1.5, step: 0.01, label: 'White Point' });
    ccFolder.addBinding(params, 'ccMidtoneGamma', { min: 0.5, max: 2.0, step: 0.01, label: 'Midtone Gamma' });
    ccFolder.addBinding(params, 'ccGamma', { min: 0.5, max: 3.0, step: 0.01, label: 'Gamma' });
    ccFolder.addBinding(params, 'ccContrast', { min: -0.5, max: 0.5, step: 0.01, label: 'Contrast' });

    // Playback folder
    const playbackFolder = pane.addFolder({ title: 'Playback', expanded: false });
    let video: HTMLVideoElement | null = null;
    const pausedBinding = playbackFolder.addBinding(params, 'paused', { label: 'Paused' });
    pausedBinding.on('change', (ev) => {
      if (video) {
        if (ev.value) {
          video.pause();
        } else {
          video.play();
        }
      }
    });
    playbackFolder.addBinding(params, 'videoStartTime', { min: 0, max: 20, step: 0.1, label: 'Start Time (s)' });
    playbackFolder.addBinding(params, 'videoEndTime', { min: 0, max: 20, step: 0.1, label: 'End Time (s)' });
    playbackFolder.addBinding(params, 'videoCurrentFrame', { min: 0, max: 20, step: 0.1, label: 'Current Frame (s)' });
    playbackFolder.addBinding(params, 'animateLightIndependently', { label: 'Animate Light Independently' });

    // Debug folder
    const debugFolder = pane.addFolder({ title: 'Debug', expanded: false });
    debugFolder.addBinding(params, 'debugMode', {
      label: 'Debug View',
      options: {
        'Off': 0,
        'Outer Displacement': 1,
        'Inner Displacement': 2,
        'Combined Displacement': 3,
        'Solid Core Mask': 4,
        'Edge Mask': 5,
        'Inner Mask': 6,
        'Shape Mask': 7,
        'Shape Gradient': 8,
        'Intensity': 9,
        'Local UVx': 10,
        'Texture Sample': 11,
        'Shape Only (Raw SDF)': 12,
        'Center Colorama Only': 13,
        'Stripe Height Mask': 14,
      },
    });

    // Create program
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: rzpGlassFragShader,
      uniforms: {
        uTime: { value: 0 },
        iResolution: { value: [window.innerWidth * dpr, window.innerHeight * dpr] },
        uDpr: { value: dpr },
        uVideoTexture: { value: videoTexture },
        uGradientMap: { value: coloramaGradientMap },
        uCenterGradientMap: { value: centerGradientMap },
        uEnableDisplacement: { value: 1 },
        uEnableColorama: { value: 1 },
        uEnableBloom: { value: 1 },
        uEnableLightSweep: { value: 1 },
        uEnableFilmGrain: { value: 1 },
        uDebugMode: { value: 0 },
        uInputMin: { value: params.inputMin },
        uInputMax: { value: params.inputMax },
        uModifyGamma: { value: params.modifyGamma },
        uPosterizeLevels: { value: params.posterizeLevels },
        uCycleRepetitions: { value: params.cycleRepetitions },
        uPhaseShift: { value: params.phaseShift },
        uCycleSpeed: { value: params.cycleSpeed },
        uWrapMode: { value: params.wrapMode ? 1 : 0 },
        uReverse: { value: params.reverse ? 1 : 0 },
        uBlendWithOriginal: { value: params.blendWithOriginal },
        uLightIntensity: { value: params.lightIntensity },
        uFrameCount: { value: 0 },
        uLightStartFrame: { value: params.lightStartFrame },
        uNumSegments: { value: params.numSegments },
        uSlitAngle: { value: params.slitAngle },
        uDisplacementX: { value: params.displacementX },
        uDisplacementY: { value: params.displacementY },
        uEnableCenterElement: { value: params.enableCenterElement ? 1 : 0 },
        uCenterAnimDuration: { value: params.centerAnimDuration },
        uCenterAnimTime: { value: 0 },
        uCCBlackPoint: { value: params.ccBlackPoint },
        uCCWhitePoint: { value: params.ccWhitePoint },
        uCCMidtoneGamma: { value: params.ccMidtoneGamma },
        uCCGamma: { value: params.ccGamma },
        uCCContrast: { value: params.ccContrast },
      },
    });

    // Handle resize
    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.iResolution.value = [window.innerWidth * dpr, window.innerHeight * dpr];
    }
    window.addEventListener('resize', resize, false);

    // Create geometry and mesh
    const geometry = new Box(gl, { width: 2, height: 2, depth: 0 });
    const mesh = new Mesh(gl, { geometry, program });

    // Stats.js FPS counter
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

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
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.autoplay = true;
        vid.oncanplaythrough = () => resolve(vid);
        vid.onerror = reject;
        vid.load();
      });
    }

    // Create fallback gradient texture
    function createFallbackGradient(colors: [number, number, number][]): HTMLCanvasElement {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 1;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createLinearGradient(0, 0, 256, 0);
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 1);
      return canvas;
    }

    // Create fallback video texture (procedural)
    function createFallbackVideoCanvas(): HTMLCanvasElement {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      return canvas;
    }

    // Animation state
    let frameCount = 0;
    let lastFrameTime = 0;
    let independentLightTime = 0;
    let lastVideoTime = 0;
    let animationId: number;
    let fallbackCanvas: HTMLCanvasElement | null = null;

    // Update fallback canvas with procedural pattern
    function updateFallbackCanvas(canvas: HTMLCanvasElement, time: number) {
      const ctx = canvas.getContext('2d')!;
      const w = canvas.width;
      const h = canvas.height;

      // Create radial gradient pattern
      const gradient = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.5);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, '#e0e0e0');
      gradient.addColorStop(0.6, '#a0a0a0');
      gradient.addColorStop(1, '#404040');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Add some noise/variation based on time
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.sin(i * 0.001 + time) * 0.5 + 0.5) * 20;
        data[i] = Math.min(255, data[i] + noise);
        data[i + 1] = Math.min(255, data[i + 1] + noise);
        data[i + 2] = Math.min(255, data[i + 2] + noise);
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Render loop
    function update(t: number) {
      stats.begin();
      animationId = requestAnimationFrame(update);

      const currentTime = t * 0.001;
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;
      frameCount++;

      // Update video or fallback texture
      if (video && video.readyState >= video.HAVE_CURRENT_DATA) {
        videoTexture.image = video;
        videoTexture.needsUpdate = true;

        if (params.paused) {
          video.currentTime = params.videoCurrentFrame;
        } else {
          if (video.currentTime < params.videoStartTime || video.currentTime >= params.videoEndTime) {
            video.currentTime = params.videoStartTime;
          }
          params.videoCurrentFrame = video.currentTime;
          pane.refresh();
        }
      } else if (fallbackCanvas) {
        updateFallbackCanvas(fallbackCanvas, currentTime);
        videoTexture.image = fallbackCanvas;
        videoTexture.needsUpdate = true;
      }

      const videoAnimTime = params.videoCurrentFrame - params.videoStartTime;

      program.uniforms.uTime.value = currentTime;
      program.uniforms.uFrameCount.value = videoAnimTime * 30;

      if (params.animateLightIndependently) {
        independentLightTime += deltaTime;
      } else {
        const videoTimeDelta = videoAnimTime - lastVideoTime;
        const isVideoJump = Math.abs(videoTimeDelta) > 0.1 || videoTimeDelta < -0.01;
        if (isVideoJump) {
          independentLightTime = videoAnimTime;
        } else if (!params.paused) {
          independentLightTime += deltaTime;
        }
      }

      lastVideoTime = videoAnimTime;
      program.uniforms.uCenterAnimTime.value = independentLightTime;
      program.uniforms.uCenterAnimDuration.value = params.centerAnimDuration;

      // Sync all uniforms
      program.uniforms.uEnableDisplacement.value = params.enableDisplacement ? 1 : 0;
      program.uniforms.uEnableColorama.value = params.enableColorama ? 1 : 0;
      program.uniforms.uEnableBloom.value = params.enableBloom ? 1 : 0;
      program.uniforms.uEnableLightSweep.value = params.enableLightSweep ? 1 : 0;
      program.uniforms.uEnableFilmGrain.value = params.enableFilmGrain ? 1 : 0;
      program.uniforms.uDebugMode.value = params.debugMode;
      program.uniforms.uInputMin.value = params.inputMin;
      program.uniforms.uInputMax.value = params.inputMax;
      program.uniforms.uModifyGamma.value = params.modifyGamma;
      program.uniforms.uPosterizeLevels.value = params.posterizeLevels;
      program.uniforms.uPhaseShift.value = params.phaseShift;
      program.uniforms.uCycleSpeed.value = params.cycleSpeed;
      program.uniforms.uWrapMode.value = params.wrapMode ? 1 : 0;
      program.uniforms.uReverse.value = params.reverse ? 1 : 0;
      program.uniforms.uBlendWithOriginal.value = params.blendWithOriginal;
      program.uniforms.uLightIntensity.value = params.lightIntensity;
      program.uniforms.uLightStartFrame.value = params.lightStartFrame;
      program.uniforms.uNumSegments.value = params.numSegments;
      program.uniforms.uSlitAngle.value = params.slitAngle;
      program.uniforms.uDisplacementX.value = params.displacementX;
      program.uniforms.uDisplacementY.value = params.displacementY;
      program.uniforms.uEnableCenterElement.value = params.enableCenterElement ? 1 : 0;
      program.uniforms.uCCBlackPoint.value = params.ccBlackPoint;
      program.uniforms.uCCWhitePoint.value = params.ccWhitePoint;
      program.uniforms.uCCMidtoneGamma.value = params.ccMidtoneGamma;
      program.uniforms.uCCGamma.value = params.ccGamma;
      program.uniforms.uCCContrast.value = params.ccContrast;

      // Animate cycleRepetitions
      if (params.animateCycleReps && frameCount > params.cycleRepetitionsStartFrame) {
        const elapsed = frameCount - params.cycleRepetitionsStartFrame;
        const cycleProgress = (elapsed % (params.cycleRepetitionsDuration * 2)) / params.cycleRepetitionsDuration;
        const pingPong = cycleProgress <= 1 ? cycleProgress : 2 - cycleProgress;
        const eased = pingPong * pingPong * (3 - 2 * pingPong);
        const delta = params.cycleRepetitionsEnd - params.cycleRepetitionsStart;
        program.uniforms.uCycleRepetitions.value = params.cycleRepetitionsStart + eased * delta;
        params.cycleRepetitions = program.uniforms.uCycleRepetitions.value;
        pane.refresh();
      } else {
        program.uniforms.uCycleRepetitions.value = params.cycleRepetitions;
      }

      renderer.render({ scene: mesh });
      stats.end();
    }

    // Load assets
    Promise.all([
      loadImage('/colorama-gradient-map-2.jpg').catch(() => null),
      loadImage('/colorama-center-gradient-map.jpg').catch(() => null),
      loadVideo('/base_video.mp4').catch(() => null),
    ])
      .then(([gradientMapImg, centerGradientMapImg, loadedVideo]) => {
        // Set up gradient maps (with fallbacks)
        if (gradientMapImg) {
          coloramaGradientMap.image = gradientMapImg;
        } else {
          // Fallback: green/emerald gradient
          coloramaGradientMap.image = createFallbackGradient([
            [15, 23, 42],      // slate-900
            [20, 184, 166],    // teal-500
            [52, 211, 153],    // emerald-400
            [167, 243, 208],   // emerald-200
            [255, 255, 255],   // white
          ]);
        }
        coloramaGradientMap.needsUpdate = true;

        if (centerGradientMapImg) {
          centerGradientMap.image = centerGradientMapImg;
        } else {
          // Fallback: white to gray gradient
          centerGradientMap.image = createFallbackGradient([
            [128, 128, 128],
            [200, 200, 200],
            [255, 255, 255],
          ]);
        }
        centerGradientMap.needsUpdate = true;

        if (loadedVideo) {
          video = loadedVideo;
          if (params.paused) {
            video.pause();
          } else {
            video.play().catch((e) => {
              console.log('Video autoplay failed:', e);
              document.addEventListener('click', () => video?.play(), { once: true });
            });
          }
        } else {
          // Use fallback canvas
          fallbackCanvas = createFallbackVideoCanvas();
          console.log('Using procedural fallback (video not found). Add base_video.mp4 to public folder for full effect.');
        }

        setAssetsLoaded(true);
        const centerTextEl = document.querySelector('.center-text h1');
        if (centerTextEl) {
          centerTextEl.classList.add('loaded');
        }

        // Start render loop
        animationId = requestAnimationFrame(update);
      })
      .catch((err) => {
        console.error('Failed to load assets:', err);
        setError(`Failed to load assets: ${err}`);
      });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      pane.dispose();
      if (stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom);
      }
      if (gl.canvas.parentNode) {
        gl.canvas.parentNode.removeChild(gl.canvas);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-red-400 font-mono text-sm max-w-lg p-4">
          <h2 className="text-xl mb-2">Error</h2>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Center text overlay */}
      <div
        className="center-text absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ mixBlendMode: 'difference' }}
      >
        <h1
          className="text-5xl font-extralight tracking-tight text-white/90"
          style={{
            fontFamily: 'TASA Orbiter Display, system-ui, sans-serif',
            opacity: assetsLoaded ? 1 : 0,
            transform: assetsLoaded ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out'
          }}
        >
          The Ripple Of Disruption
        </h1>
      </div>

      {/* Asset loading indicator */}
      {!assetsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <div className="text-white text-sm">Loading assets...</div>
        </div>
      )}
    </div>
  );
};

export default SparkRipples;
