import { getPostBySlug, getAllSlugs } from 'lib/api'
import { extractText } from 'lib/extract-text'
import { eyecatchLocal } from 'lib/constants'
import { prevNextPost } from 'lib/prev-next-post'
import Meta from 'components/meta'
import Container from 'components/container'
import PostHeader from 'components/post-header'
import PostCategories from '/components/post-categories'
import ConvertBody from '/components/convert-body'
import Pagination from 'components/pagination'
import Image from 'next/image'
// import { getPlaiceholder } from 'plaiceholder'
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from '@/components/two-column'
import PostBody from '@/components/post-body'

export default function Post({
    title,
    publish,
    content,
    eyecatch,
    categories,
    description,
    prevPost,
    nextPost,
}) {
    return (
        <Container>
            <Meta
                pageTitle={title}
                pageDesc={description}
                pageImg={eyecatch.url}
                pageImgW={eyecatch.width}
                pageImgH={eyecatch.height}
            />
            <article>
                <PostHeader title={title} subtitile="Blog Article" publish={publish} />

                <figure>
                    <Image
                        src={eyecatch.url}
                        alt=""
                        layout="responsive"
                        width={eyecatch.width}
                        height={eyecatch.height}
                        sizes="(min-width: 1152px) 1152px, 100vw"
                        priority
                    // placeholder="blur"
                    // blurDataURL={eyecatch.blurDataURL}
                    />
                </figure>

                <TwoColumn>
                    <TwoColumnMain>
                        <PostBody>
                            {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
                            <ConvertBody contentHTML={content} />
                        </PostBody>
                    </TwoColumnMain>
                    <TwoColumnSidebar>
                        <PostCategories categories={categories} />
                    </TwoColumnSidebar>
                </TwoColumn>

                <Pagination
                    prevText={prevPost.title}
                    prevUrl={`/blog/${prevPost.slug}`}
                    nextText={nextPost.title}
                    nextUrl={`/blog/${nextPost.slug}`}
                />
            </article>
        </Container>
    )
}

export async function getStaticPaths() {
    const allSlugs = await getAllSlugs()

    // コンソールログで確認
    // console.log('All Slugs:', allSlugs)

    // allSlugsが配列かどうかチェック
    if (!Array.isArray(allSlugs)) {
        throw new Error('Expected getAllSlugs to return an array');
    }

    return {
        paths: allSlugs.map(({ slug }) => `/blog/${slug}`),
        fallback: false,
    }
}

export async function getStaticProps(context) {
    const slug = context.params.slug
    const post = await getPostBySlug(slug)
    const description = extractText(post.content)
    const eyecatch = post.eyecatch ?? eyecatchLocal

    // const { base64 } = await getPlaiceholder(eyecatch.url)
    // eyecatch.blurDataURL = base64

    const allSlugs = await getAllSlugs()
    const [prevPost, nextPost] = prevNextPost(allSlugs, slug)

    return {
        props: {
            title: post.title,
            publish: post.publishDate,
            content: post.content,
            eyecatch: eyecatch,
            categories: post.categories,
            description: description,
            prevPost: prevPost,
            nextPost: nextPost,
        },
    }
}