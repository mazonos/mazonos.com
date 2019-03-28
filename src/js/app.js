$(function() {
    const extMD5 = {
        'pt-BR': 'json?id=f07e4b484fbffefe60b426b29512efae',
        'en': 'json?id=b2cf5823ee89f52bbab7c4ac2ddf88be'
    };

    // set text language based on browser language
    $("[data-localize]").localize("lang/mazon", {
        // language: 'pt_BR',
        fileExtension: extMD5[$.defaultLanguage] || 'json',
        skipLanguage: /^en/ // prevent reload default language
    });

    // language switcher
    $("a[data-lang]").on({
        click: function() {
            switch ($(this).attr("data-lang")) {
                case 'en':
                    $('[data-localize]').localize('lang/mazon', { language: 'en', fileExtension: extMD5['en'] });
                    break;
                case 'pt-BR':
                    $('[data-localize]').localize('lang/mazon', { language: 'pt-BR', fileExtension: extMD5['pt-BR'] });
                    break;
                default:
                    break;
            }

            // prevent link action
            return false;
        }
    });
})
