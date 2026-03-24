const express = require('express');
const bigCommerceRoute = express.Router();
const { bgCommerceUserController } = require("../Controller/bgComerceUserController");

// shopifyRoute.get('/consultant-theme', proxyThemeAssetsController);
// shopifyRoute.get('/consultant-theme/login', proxyShopifyConsultantPage);
// shopifyRoute.get('/consultant-theme/consultant-dashboard', proxyShopifyConsultantLoginPage);
// shopifyRoute.get('/consultant-theme/consultant-chats-section', proxySHopifyConsultantChat);
// shopifyRoute.get('/consultant-theme/view-profile', proxyShopifyViewProfile);
// shopifyRoute.get('/consultant-theme/chats-c', proxyShopifyChatSection);
// shopifyRoute.get('/consultant-theme/profile', proxyProfileSection);
// shopifyRoute.get('/consultant-theme/video-calling-page', proxyShopifyCallAccepted);
// shopifyRoute.get('/app/is-installed/:shop', appIsInstalled);

bigCommerceRoute.post('/bigcommerce-user', bgCommerceUserController);

module.exports = bigCommerceRoute;
