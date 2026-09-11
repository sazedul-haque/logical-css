/**
 * Tests for CSS Rules
 */

import { describe, it, expect } from 'vitest';
import {
  isPhysicalProperty,
  isDirectionSensitiveValue,
  getLogicalProperty,
  getLogicalValue,
  isShorthandProperty,
} from '../../src/diagnostics/Rules';

describe('Rules', () => {
  describe('isPhysicalProperty', () => {
    it('should identify margin-left as physical', () => {
      expect(isPhysicalProperty('margin-left')).toBe(true);
    });

    it('should identify margin-right as physical', () => {
      expect(isPhysicalProperty('margin-right')).toBe(true);
    });

    it('should identify padding-left as physical', () => {
      expect(isPhysicalProperty('padding-left')).toBe(true);
    });

    it('should identify left as physical', () => {
      expect(isPhysicalProperty('left')).toBe(true);
    });

    it('should identify right as physical', () => {
      expect(isPhysicalProperty('right')).toBe(true);
    });

    it('should identify border-left as physical', () => {
      expect(isPhysicalProperty('border-left')).toBe(true);
    });

    it('should identify border-top-left-radius as physical', () => {
      expect(isPhysicalProperty('border-top-left-radius')).toBe(true);
    });

    it('should identify scroll-margin-left as physical', () => {
      expect(isPhysicalProperty('scroll-margin-left')).toBe(true);
    });

    it('should identify top as physical', () => {
      expect(isPhysicalProperty('top')).toBe(true);
    });

    it('should identify margin-top as physical', () => {
      expect(isPhysicalProperty('margin-top')).toBe(true);
    });

    it('should identify width as physical', () => {
      expect(isPhysicalProperty('width')).toBe(true);
    });

    it('should not identify margin-inline-start as physical', () => {
      expect(isPhysicalProperty('margin-inline-start')).toBe(false);
    });

    it('should not identify color as physical', () => {
      expect(isPhysicalProperty('color')).toBe(false);
    });
  });

  describe('isDirectionSensitiveValue', () => {
    it('should identify text-align: left as direction-sensitive', () => {
      expect(isDirectionSensitiveValue('text-align', 'left')).toBe(true);
    });

    it('should identify text-align: right as direction-sensitive', () => {
      expect(isDirectionSensitiveValue('text-align', 'right')).toBe(true);
    });

    it('should identify float: left as direction-sensitive', () => {
      expect(isDirectionSensitiveValue('float', 'left')).toBe(true);
    });

    it('should identify clear: right as direction-sensitive', () => {
      expect(isDirectionSensitiveValue('clear', 'right')).toBe(true);
    });

    it('should identify caption-side: left as direction-sensitive', () => {
      expect(isDirectionSensitiveValue('caption-side', 'left')).toBe(true);
    });

    it('should identify resize: horizontal as direction-sensitive', () => {
      expect(isDirectionSensitiveValue('resize', 'horizontal')).toBe(true);
    });

    it('should not identify background-position as direction-sensitive (not supported by CSS)', () => {
      expect(isDirectionSensitiveValue('background-position', 'left')).toBe(false);
      expect(isDirectionSensitiveValue('background-position', 'right 8px center')).toBe(false);
    });

    it('should not identify transform-origin as direction-sensitive (not supported by CSS)', () => {
      expect(isDirectionSensitiveValue('transform-origin', 'left top')).toBe(false);
    });

    it('should not identify text-align: center as direction-sensitive', () => {
      expect(isDirectionSensitiveValue('text-align', 'center')).toBe(false);
    });

    it('should not identify color: red as direction-sensitive', () => {
      expect(isDirectionSensitiveValue('color', 'red')).toBe(false);
    });
  });

  describe('getLogicalProperty', () => {
    it('should return margin-inline-start for margin-left', () => {
      const rule = getLogicalProperty('margin-left');
      expect(rule?.logical).toBe('margin-inline-start');
      expect(rule?.physical).toBe('margin-left');
    });

    it('should return margin-inline-end for margin-right', () => {
      const rule = getLogicalProperty('margin-right');
      expect(rule?.logical).toBe('margin-inline-end');
    });

    it('should return inset-inline-start for left', () => {
      const rule = getLogicalProperty('left');
      expect(rule?.logical).toBe('inset-inline-start');
    });

    it('should return inset-inline-end for right', () => {
      const rule = getLogicalProperty('right');
      expect(rule?.logical).toBe('inset-inline-end');
    });

    it('should return undefined for non-physical property', () => {
      const rule = getLogicalProperty('color');
      expect(rule).toBeUndefined();
    });
  });

  describe('getLogicalValue', () => {
    it('should return start for text-align: left', () => {
      const rule = getLogicalValue('text-align', 'left');
      expect(rule?.logical).toBe('start');
      expect(rule?.physical).toBe('left');
    });

    it('should return end for text-align: right', () => {
      const rule = getLogicalValue('text-align', 'right');
      expect(rule?.logical).toBe('end');
    });

    it('should return inline-start for float: left', () => {
      const rule = getLogicalValue('float', 'left');
      expect(rule?.logical).toBe('inline-start');
    });

    it('should return undefined for non-direction-sensitive value', () => {
      const rule = getLogicalValue('text-align', 'center');
      expect(rule).toBeUndefined();
    });
  });

  describe('isShorthandProperty', () => {
    it('should identify margin as shorthand', () => {
      expect(isShorthandProperty('margin')).toBe(true);
    });

    it('should identify padding as shorthand', () => {
      expect(isShorthandProperty('padding')).toBe(true);
    });

    it('should identify border-radius as shorthand', () => {
      expect(isShorthandProperty('border-radius')).toBe(true);
    });

    it('should not identify background-position as shorthand', () => {
      expect(isShorthandProperty('background-position')).toBe(false);
    });

    it('should not identify margin-left as shorthand', () => {
      expect(isShorthandProperty('margin-left')).toBe(false);
    });

    it('should not identify color as shorthand', () => {
      expect(isShorthandProperty('color')).toBe(false);
    });
  });
});
