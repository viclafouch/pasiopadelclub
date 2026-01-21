import {
  Stories,
  StoriesContent,
  Story,
  StoryAuthor,
  StoryAuthorImage,
  StoryAuthorName,
  StoryImage,
  StoryOverlay
} from '@/components/kibo-ui/stories'

type PlaceholderStory = {
  id: number
  image: string
  author: string
  avatar: string
}

const PLACEHOLDER_STORIES = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=600&fit=crop',
    author: 'Lucas M.',
    avatar: ''
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=600&fit=crop',
    author: 'Sophie D.',
    avatar: ''
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&h=600&fit=crop',
    author: 'Thomas R.',
    avatar: ''
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
    author: 'Marie L.',
    avatar: ''
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=600&fit=crop',
    author: 'Antoine B.',
    avatar: ''
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400&h=600&fit=crop',
    author: 'Camille P.',
    avatar: ''
  }
] as const satisfies PlaceholderStory[]

export const StoriesSection = () => {
  return (
    <section className="section-py bg-muted/30">
      <div className="container">
        <h2 className="mb-8 font-display text-xl font-bold md:text-2xl">
          Moments au club
        </h2>
        <Stories>
          <StoriesContent>
            {PLACEHOLDER_STORIES.map((story) => {
              return (
                <Story
                  key={story.id}
                  className="aspect-[3/4] w-[180px] md:w-[220px]"
                >
                  <StoryImage
                    src={story.image}
                    alt={`Story de ${story.author}`}
                  />
                  <StoryOverlay />
                  <StoryAuthor>
                    <StoryAuthorImage name={story.author} src={story.avatar} />
                    <StoryAuthorName>{story.author}</StoryAuthorName>
                  </StoryAuthor>
                </Story>
              )
            })}
          </StoriesContent>
        </Stories>
      </div>
    </section>
  )
}
