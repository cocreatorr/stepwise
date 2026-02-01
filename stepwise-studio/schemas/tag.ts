export default {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The human-readable name of the tag (e.g. "Blog").',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title', // ✅ auto-generate slug from title
        maxLength: 96,
      },
      description:
        'URL-friendly identifier (click "Generate" after entering a title).',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description:
        'Optional: a short description of what this tag represents. Appears on the tag page.',
    },
    {
      name: 'openGraphImage',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'Optional: social share image specific to this tag. Falls back to site default if not set.',
      options: { hotspot: true },
    },
  ],
};
