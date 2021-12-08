/**
 * @typedef {import('hast').Root} Root
 */

import Slugger from 'github-slugger'
import {hasProperty} from 'hast-util-has-property'
import {headingRank} from 'hast-util-heading-rank'
import {toString} from 'hast-util-to-string'
import {visit} from 'unist-util-visit'
import deburr from 'lodash/deburr.js'

const slugs = new Slugger()

/**
 * Plugin to add `id`s to headings.
 *
 * @type {import('unified').Plugin<[{
 *   enableCustomId?: boolean,
 *   maintainCase?: boolean,
 *   removeAccents?: boolean
 * }], Root>}
 */
export default function rehypeSlug({
                                     enableCustomId = false,
                                     maintainCase = false,
                                     removeAccents = false
                                   } = {}) {
  return (tree) => {
    slugs.reset()

    visit(tree, 'element', (node) => {
      if (headingRank(node) && node.properties && !hasProperty(node, 'id')) {

        let id
        if (enableCustomId && node.children.length > 0) {
          const last = node.children[node.children.length - 1]
          // This regex matches to preceding spaces and {#custom-id} at the end of a string.
          // Also, checks the text of node won't be empty after the removal of {#custom-id}.
          const match = /^(.*?)\s*\{#([\w-]+)\}$/.exec(toString(last))
          if (match && (match[1] || node.children.length > 1)) {
            id = match[2]
            // Remove the custom ID from the original text.
            if (match[1]) {
              // @ts-ignore
              last.value = match[1]
            } else {
              node.children.pop()
            }
          }
        }
        if (!id) {
          const slug = slugs.slug(toString(node), maintainCase)
          id = removeAccents ? deburr(slug) : slug
        }
        node.properties.id = id;
      }
    })
  }
}
