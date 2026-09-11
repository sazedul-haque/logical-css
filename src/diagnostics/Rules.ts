/**
 * Rules for detecting physical CSS properties and direction-sensitive values
 */

import type { LogicalPropertyRule, DirectionSensitiveValue } from '../types';

/**
 * Mapping of physical properties to logical properties
 */
export const PHYSICAL_TO_LOGICAL: Record<string, LogicalPropertyRule> = {
  // Margin properties
  'margin-left': {
    physical: 'margin-left',
    logical: 'margin-inline-start',
    type: 'property',
    reason: 'Use margin-inline-start for RTL support',
  },
  'margin-right': {
    physical: 'margin-right',
    logical: 'margin-inline-end',
    type: 'property',
    reason: 'Use margin-inline-end for RTL support',
  },
  // Padding properties
  'padding-left': {
    physical: 'padding-left',
    logical: 'padding-inline-start',
    type: 'property',
    reason: 'Use padding-inline-start for RTL support',
  },
  'padding-right': {
    physical: 'padding-right',
    logical: 'padding-inline-end',
    type: 'property',
    reason: 'Use padding-inline-end for RTL support',
  },
  // Position properties
  left: {
    physical: 'left',
    logical: 'inset-inline-start',
    type: 'property',
    reason: 'Use inset-inline-start for RTL support',
  },
  right: {
    physical: 'right',
    logical: 'inset-inline-end',
    type: 'property',
    reason: 'Use inset-inline-end for RTL support',
  },
  // Border properties
  'border-left': {
    physical: 'border-left',
    logical: 'border-inline-start',
    type: 'property',
    reason: 'Use border-inline-start for RTL support',
  },
  'border-right': {
    physical: 'border-right',
    logical: 'border-inline-end',
    type: 'property',
    reason: 'Use border-inline-end for RTL support',
  },
  'border-left-width': {
    physical: 'border-left-width',
    logical: 'border-inline-start-width',
    type: 'property',
    reason: 'Use border-inline-start-width for RTL support',
  },
  'border-right-width': {
    physical: 'border-right-width',
    logical: 'border-inline-end-width',
    type: 'property',
    reason: 'Use border-inline-end-width for RTL support',
  },
  'border-left-style': {
    physical: 'border-left-style',
    logical: 'border-inline-start-style',
    type: 'property',
    reason: 'Use border-inline-start-style for RTL support',
  },
  'border-right-style': {
    physical: 'border-right-style',
    logical: 'border-inline-end-style',
    type: 'property',
    reason: 'Use border-inline-end-style for RTL support',
  },
  'border-left-color': {
    physical: 'border-left-color',
    logical: 'border-inline-start-color',
    type: 'property',
    reason: 'Use border-inline-start-color for RTL support',
  },
  'border-right-color': {
    physical: 'border-right-color',
    logical: 'border-inline-end-color',
    type: 'property',
    reason: 'Use border-inline-end-color for RTL support',
  },
  // Border radius properties
  'border-top-left-radius': {
    physical: 'border-top-left-radius',
    logical: 'border-start-start-radius',
    type: 'property',
    reason: 'Use border-start-start-radius for RTL support',
  },
  'border-top-right-radius': {
    physical: 'border-top-right-radius',
    logical: 'border-start-end-radius',
    type: 'property',
    reason: 'Use border-start-end-radius for RTL support',
  },
  'border-bottom-left-radius': {
    physical: 'border-bottom-left-radius',
    logical: 'border-end-start-radius',
    type: 'property',
    reason: 'Use border-end-start-radius for RTL support',
  },
  'border-bottom-right-radius': {
    physical: 'border-bottom-right-radius',
    logical: 'border-end-end-radius',
    type: 'property',
    reason: 'Use border-end-end-radius for RTL support',
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
      reason: 'Use text-align: start for RTL support',
    },
    {
      property: 'text-align',
      physical: 'right',
      logical: 'end',
      reason: 'Use text-align: end for RTL support',
    },
  ],
  float: [
    {
      property: 'float',
      physical: 'left',
      logical: 'inline-start',
      reason: 'Use float: inline-start for RTL support',
    },
    {
      property: 'float',
      physical: 'right',
      logical: 'inline-end',
      reason: 'Use float: inline-end for RTL support',
    },
  ],
  clear: [
    {
      property: 'clear',
      physical: 'left',
      logical: 'inline-start',
      reason: 'Use clear: inline-start for RTL support',
    },
    {
      property: 'clear',
      physical: 'right',
      logical: 'inline-end',
      reason: 'Use clear: inline-end for RTL support',
    },
  ],
  'background-position': [
    {
      property: 'background-position',
      physical: 'left',
      logical: 'inline-start',
      reason: 'Use background-position: inline-start for RTL support',
    },
    {
      property: 'background-position',
      physical: 'right',
      logical: 'inline-end',
      reason: 'Use background-position: inline-end for RTL support',
    },
  ],
  'transform-origin': [
    {
      property: 'transform-origin',
      physical: 'left',
      logical: 'inline-start',
      reason: 'Use transform-origin: inline-start for RTL support',
    },
    {
      property: 'transform-origin',
      physical: 'right',
      logical: 'inline-end',
      reason: 'Use transform-origin: inline-end for RTL support',
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
  'background-position',
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

  // Extract the value (handle cases like "left center" for background-position)
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
