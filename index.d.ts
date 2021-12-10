/**
 * Plugin to add `id`s to headings.
 *
 * @type {import('unified').Plugin<[{
 *   enableCustomId?: boolean,
 *   maintainCase?: boolean,
 *   removeAccents?: boolean
 * }], Root>}
 */
export default function rehypeSlug({ enableCustomId, maintainCase, removeAccents }?: {
    enableCustomId?: boolean | undefined;
    maintainCase?: boolean | undefined;
    removeAccents?: boolean | undefined;
}): void | import("unified").Transformer<import("hast").Root, import("hast").Root>;
export type Root = import('hast').Root;
