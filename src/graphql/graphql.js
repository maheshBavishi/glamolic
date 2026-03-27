import { gql } from "graphql-request";
export const GetAllBlogCategories = gql`
  query BlogCategories($pagination: PaginationArg) {
    blogCategories(pagination: $pagination) {
      data {
        id
        attributes {
          name
          slug
          createdAt
          updatedAt
          publishedAt
        }
      }
    }
  }
`;

export const GetAllBlogs = gql`
  query Query($pagination: PaginationArg, $filters: BlogsFiltersInput) {
    blog(pagination: $pagination, filters: $filters) {
      data {
        id
        attributes {
          title
          updatedAt
          slug
          shortDescription
          publishedAt
          createdAt
          coverImage {
            data {
              attributes {
                url
              }
            }
          }
          blog_categories {
            data {
              id
              attributes {
                name
                slug
                createdAt
                updatedAt
                publishedAt
              }
            }
          }
        }
      }
      meta {
        pagination {
          total
          page
          pageSize
          pageCount
        }
      }
    }
  }
`;

export const GetBlogDetails = gql`
  query Query($filters: BlogsFiltersInput, $pagination: PaginationArg) {
    blog(filters: $filters) {
      data {
        id
        attributes {
          slug
          title
          shortDescription
          coverImage {
            data {
              id
              attributes {
                url
              }
            }
          }
          blogDetails
          Blog_FAQ(pagination: $pagination) {
            id
            question
            answer
          }
          Author {
            id
            name
            authorProfile {
              data {
                id
                attributes {
                  url
                }
              }
            }
            biography
            autherPosition
          }
          SEO {
            id
            title
            description
            Image {
              data {
                id
                attributes {
                  url
                }
              }
            }
            keywords
            faqSchema
          }
          blog_categories {
            data {
              id
              attributes {
                name
                slug
                createdAt
                updatedAt
                publishedAt
              }
            }
          }
          createdAt
          updatedAt
          publishedAt
        }
      }
    }
  }
`;

export const GetSEOData = gql`
  query GlamolicAiSeos($filters: GlamolicAiSeoFiltersInput) {
    glamolicAiSeos(filters: $filters) {
      data {
        id
        attributes {
          Slug
          URL
          Title
          Description
          Image {
            data {
              id
              attributes {
                url
              }
            }
          }
          createdAt
          updatedAt
          publishedAt
        }
      }
    }
  }
`;
