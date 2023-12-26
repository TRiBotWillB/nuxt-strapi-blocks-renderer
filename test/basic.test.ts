import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { $fetch, setup } from '@nuxt/test-utils';

const fetchPage = async (): Promise<string> => {
    let html: string = await $fetch('/');

    // Remove html comment nodes
    html = html.replace(/<!--\[-->/g, '');
    html = html.replace(/<!--]-->/g, '');

    return html;
};

describe('Basic blocks text rendering', async () => {
    await setup({
        rootDir: fileURLToPath(new URL('../playground/basic', import.meta.url)),
    });

    it('Renders the heading nodes', async () => {
        const html: string = await fetchPage();

        expect(html).toContain('<h1>Heading 1</h1>');
        expect(html).toContain('<h2>Heading 2</h2>');
        expect(html).toContain('<h3>Heading 3</h3>');
        expect(html).toContain('<h4>Heading 4</h4>');
        expect(html).toContain('<h5>Heading 5</h5>');
        expect(html).toContain('<h6>Heading 6</h6>');
    });

    it('Renders the text nodes', async () => {
        const html: string = await fetchPage();

        expect(html).toContain('<p>Paragraph</p>');
        expect(html).toContain('<p><strong>Bold</strong></p>');
        expect(html).toContain('<p><em>Italic</em></p>');
        expect(html).toContain('<p><u>Underline</u></p>');
        expect(html).toContain('<p><del>Strikethrough</del></p>');
        expect(html).toContain('<p><code>Code</code></p>');
        expect(html).toContain('<p><a href="https://www.example.com/">Link</a></p>');
    });

    it('Renders the list nodes', async () => {
        const html: string = await fetchPage();

        expect(html).toContain('<ul>' +
            '<li>Unordered list item 1</li>' +
            '<li>Unordered list item 2</li>' +
            '<li>Unordered list item 3</li>' +
        '</ul>');

        expect(html).toContain('<ol>' +
            '<li>Ordered list item 1</li>' +
            '<li>Ordered list item 2</li>' +
            '<li>Ordered list item 3</li>' +
        '</ol>');
    });

    it('Renders the quote node', async () => {
        const html: string = await fetchPage();

        expect(html).toContain('<blockquote>Quote</blockquote>');
    });

    it('Renders the code node', async () => {
        const html: string = await fetchPage();

        expect(html).toContain('<pre>        Code\n    </pre>');
    });

    it('Renders the image node', async () => {
        const html: string = await fetchPage();

        expect(html).toContain('<img ' +
            'src="example_image_df80dd3023.jpg" ' +
            'alt="Image alternative text" ' +
            'width="480" ' +
            'height="320"' +
        '>');
    });
});
