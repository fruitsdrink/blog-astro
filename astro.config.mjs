// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import partytown from '@astrojs/partytown';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import icon from 'astro-icon';


import netlify from '@astrojs/netlify';


// https://astro.build/config
export default defineConfig({
  integrations: [react(), partytown(), mdx(), icon()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: netlify()
});