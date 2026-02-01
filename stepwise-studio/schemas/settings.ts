export default {
  name: 'settings',
  title: 'Site Settings',
  type: 'document',

  // ✅ Singleton: only update & publish allowed
  __experimental_actions: ['update', 'publish'],

  fields: [
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description:
        'The main title of your website, shown in the header or browser tab.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A short description or tagline for your site.',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload your site logo (supports cropping).',
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Upload a favicon image for browser tabs.',
    },
    {
      name: 'openGraphImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Default social share image for the site.',
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Links to your social media profiles.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Platform', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    },
    {
      name: 'tags',
      title: 'Navigation Tags',
      type: 'array',
      description: 'Tags used for homepage navigation.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'The text shown in the navigation menu.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                // ✅ Fix: reference the tag object itself
                source: (tag) => tag.label,
                maxLength: 96,
              },
              description:
                'URL-friendly identifier (click "Generate" after entering a label).',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              description:
                'Optional: set display order for navigation tags.',
            },
          ],
        },
      ],
    },
  ],
};
