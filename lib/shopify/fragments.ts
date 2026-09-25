const IMAGE = 'url altText width height';

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    productType
    tags
    seo { title description }
    featuredImage { ${IMAGE} }
    images(first: 20) { nodes { ${IMAGE} } }
    media(first: 20) {
      nodes {
        mediaContentType
        alt
        previewImage { ${IMAGE} }
        ... on MediaImage { image { ${IMAGE} } }
        ... on Video { sources { url mimeType format height width } }
      }
    }
    priceRange { minVariantPrice { amount currencyCode } }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
  }
`;

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    attributes { key value }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
          amountPerQuantity { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            image { ${IMAGE} }
            product { id handle title }
          }
        }
      }
    }
  }
`;
