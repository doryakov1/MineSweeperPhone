var admobid = {};

if (/(android)/i.test(navigator.userAgent)) {
    admobid = { // for Android
        banner: 'ca-app-pub-5265521236094270/2943255083',
        interstitial: 'ca-app-pub-5265521236094270/3875410414',
        rewardvideo: 'ca-app-pub-3940256099942544/5224354917',
    };
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
        banner: 'ca-app-pub-3940256099942544/2934735716',
        interstitial: 'ca-app-pub-3940256099942544/4411468910',
        rewardvideo: 'ca-app-pub-3940256099942544/1712485313',
    };
} else {
    admobid = { // for Windows Phone, deprecated
        banner: '',
        interstitial: '',
        rewardvideo: '',
    };
}

function initApp() {
    if (!AdMob) { alert('admob plugin not ready'); return; }

    // this will create a banner on startup
    AdMob.createBanner({
        adId: admobid.banner,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        overlap: false,
        offsetTopBar: false,
        bgColor: 'black'
    });

    // this will load a full screen ad on startup
    AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow: true
    });
}

if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
    document.addEventListener('deviceready', initApp, false);
} else {
    initApp();
}