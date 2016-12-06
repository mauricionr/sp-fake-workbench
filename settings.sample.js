var settings = {
    spsave: {//sharepoint online or on primise settings
        username: "develina.devsson@mydevtenant.onmicrosoft.com",
        password: "pass@word1",
        siteUrl: "https://mydevtenant.sharepoint.com/"
    },
    testing: {//settings for pnp-js-core and nodejs
        clientId: "{ client id }",
        clientSecret: "{ client secret }",
        enableWebTests: true,
        siteUrl: "{ site collection url }",
    }
}
module.exports = settings;