import test from 'tape'
import {rehype} from 'rehype'
import rehypeSlug from './index.js'

test('rehypeSlug', (t) => {
  t.plan(5)

  rehype()
    .data('settings', {fragment: true})
    .use(rehypeSlug)
    .process(
      [
        '<section>',
        '  <h1>Lorem ipsum 😪</h1>',
        '  <h2>dolor—sit—amet</h2>',
        '  <h3>consectetur &amp; adipisicing</h3>',
        '  <h4>elit</h4>',
        '  <h5>elit</h5>',
        '  <p>sed</p>',
        '</section>'
      ].join('\n'),
      (error, file) => {
        t.ifErr(error, 'shouldn’t throw')

        t.equal(
          String(file),
          [
            '<section>',
            '  <h1 id="lorem-ipsum-">Lorem ipsum 😪</h1>',
            '  <h2 id="dolorsitamet">dolor—sit—amet</h2>',
            '  <h3 id="consectetur--adipisicing">consectetur &#x26; adipisicing</h3>',
            '  <h4 id="elit">elit</h4>',
            '  <h5 id="elit-1">elit</h5>',
            '  <p>sed</p>',
            '</section>'
          ].join('\n'),
          'should match'
        )
      }
    )

  rehype()
    .data('settings', {fragment: true})
    .use(rehypeSlug, {
      enableCustomId: true
    })
    .process(
      [
        '<h2>Test {#testing}</h2>',
      ].join('\n'),
      (error, file) => {
        t.equal(
          String(file),
          [
            '<h2 id="testing">Test</h2>'
          ].join('\n'),
          'should match with custom ID'
        )
      }
    )

  rehype()
    .data('settings', {fragment: true})
    .use(rehypeSlug, {
      maintainCase: true
    })
    .process(
      [
        '<h1>Test</h1>',
        '<h2>hello</h2>',
      ].join('\n'),
      (error, file) => {
        t.equal(
          String(file),
          [
            '<h1 id="Test">Test</h1>',
            '<h2 id="hello">hello</h2>',
          ].join('\n'),
          'should maintain casing'
        )
      }
    )

  rehype()
    .data('settings', {fragment: true})
    .use(rehypeSlug, {
      removeAccents: true
    })
    .process(
      [
        '<h1>Héading One</h1>',
        '<h2>Héading Two</h2>',
        '<h3>Héading Three</h3>',
      ].join('\n'),
      (error, file) => {
        t.equal(
          String(file),
          [
            '<h1 id="heading-one">Héading One</h1>',
            '<h2 id="heading-two">Héading Two</h2>',
            '<h3 id="heading-three">Héading Three</h3>',
          ].join('\n'),
          'should remove accents'
        )
      }
    )
})
