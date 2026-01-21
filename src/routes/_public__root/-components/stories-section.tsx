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
    image: '/images/stories/story-01.webp',
    author: 'Lucas M.',
    avatar: ''
  },
  {
    id: 2,
    image: '/images/stories/story-02.webp',
    author: 'Sophie D.',
    avatar: ''
  },
  {
    id: 3,
    image: '/images/stories/story-03.webp',
    author: 'Thomas R.',
    avatar: ''
  },
  {
    id: 4,
    image: '/images/stories/story-04.webp',
    author: 'Marie L.',
    avatar: ''
  },
  {
    id: 5,
    image: '/images/stories/story-05.webp',
    author: 'Antoine B.',
    avatar: ''
  },
  {
    id: 6,
    image: '/images/stories/story-06.webp',
    author: 'Camille P.',
    avatar: ''
  }
] as const satisfies readonly PlaceholderStory[]

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
