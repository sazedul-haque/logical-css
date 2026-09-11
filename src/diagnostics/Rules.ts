/**
 * Rules for detecting physical CSS properties and direction-sensitive values
 */

import type { LogicalPropertyRule, DirectionSensitiveValue } from '../types';

/**
 * Mapping of physical properties to logical properties
 */
export const PHYSICAL_TO_LOGICAL: Record<string, LogicalPropertyRule> = {
  // Margin properties (Inline)
  'margin-left': {
    physical: 'margin-left',
    logical: 'margin-inline-start',
    type: 'property',
    category: 'inline',
    reason: 'Use margin-inline-start for RTL support',
  },
  'margin-right': {
    physical: 'margin-right',
    logical: 'margin-inline-end',
    type: 'property',
    category: 'inline',
    reason: 'Use margin-inline-end for RTL support',
  },

  // Margin properties (Block)
  'margin-top': {
    physical: 'margin-top',
    logical: 'margin-block-start',
    type: 'property',
    category: 'block',
    reason: 'Use margin-block-start for logical writing mode support',
  },
  'margin-bottom': {
    physical: 'margin-bottom',
    logical: 'margin-block-end',
    type: 'property',
    category: 'block',
    reason: 'Use margin-block-end for logical writing mode support',
  },

  // Padding properties (Inline)
  'padding-left': {
    physical: 'padding-left',
    logical: 'padding-inline-start',
    type: 'property',
    category: 'inline',
    reason: 'Use padding-inline-start for RTL support',
  },
  'padding-right': {
    physical: 'padding-right',
    logical: 'padding-inline-end',
    type: 'property',
    category: 'inline',
    reason: 'Use padding-inline-end for RTL support',
  },

  // Padding properties (Block)
  'padding-top': {
    physical: 'padding-top',
    logical: 'padding-block-start',
    type: 'property',
    category: 'block',
    reason: 'Use padding-block-start for logical writing mode support',
  },
  'padding-bottom': {
    physical: 'padding-bottom',
    logical: 'padding-block-end',
    type: 'property',
    category: 'block',
    reason: 'Use padding-block-end for logical writing mode support',
  },

  // Position properties (Inline)
  left: {
    physical: 'left',
    logical: 'inset-inline-start',
    type: 'property',
    category: 'inline',
    reason: 'Use inset-inline-start for RTL support',
  },
  right: {
    physical: 'right',
    logical: 'inset-inline-end',
    type: 'property',
    category: 'inline',
    reason: 'Use inset-inline-end for RTL support',
  },

  // Position properties (Block)
  top: {
    physical: 'top',
    logical: 'inset-block-start',
    type: 'property',
    category: 'block',
    reason: 'Use inset-block-start for logical writing mode support',
  },
  bottom: {
    physical: 'bottom',
    logical: 'inset-block-end',
    type: 'property',
    category: 'block',
    reason: 'Use inset-block-end for logical writing mode support',
  },

  // Border properties (Inline)
  'border-left': {
    physical: 'border-left',
    logical: 'border-inline-start',
    type: 'property',
    category: 'inline',
    reason: 'Use border-inline-start for RTL support',
  },
  'border-right': {
    physical: 'border-right',
    logical: 'border-inline-end',
    type: 'property',
    category: 'inline',
    reason: 'Use border-inline-end for RTL support',
  },
  'border-left-width': {
    physical: 'border-left-width',
    logical: 'border-inline-start-width',
    type: 'property',
    category: 'inline',
    reason: 'Use border-inline-start-width for RTL support',
  },
  'border-right-width': {
    physical: 'border-right-width',
    logical: 'border-inline-end-width',
    type: 'property',
    category: 'inline',
    reason: 'Use border-inline-end-width for RTL support',
  },
  'border-left-style': {
    physical: 'border-left-style',
    logical: 'border-inline-start-style',
    type: 'property',
    category: 'inline',
    reason: 'Use border-inline-start-style for RTL support',
  },
  'border-right-style': {
    physical: 'border-right-style',
    logical: 'border-inline-end-style',
    type: 'property',
    category: 'inline',
    reason: 'Use border-inline-end-style for RTL support',
  },
  'border-left-color': {
    physical: 'border-left-color',
    logical: 'border-inline-start-color',
    type: 'property',
    category: 'inline',
    reason: 'Use border-inline-start-color for RTL support',
  },
  'border-right-color': {
    physical: 'border-right-color',
    logical: 'border-inline-end-color',
    type: 'property',
    category: 'inline',
    reason: 'Use border-inline-end-color for RTL support',
  },

  // Border properties (Block)
  'border-top': {
    physical: 'border-top',
    logical: 'border-block-start',
    type: 'property',
    category: 'block',
    reason: 'Use border-block-start for logical writing mode support',
  },
  'border-bottom': {
    physical: 'border-bottom',
    logical: 'border-block-end',
    type: 'property',
    category: 'block',
    reason: 'Use border-block-end for logical writing mode support',
  },
  'border-top-width': {
    physical: 'border-top-width',
    logical: 'border-block-start-width',
    type: 'property',
    category: 'block',
    reason: 'Use border-block-start-width for logical writing mode support',
  },
  'border-bottom-width': {
    physical: 'border-bottom-width',
    logical: 'border-block-end-width',
    type: 'property',
    category: 'block',
    reason: 'Use border-block-end-width for logical writing mode support',
  },
  'border-top-style': {
    physical: 'border-top-style',
    logical: 'border-block-start-style',
    type: 'property',
    category: 'block',
    reason: 'Use border-block-start-style for logical writing mode support',
  },
  'border-bottom-style': {
    physical: 'border-bottom-style',
    logical: 'border-block-end-style',
    type: 'property',
    category: 'block',
    reason: 'Use border-block-end-style for logical writing mode support',
  },
  'border-top-color': {
    physical: 'border-top-color',
    logical: 'border-block-start-color',
    type: 'property',
    category: 'block',
    reason: 'Use border-block-start-color for logical writing mode support',
  },
  'border-bottom-color': {
    physical: 'border-bottom-color',
    logical: 'border-block-end-color',
    type: 'property',
    category: 'block',
    reason: 'Use border-block-end-color for logical writing mode support',
  },

  // Border radius properties
  'border-top-left-radius': {
    physical: 'border-top-left-radius',
    logical: 'border-start-start-radius',
    type: 'property',
    category: 'inline',
    reason: 'Use border-start-start-radius for RTL support',
  },
  'border-top-right-radius': {
    physical: 'border-top-right-radius',
    logical: 'border-start-end-radius',
    type: 'property',
    category: 'inline',
    reason: 'Use border-start-end-radius for RTL support',
  },
  'border-bottom-left-radius': {
    physical: 'border-bottom-left-radius',
    logical: 'border-end-start-radius',
    type: 'property',
    category: 'inline',
    reason: 'Use border-end-start-radius for RTL support',
  },
  'border-bottom-right-radius': {
    physical: 'border-bottom-right-radius',
    logical: 'border-end-end-radius',
    type: 'property',
    category: 'inline',
    reason: 'Use border-end-end-radius for RTL support',
  },

  // Scroll margin & padding (Inline)
  'scroll-margin-left': {
    physical: 'scroll-margin-left',
    logical: 'scroll-margin-inline-start',
    type: 'property',
    category: 'inline',
    reason: 'Use scroll-margin-inline-start for RTL support',
  },
  'scroll-margin-right': {
    physical: 'scroll-margin-right',
    logical: 'scroll-margin-inline-end',
    type: 'property',
    category: 'inline',
    reason: 'Use scroll-margin-inline-end for RTL support',
  },
  'scroll-padding-left': {
    physical: 'scroll-padding-left',
    logical: 'scroll-padding-inline-start',
    type: 'property',
    category: 'inline',
    reason: 'Use scroll-padding-inline-start for RTL support',
  },
  'scroll-padding-right': {
    physical: 'scroll-padding-right',
    logical: 'scroll-padding-inline-end',
    type: 'property',
    category: 'inline',
    reason: 'Use scroll-padding-inline-end for RTL support',
  },

  // Scroll margin & padding (Block)
  'scroll-margin-top': {
    physical: 'scroll-margin-top',
    logical: 'scroll-margin-block-start',
    type: 'property',
    category: 'block',
    reason: 'Use scroll-margin-block-start for logical writing mode support',
  },
  'scroll-margin-bottom': {
    physical: 'scroll-margin-bottom',
    logical: 'scroll-margin-block-end',
    type: 'property',
    category: 'block',
    reason: 'Use scroll-margin-block-end for logical writing mode support',
  },
  'scroll-padding-top': {
    physical: 'scroll-padding-top',
    logical: 'scroll-padding-block-start',
    type: 'property',
    category: 'block',
    reason: 'Use scroll-padding-block-start for logical writing mode support',
  },
  'scroll-padding-bottom': {
    physical: 'scroll-padding-bottom',
    logical: 'scroll-padding-block-end',
    type: 'property',
    category: 'block',
    reason: 'Use scroll-padding-block-end for logical writing mode support',
  },

  // Overflow / Overscroll (Block/Inline)
  'overflow-x': {
    physical: 'overflow-x',
    logical: 'overflow-inline',
    type: 'property',
    category: 'block',
    reason: 'Use overflow-inline for logical layout support',
  },
  'overflow-y': {
    physical: 'overflow-y',
    logical: 'overflow-block',
    type: 'property',
    category: 'block',
    reason: 'Use overflow-block for logical layout support',
  },
  'overscroll-behavior-x': {
    physical: 'overscroll-behavior-x',
    logical: 'overscroll-behavior-inline',
    type: 'property',
    category: 'block',
    reason: 'Use overscroll-behavior-inline for logical layout support',
  },
  'overscroll-behavior-y': {
    physical: 'overscroll-behavior-y',
    logical: 'overscroll-behavior-block',
    type: 'property',
    category: 'block',
    reason: 'Use overscroll-behavior-block for logical layout support',
  },

  // Dimension / Sizing properties (Size)
  width: {
    physical: 'width',
    logical: 'inline-size',
    type: 'property',
    category: 'size',
    reason: 'Use inline-size for logical writing mode support',
  },
  height: {
    physical: 'height',
    logical: 'block-size',
    type: 'property',
    category: 'size',
    reason: 'Use block-size for logical writing mode support',
  },
  'min-width': {
    physical: 'min-width',
    logical: 'min-inline-size',
    type: 'property',
    category: 'size',
    reason: 'Use min-inline-size for logical writing mode support',
  },
  'max-width': {
    physical: 'max-width',
    logical: 'max-inline-size',
    type: 'property',
    category: 'size',
    reason: 'Use max-inline-size for logical writing mode support',
  },
  'min-height': {
    physical: 'min-height',
    logical: 'min-block-size',
    type: 'property',
    category: 'size',
    reason: 'Use min-block-size for logical writing mode support',
  },
  'max-height': {
    physical: 'max-height',
    logical: 'max-block-size',
    type: 'property',
    category: 'size',
    reason: 'Use max-block-size for logical writing mode support',
  },
};

/**
 * Mapping of direction-sensitive values
 */
export const DIRECTION_SENSITIVE_VALUES: Record<string, DirectionSensitiveValue[]> = {
  'text-align': [
    {
      property: 'text-align',
      physical: 'left',
      logical: 'start',
      category: 'inline',
      reason: 'Use text-align: start for RTL support',
    },
    {
      property: 'text-align',
      physical: 'right',
      logical: 'end',
      category: 'inline',
      reason: 'Use text-align: end for RTL support',
    },
  ],
  float: [
    {
      property: 'float',
      physical: 'left',
      logical: 'inline-start',
      category: 'inline',
      reason: 'Use float: inline-start for RTL support',
    },
    {
      property: 'float',
      physical: 'right',
      logical: 'inline-end',
      category: 'inline',
      reason: 'Use float: inline-end for RTL support',
    },
  ],
  clear: [
    {
      property: 'clear',
      physical: 'left',
      logical: 'inline-start',
      category: 'inline',
      reason: 'Use clear: inline-start for RTL support',
    },
    {
      property: 'clear',
      physical: 'right',
      logical: 'inline-end',
      category: 'inline',
      reason: 'Use clear: inline-end for RTL support',
    },
  ],
  'caption-side': [
    {
      property: 'caption-side',
      physical: 'left',
      logical: 'inline-start',
      category: 'inline',
      reason: 'Use caption-side: inline-start for RTL support',
    },
    {
      property: 'caption-side',
      physical: 'right',
      logical: 'inline-end',
      category: 'inline',
      reason: 'Use caption-side: inline-end for RTL support',
    },
    {
      property: 'caption-side',
      physical: 'top',
      logical: 'block-start',
      category: 'block',
      reason: 'Use caption-side: block-start for logical writing mode support',
    },
    {
      property: 'caption-side',
      physical: 'bottom',
      logical: 'block-end',
      category: 'block',
      reason: 'Use caption-side: block-end for logical writing mode support',
    },
  ],
  resize: [
    {
      property: 'resize',
      physical: 'horizontal',
      logical: 'inline',
      category: 'inline',
      reason: 'Use resize: inline for RTL/logical support',
    },
    {
      property: 'resize',
      physical: 'vertical',
      logical: 'block',
      category: 'block',
      reason: 'Use resize: block for logical writing mode support',
    },
  ],
};

/**
 * Shorthand properties that may contain direction-sensitive values
 */
export const SHORTHAND_PROPERTIES = new Set([
  'margin',
  'padding',
  'border-radius',
  'border',
  'border-width',
  'border-style',
  'border-color',
]);

/**
 * Check if a property is a physical property
 */
export function isPhysicalProperty(property: string): boolean {
  return property in PHYSICAL_TO_LOGICAL;
}

/**
 * Check if a property-value combination is direction-sensitive
 */
export function isDirectionSensitiveValue(property: string, value: string): boolean {
  const values = DIRECTION_SENSITIVE_VALUES[property];
  if (!values) return false;

  const valueParts = value.toLowerCase().split(/\s+/);
  return values.some((v) => valueParts.includes(v.physical));
}

/**
 * Get the logical property for a physical property
 */
export function getLogicalProperty(property: string): LogicalPropertyRule | undefined {
  return PHYSICAL_TO_LOGICAL[property];
}

/**
 * Get the logical value for a direction-sensitive value
 */
export function getLogicalValue(property: string, value: string): DirectionSensitiveValue | undefined {
  const values = DIRECTION_SENSITIVE_VALUES[property];
  if (!values) return undefined;

  const valueParts = value.toLowerCase().split(/\s+/);
  return values.find((v) => valueParts.includes(v.physical));
}

/**
 * Check if a property is a shorthand
 */
export function isShorthandProperty(property: string): boolean {
  return SHORTHAND_PROPERTIES.has(property);
}
