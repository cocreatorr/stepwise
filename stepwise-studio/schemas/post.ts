export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Headline of the post.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'URL-friendly identifier (click "Generate" after entering a title).',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Short summary shown in listings and previews.',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Main content of the post (rich text).',
    },
    {
      name: 'bodyMarkdown',
      title: 'Body (Markdown)',
      type: 'text',
      description: 'Optional: Markdown version of the post body.',
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Featured image for the post.',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Reference to the author document.',
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Categories this post belongs to.',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      description: 'Tags associated with this post.',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Publication date of the post.',
    },
    {
      name: 'readingTime',
      title: 'Reading Time',
      type: 'number',
      description: 'Estimated reading time in minutes.',
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Custom title for SEO (optional).',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Custom description for SEO (optional).',
    },
    {
      name: 'openGraphImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Optional: social share image specific to this post.',
      options: { hotspot: true },
    },
    {
      name: "shareable",
      title: "Enable Share Buttons",
      type: "boolean",
      description: "Toggle to show or hide share buttons for this post.",
      initialValue: true // ✅ default to true
    },
    {
      name: "sharePlatforms",
      title: "Share Platforms",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Copy Link", value: "copy" },
          { title: "Twitter", value: "twitter" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "WhatsApp", value: "whatsapp" }
        ]
      },
      description: "Choose which share buttons appear for this post.",
      initialValue: ["linkedin", "whatsapp"] // ✅ default platforms
    }
  ],
};
