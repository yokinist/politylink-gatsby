/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})
console.log(process.env.GOOGLE_ANALYTICS_TRACKING_ID)

module.exports = {
    siteMetadata: {
        title: `PolityLink`,
        description: `PolityLink（ポリティリンク）は政治の「原文」へのポータルサイトです。国会や行政機関の公式サイトに散らばった情報に、まとめてアクセスすることで、政治のイマを一望できます。`,
        author: `PolityLink`
    },
    plugins: [
        {
            resolve: "gatsby-source-graphql",
            options: {
                // This type will contain remote schema Query type
                typeName: "POL",
                // This is the field under which it's accessible
                fieldName: "politylink",
                // URL to query from
                url: "https://graphql.politylink.jp",  // ToDo: switch to localhost on local
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `PolityLink`,
                short_name: `PolityLink`,
                start_url: `/`,
                background_color: `#174a5c`,
                theme_color: `#174a5c`,
                // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
                // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
                display: `standalone`,
                icon: `static/logo.png`, // This path is relative to the root of the site.
            },
        },
        `gatsby-plugin-offline`,
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
                head: true,
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdowns`,
                path: `${__dirname}/src/markdowns`,
            },
        },
        `gatsby-transformer-remark`,
    ]
}
