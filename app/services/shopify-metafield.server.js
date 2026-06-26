export async function saveAnnouncementMetafield(
    admin,
    announcementText
) {
    // 1. Fetch current shop ID dynamically
    const shopQuery = await admin.graphql(
        `#graphql
        query {
          shop {
            id
          }
        }
        `
    );
    const shopQueryResult = await shopQuery.json();
    const shopId = shopQueryResult?.data?.shop?.id;

    if (!shopId) {
        throw new Error("Failed to retrieve Shop ID from Shopify Admin API");
    }

    // 2. Set the metafield on the dynamic shop ID
    const response = await admin.graphql(
        `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
            namespace
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
        {
            variables: {
                metafields: [
                    {
                        ownerId: shopId,
                        namespace: "my_app",
                        key: "announcement",
                        type: "single_line_text_field",
                        value: announcementText,
                    },
                ],
            },
        }
    );

    const result = await response.json();
    console.log("MetafieldsSet Result:", JSON.stringify(result, null, 2));
    return result;
}