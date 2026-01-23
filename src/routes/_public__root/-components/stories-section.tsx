import { ArrowRight } from 'lucide-react'
import {
  Stories,
  StoriesContent,
  Story,
  StoryAuthor,
  StoryAuthorImage,
  StoryAuthorName,
  StoryOverlay
} from '@/components/kibo-ui/stories'
import { Link } from '@tanstack/react-router'

const STORY_AUTHOR = 'Pasio Padel Club'
const STORY_AVATAR = '/images/stories/avatar.webp'

const STORY_IMAGES = [
  '/images/stories/story-01.webp',
  '/images/stories/story-02.webp',
  '/images/stories/story-03.webp',
  '/images/stories/story-04.webp',
  '/images/stories/story-09.webp',
  '/images/stories/story-05.webp',
  '/images/stories/story-06.webp',
  '/images/stories/story-07.webp',
  '/images/stories/story-08.webp'
] as const satisfies string[]

export const StoriesSection = () => {
  return (
    <section className="section-py bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold md:text-2xl">
            Moments au club
          </h2>
          <Link
            to="/galerie"
            className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Voir la galerie
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
      <Stories className="lg:container">
        <StoriesContent className="px-6 py-4 lg:px-0">
          {STORY_IMAGES.map((image, index) => {
            return (
              <Story
                key={image}
                className="aspect-[3/4] w-[180px] hover:shadow-none md:w-[220px]"
              >
                <img
                  src={image}
                  alt={`Story ${index + 1} - ${STORY_AUTHOR}`}
                  className="absolute inset-0 size-full object-cover"
                />
                <StoryOverlay />
                <StoryAuthor>
                  <StoryAuthorImage name={STORY_AUTHOR} src={STORY_AVATAR} />
                  <StoryAuthorName>{STORY_AUTHOR}</StoryAuthorName>
                </StoryAuthor>
              </Story>
            )
          })}
        </StoriesContent>
      </Stories>
    </section>
  )
}
