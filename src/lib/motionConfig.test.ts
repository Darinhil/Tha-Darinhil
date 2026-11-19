import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTiltTransform,
  clamp,
  getResponsiveMotionProfile,
  lerp,
  splitTextChars,
  splitTextWords,
} from './motionConfig';

test('clamp constrains values within bounds', () => {
  assert.equal(clamp(15, 0, 10), 10);
  assert.equal(clamp(-5, 0, 10), 0);
  assert.equal(clamp(5, 0, 10), 5);
});

test('lerp interpolates smoothly between endpoints', () => {
  assert.equal(lerp(0, 100, 0.5), 50);
  assert.equal(lerp(10, 20, 0), 10);
  assert.equal(lerp(10, 20, 2), 20);
});

test('calculateTiltTransform computes symmetric 3D tilt and glare positions', () => {
  const center = calculateTiltTransform(0, 0, 10);
  assert.deepEqual(center, { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  const corner = calculateTiltTransform(1, -1, 8);
  assert.equal(corner.rotateX, 8);
  assert.equal(corner.rotateY, 8);
  assert.equal(corner.glareX, 100);
  assert.equal(corner.glareY, 0);
});

test('text splitters preserve characters and words accurately', () => {
  assert.deepEqual(splitTextChars('Tha'), ['T', 'h', 'a']);
  assert.deepEqual(splitTextWords('  Full   Stack  Dev '), ['Full', 'Stack', 'Dev']);
});

test('getResponsiveMotionProfile adapts to reduced motion, mobile, tablet, and desktop', () => {
  const reduced = getResponsiveMotionProfile(1440, true, true);
  assert.equal(reduced.tier, 'reduced');
  assert.equal(reduced.enableCustomCursor, false);
  assert.equal(reduced.enableParallax, false);
  assert.equal(reduced.durationScale, 0);

  const mobile = getResponsiveMotionProfile(390, false, false);
  assert.equal(mobile.tier, 'mobile');
  assert.equal(mobile.enableCustomCursor, false);
  assert.equal(mobile.enable3DTilt, false);

  const tablet = getResponsiveMotionProfile(820, false, false);
  assert.equal(tablet.tier, 'tablet');
  assert.equal(tablet.enableCustomCursor, false);
  assert.equal(tablet.enableParallax, true);

  const desktop = getResponsiveMotionProfile(1440, false, true);
  assert.equal(desktop.tier, 'desktop');
  assert.equal(desktop.enableCustomCursor, true);
  assert.equal(desktop.enable3DTilt, true);
});
