/// <reference path="./jsx/element-types.d.ts" />
/// <reference path="./jsx/events.d.ts" />
/// <reference path="./jsx/intrinsic-elements.d.ts" />

import * as os from 'os';

const capitalACharCode = 'A'.charCodeAt(0);
const capitalZCharCode = 'Z'.charCodeAt(0);

const isUpper = (input: string, index: number) => {
    const charCode = input.charCodeAt(index);
    return capitalACharCode <= charCode && capitalZCharCode >= charCode;
};

type AttributeValue = number | string | object;

interface Attributes {
    [key: string]: AttributeValue;
}

const toKebabCase = (camelCased: string) => {
    let kebabCased = '';
    for (let i = 0; i < camelCased.length; i++) {
        if (isUpper(camelCased, i)) {
            kebabCased += '-';
            kebabCased += camelCased[i].toLowerCase();
        } else {
            kebabCased += camelCased[i];
        }
    }
    return kebabCased;
};

const escapeAttrNodeValue = (value: string) => {
    return value.replace(/(&)|(")|(\u00A0)/g, function (_, amp, quote) {
        if (amp) return '&amp;';
        if (quote) return '&quot;';
        return '&nbsp;';
    });
};

const attributeValueToString = (val: AttributeValue): string => {
    if (val instanceof Date) {
        return val.toISOString();
    } else {
        return escapeAttrNodeValue(val.toString());
    }
};

const attributesToString = (attributes: Attributes | undefined): string => {
    if (attributes) {
        return ' ' + Object.keys(attributes).map(attribute => `${toKebabCase(attribute)}="${attributeValueToString(attributes[attribute])}"`).join(' ');
    } else {
        return '';
    }
};

const contentsToString = (contents: any[] | undefined) => {
    if (contents) {
        return contents
            .map(elements => Array.isArray(elements) ? elements.join(os.EOL) : elements)
            .join(os.EOL);
    } else {
        return '';
    }
};

const isVoidElement = (tagName: string) => {
    return [
        'area',
        'base',
        'br',
        'col',
        'command',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr'
    ].indexOf(tagName) > -1;
};

export function createElement(name: string, attributes: Attributes | undefined, ...contents: string[]) {
    const tagName = toKebabCase(name);
    if (isVoidElement(tagName) && !contents.length) {
        return `<${tagName}${attributesToString(attributes)}>`;
    } else {
        return `<${tagName}${attributesToString(attributes)}>${contentsToString(contents)}</${tagName}>`;
    }
}
