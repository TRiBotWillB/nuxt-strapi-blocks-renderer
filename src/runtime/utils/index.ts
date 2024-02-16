import { resolveComponent, useRuntimeConfig, h } from '#imports';

import type { ConcreteComponent, VNode } from 'vue';

import type {
    BlockNode,
    CodeBlockNode,
    DefaultInlineNode,
    HeadingBlockNode,
    ImageBlockNode,
    LinkInlineNode,
    ListBlockNode,
    ListItemInlineNode,
    ParagraphBlockNode,
    QuoteBlockNode,
    TextInlineNode
} from '#strapi-blocks-renderer/types';

import type { ModuleOptions } from '~/src/module';

const prefix = (): string => {
    const { public: { strapiBlocksRenderer } } = useRuntimeConfig();

    return (strapiBlocksRenderer as ModuleOptions).blocksPrefix;
};

export const textInlineNode = (node: TextInlineNode): VNode | string => {
    if (node.bold) return h(resolveComponent(prefix() + 'BoldInlineNode'), () => node.text);
    if (node.italic) return h(resolveComponent(prefix() + 'ItalicInlineNode'), () => node.text);
    if (node.underline) return h(resolveComponent(prefix() + 'UnderlineInlineNode'), () => node.text);
    if (node.strikethrough) return h(resolveComponent(prefix() + 'StrikethroughInlineNode'), () => node.text);
    if (node.code) return h(resolveComponent(prefix() + 'CodeInlineNode'), () => node.text);

    return node.text;
};

export const linkInlineNode = (node: LinkInlineNode): VNode => {
    const linkComponent: string | ConcreteComponent = resolveComponent(prefix() + 'LinkInlineNode');

    return h(linkComponent, { url: node.url }, () => node.children.map((childNode: TextInlineNode) => {
        return textInlineNode(childNode);
    }));
};

export const defaultInlineNode = (node: DefaultInlineNode): VNode | string | undefined => {
    if (node.type === 'link') {
        return linkInlineNode(node);
    }
    else if (node.type === 'text') {
        return textInlineNode(node);
    }
};

export const listItemInlineNode = (node: ListItemInlineNode): VNode => {
    const listItemComponent: string | ConcreteComponent = resolveComponent(prefix() + 'ListItemInlineNode');

    return h(listItemComponent, () => node.children.map(
        (childNode: DefaultInlineNode) => defaultInlineNode(childNode))
    );
};

export const headingBlockNode = (node: HeadingBlockNode): VNode => {
    const headingComponent: string | ConcreteComponent = resolveComponent(prefix() + 'Heading' + node.level + 'Node');

    return h(headingComponent, () => node.children.map(
        (childNode: DefaultInlineNode) => defaultInlineNode(childNode))
    );
};

export const paragraphBlockNode = (node: ParagraphBlockNode): VNode => {
    const paragraphComponent: string | ConcreteComponent = resolveComponent(prefix() + 'ParagraphNode');

    return h(paragraphComponent, () => node.children.map(
        (childNode: DefaultInlineNode) => defaultInlineNode(childNode))
    );
};

export const codeBlockNode = (node: CodeBlockNode): VNode => {
    const codeComponent: string | ConcreteComponent = resolveComponent(prefix() + 'CodeNode');

    return h(codeComponent, () => node.children.map(
        (childNode: TextInlineNode): VNode | string => textInlineNode(childNode))
    );
};

export const quoteBlockNode = (node: QuoteBlockNode): VNode => {
    const quoteComponent: string | ConcreteComponent = resolveComponent(prefix() + 'QuoteNode');

    return h(quoteComponent, () => node.children.map(
        (childNode: DefaultInlineNode) => defaultInlineNode(childNode))
    );
};

export const listBlockNode = (node: ListBlockNode): VNode => {
    const listType: string = node.format === 'ordered' ? 'OrderedListNode' : 'UnorderedListNode';
    const listComponent: string | ConcreteComponent = resolveComponent(prefix() + listType);

    return h(listComponent, () => node.children.map(
        (childNode: ListBlockNode | ListItemInlineNode): VNode | undefined => {
            if (childNode.type === 'list') {
                return listBlockNode(childNode);
            }
            else if (childNode.type === 'list-item') {
                return listItemInlineNode(childNode);
            }
        },
    ));
};

export const imageBlockNode = (node: ImageBlockNode): VNode => {
    const imageComponent: string | ConcreteComponent = resolveComponent(prefix() + 'ImageNode');

    return h(imageComponent, {
        image: node.image,
    });
};

export const renderBlocks = (blockNodes: BlockNode[]): VNode[] => {
    return blockNodes.map((blockNode: BlockNode) => {
        switch (blockNode.type) {
            case 'heading': return headingBlockNode(blockNode);
            case 'paragraph': return paragraphBlockNode(blockNode);
            case 'code': return codeBlockNode(blockNode);
            case 'list': return listBlockNode(blockNode);
            case 'quote': return quoteBlockNode(blockNode);
            case 'image': return imageBlockNode(blockNode);
        }
    });
};
