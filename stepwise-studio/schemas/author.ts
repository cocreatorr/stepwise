export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name of the author.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name', // ✅ auto-generate slug from name
        maxLength: 96,
      },
      description:
        'URL-friendly identifier (click "Generate" after entering a name).',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'Short biography of the author.',
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload a profile picture of the author.',
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Links to the author’s social media profiles.',
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
  ],
};
